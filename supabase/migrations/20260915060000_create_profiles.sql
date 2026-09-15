-- Hồ sơ công khai chỉ giữ username; email và mật khẩu tiếp tục do Supabase Auth quản lý.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,24}$')
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon;
grant select, update on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

create policy "Người dùng đọc hồ sơ của chính mình"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Người dùng cập nhật hồ sơ của chính mình"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Trigger chạy với quyền chủ sở hữu để Auth có thể tạo hồ sơ dù bảng đã bật RLS.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_username text;
  generated_username text;
  username_base text;
begin
  requested_username := nullif(lower(trim(new.raw_user_meta_data ->> 'username')), '');

  if requested_username is not null then
    if requested_username !~ '^[a-z0-9_]{3,24}$' then
      raise exception 'invalid_username' using errcode = '22023';
    end if;
    generated_username := requested_username;
  else
    username_base := trim(both '_' from regexp_replace(
      lower(split_part(coalesce(new.email, 'user'), '@', 1)),
      '[^a-z0-9_]+', '_', 'g'
    ));
    if length(username_base) < 3 then
      username_base := 'user';
    end if;
    generated_username := left(username_base, 11) || '_' || left(replace(new.id::text, '-', ''), 12);
  end if;

  insert into public.profiles (id, username)
  values (new.id, generated_username);
  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Tạo profile an toàn cho tài khoản có sẵn trước migration.
insert into public.profiles (id, username)
select id, 'user_' || left(replace(id::text, '-', ''), 12)
from auth.users
on conflict (id) do nothing;

-- Client chỉ nhận boolean, không thể đọc danh sách username hoặc email.
create or replace function public.is_username_available(candidate text)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select
    lower(trim(candidate)) ~ '^[a-z0-9_]{3,24}$'
    and not exists (
      select 1
      from public.profiles
      where username = lower(trim(candidate))
    );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;
