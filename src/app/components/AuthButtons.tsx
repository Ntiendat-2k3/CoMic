"use client"

import { memo } from "react"
import dynamic from "next/dynamic"
import { SignInButton, SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs"

// Tránh hydration mismatch: <UserButton> chỉ render phía client
const UserBtn = dynamic(() => import("@clerk/nextjs").then((m) => m.UserButton), {
  ssr: false,
  loading: () => <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />,
})

interface Props {
  variant?: "mobile" | "desktop"
}

// Memoized Desktop SignedIn Component
const DesktopSignedIn = memo(() => {
  const { user } = useUser()
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
              userButtonTrigger: "size-10 text-white hover:bg-white/10 transition-colors duration-200",
            },
          }}
        />
      </div>
    </>
  )
})

DesktopSignedIn.displayName = "DesktopSignedIn"

// Memoized Mobile Auth Buttons
const MobileAuthButtons = memo(() => (
  <>
    <SignedIn>
      <UserBtn
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonBox: "flex-row-reverse",
            userButtonAvatarBox: "size-10",
            userButtonTrigger: "size-9 text-white hover:bg-white/10 transition-colors duration-200",
          },
        }}
      />
    </SignedIn>

    <SignedOut>
      <SignInButton mode="modal">
        <button
          aria-label="Đăng nhập"
          className="rounded px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/10 hover:opacity-80 touch-manipulation"
        >
          Đăng nhập
        </button>
      </SignInButton>
    </SignedOut>
  </>
))

MobileAuthButtons.displayName = "MobileAuthButtons"

// Memoized Desktop Auth Buttons
const DesktopAuthButtons = memo(() => (
  <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
    <SignedIn>
      <DesktopSignedIn />
    </SignedIn>

    <SignedOut>
      <SignInButton mode="modal">
        <button className="rounded px-3 py-2 transition-colors duration-200 hover:bg-white/10 hover:opacity-80 touch-manipulation">
          Đăng nhập
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="rounded-md bg-white px-4 py-2 text-primary transition-colors duration-200 hover:bg-primary-light hover:text-white touch-manipulation">
          Đăng ký
        </button>
      </SignUpButton>
    </SignedOut>
  </div>
))

DesktopAuthButtons.displayName = "DesktopAuthButtons"

// Main AuthButtons Component
const AuthButtons = memo(({ variant = "desktop" }: Props) => {
  if (variant === "mobile") {
    return <MobileAuthButtons />
  }

  return <DesktopAuthButtons />
})

AuthButtons.displayName = "AuthButtons"

export default AuthButtons
