"use client";

import dynamic from "next/dynamic";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

// Tránh hydration mismatch: <UserButton> chỉ render phía client
const UserBtn = dynamic(() => import("@clerk/nextjs").then(m => m.UserButton), {
  ssr: false,
});

interface Props {
  /** Mặc định "desktop". Dùng "mobile" cho avatar thu gọn trên màn hình nhỏ */
  variant?: "mobile" | "desktop";
}

/* -------------------------------------------------------------------------- */
export default function AuthButtons({ variant = "desktop" }: Props) {
  if (variant === "mobile") {
    return (
      <>
        <SignedIn>
          <UserBtn
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonBox: "flex-row-reverse",
                userButtonAvatarBox: "size-10",
                userButtonTrigger: "size-9 text-white hover:bg-white/10",
              },
            }}
          />
        </SignedIn>

        {/* Chưa đăng nhập: hiển thị nút đăng nhập nhỏ gọn */}
        <SignedOut>
          <SignInButton mode="modal">
            <button
              aria-label="Đăng nhập"
              className="rounded px-2 py-2 text-sm transition hover:bg-white/10 hover:opacity-80"
            >
              Đăng nhập
            </button>
          </SignInButton>
        </SignedOut>
      </>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
      {/* Đã đăng nhập */}
      <SignedIn>
        <DesktopSignedIn />
      </SignedIn>

      {/* Chưa đăng nhập */}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="rounded px-3 py-2 transition hover:bg-white/10 hover:opacity-80">
            Đăng nhập
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="rounded-md bg-white px-4 py-2 text-primary transition-colors hover:bg-primary-light hover:text-white">
            Đăng ký
          </button>
        </SignUpButton>
      </SignedOut>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
function DesktopSignedIn() {
  const { user } = useUser();
  return (
    <>
      <span className="hidden whitespace-nowrap lg:block">Hi, {user?.fullName}</span>
      <div className="hidden md:block lg:block">
        <UserBtn
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonBox: "flex-row-reverse",
              userButtonAvatarBox: "size-11",
              userButtonTrigger: "size-10 text-white hover:bg-white/10",
            },
          }}
        />
      </div>
    </>
  );
}
