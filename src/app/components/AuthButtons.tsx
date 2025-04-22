"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

/**
 * Hiển thị khu vực đăng nhập/đăng ký.
 * - variant="mobile": chỉ avatar (thu gọn) cho màn hình nhỏ.
 * - variant="desktop": full khối (mặc định) cho màn hình ≥ md.
 */
export default function AuthButtons({
  variant = "desktop",
}: {
  variant?: "mobile" | "desktop";
}) {
  const { isSignedIn, user } = useUser();

  /* ----------------------- Mobile avatar thu gọn ------------------------ */
  if (variant === "mobile") {
    return (
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonBox: "flex-row-reverse",
            userButtonAvatarBox: "size-10",
            userButtonTrigger: "size-9 text-white hover:bg-white/10",
          },
        }}
      />
    );
  }

  /* -------------------------- Desktop / Full --------------------------- */
  return (
    <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
      {isSignedIn ? (
        <>
          <span className="hidden whitespace-nowrap lg:block">
            Hi, {user?.fullName}
          </span>
          <div className="hidden md:block lg:block">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonBox: "flex-row-reverse",
                  userButtonAvatarBox: "size-11",
                  userButtonTrigger:
                    "size-10 text-white hover:bg-white/10",
                },
              }}
            />
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
