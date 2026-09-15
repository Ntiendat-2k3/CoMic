"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Clock,
  Download,
  Heart,
  KeyRound,
  LogOut,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useDictionary } from "@/i18n/I18nProvider";

interface MobileAccountPanelProps {
  open: boolean;
  onClose: () => void;
}

interface AccountLink {
  icon: LucideIcon;
  label: string;
  href?: string;
}

/** Hiển thị các thao tác tài khoản có dữ liệu thật và đánh dấu rõ tính năng chưa hỗ trợ. */
export default function MobileAccountPanel({ open, onClose }: MobileAccountPanelProps) {
  const { account, auth, navigation } = useDictionary();
  const { user, isLoading, signOut } = useAuthSession();

  if (!open) return null;

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.username || auth.accountFallback;
  const username = user?.user_metadata?.username;
  const accountLinks: AccountLink[] = [
    { icon: Clock, label: navigation.history, href: "/lich-su" },
    { icon: Heart, label: navigation.favorites, href: "/yeu-thich" },
    { icon: Download, label: navigation.offlineLibrary, href: "/offline" },
    { icon: KeyRound, label: account.changePassword, href: "/update-password" },
    { icon: UserRound, label: account.personalInfo },
    { icon: Settings, label: account.appSettings },
  ];

  async function handleSignOut() {
    await signOut();
    onClose();
  }

  return (
    <div className="fixed inset-x-0 bottom-[4.75rem] top-0 z-40 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={account.closeAriaLabel}
        onClick={onClose}
      />

      <aside
        id="mobile-account-panel"
        aria-labelledby="mobile-account-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-hidden border-l border-white/10 bg-[#0f121b] shadow-[-24px_0_70px_rgba(0,0,0,.5)]"
      >
        <header className="flex h-12 flex-none items-center justify-between border-b border-white/[0.07] px-4 pt-[env(safe-area-inset-top)]">
          <span className="size-9" aria-hidden="true" />
          <h2 id="mobile-account-title" className="text-sm font-bold text-white">
            {account.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            aria-label={account.closeAriaLabel}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 p-4" aria-hidden="true">
              <div className="h-36 animate-pulse rounded-3xl bg-white/[0.05]" />
              <div className="h-64 animate-pulse rounded-3xl bg-white/[0.05]" />
            </div>
          ) : user ? (
            <>
              <section className="relative overflow-hidden border-b border-white/[0.07] px-5 py-3 text-center">
                <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_50%_0%,rgba(244,114,182,.24),transparent_72%)]" aria-hidden="true" />
                <div className="relative mx-auto grid size-16 place-items-center rounded-full border-2 border-pink-300/70 bg-[#181824] shadow-[0_0_30px_rgba(244,114,182,.18)]">
                  <Image src="/assets/logo.png" alt="" width={52} height={52} className="size-[3.25rem] object-contain" />
                  <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-[3px] border-[#0f121b] bg-emerald-400" aria-hidden="true" />
                </div>
                <h3 className="relative mt-2 truncate text-sm font-bold text-white">{displayName}</h3>
                <p className="relative mt-0.5 truncate text-xs text-gray-400">
                  {username ? `@${username}` : user.email}
                </p>
              </section>

              <nav className="p-2" aria-label={account.actionsAriaLabel}>
                <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                  {accountLinks.map(({ icon: Icon, label, href }) =>
                    href ? (
                      <Link
                        key={label}
                        href={href}
                        onClick={onClose}
                        className="group flex min-h-11 items-center gap-3 border-b border-white/[0.06] px-3 py-2 text-sm text-gray-200 transition-colors last:border-b-0 hover:bg-white/[0.05] hover:text-pink-200"
                      >
                        <Icon size={18} className="text-gray-400 transition-colors group-hover:text-pink-300" aria-hidden="true" />
                        <span className="flex-1">{label}</span>
                        <ChevronRight size={16} className="text-gray-600" aria-hidden="true" />
                      </Link>
                    ) : (
                      <div
                        key={label}
                        className="flex min-h-11 items-center gap-3 border-b border-white/[0.06] px-3 py-2 text-sm text-gray-500 last:border-b-0"
                        aria-disabled="true"
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="flex-1">{label}</span>
                        <span className="rounded-full bg-white/[0.05] px-2 py-1 text-[10px] text-gray-500">
                          {account.comingSoon}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {auth.signOut}
                </button>
              </nav>
            </>
          ) : (
            <section className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
              <div className="grid size-24 place-items-center rounded-[2rem] border border-pink-300/20 bg-[radial-gradient(circle_at_50%_20%,rgba(244,114,182,.2),rgba(255,255,255,.02))]">
                <Image src="/assets/logo.png" alt="" width={76} height={76} className="size-[4.75rem] object-contain" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-white">{account.guestTitle}</h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-gray-400">{account.guestDescription}</p>
              <div className="mt-7 grid w-full max-w-xs grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 px-4 text-sm font-bold text-[#25101a] shadow-[0_12px_28px_rgba(236,72,153,.22)]"
                >
                  {auth.signIn}
                </Link>
                <Link
                  href="/sign-up"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-pink-400/35 bg-pink-500/10 px-4 text-sm font-semibold text-pink-200"
                >
                  {auth.signUp}
                </Link>
              </div>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
