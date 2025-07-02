"use client"

import { memo, useState } from "react"
import dynamic from "next/dynamic"
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"

// Lazy load custom auth components
const CustomSignIn = dynamic(() => import("./auth/CustomSignIn"), {
  ssr: false,
})

const CustomSignUp = dynamic(() => import("./auth/CustomSignUp"), {
  ssr: false,
})

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
const MobileAuthButtons = memo(() => {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleSwitchToSignUp = () => {
    setShowSignIn(false)
    setShowSignUp(true)
  }

  const handleSwitchToSignIn = () => {
    setShowSignUp(false)
    setShowSignIn(true)
  }

  const handleCloseAll = () => {
    setShowSignIn(false)
    setShowSignUp(false)
  }

  return (
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
        <button
          onClick={() => setShowSignIn(true)}
          aria-label="Đăng nhập"
          className="rounded px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/10 hover:opacity-80 touch-manipulation"
        >
          Đăng nhập
        </button>

        {showSignIn && <CustomSignIn onClose={handleCloseAll} onSwitchToSignUp={handleSwitchToSignUp} />}

        {showSignUp && <CustomSignUp onClose={handleCloseAll} onSwitchToSignIn={handleSwitchToSignIn} />}
      </SignedOut>
    </>
  )
})

MobileAuthButtons.displayName = "MobileAuthButtons"

// Memoized Desktop Auth Buttons
const DesktopAuthButtons = memo(() => {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  const handleSwitchToSignUp = () => {
    setShowSignIn(false)
    setShowSignUp(true)
  }

  const handleSwitchToSignIn = () => {
    setShowSignUp(false)
    setShowSignIn(true)
  }

  const handleCloseAll = () => {
    setShowSignIn(false)
    setShowSignUp(false)
  }

  return (
    <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-4">
      <SignedIn>
        <DesktopSignedIn />
      </SignedIn>

      <SignedOut>
        <button
          onClick={() => setShowSignIn(true)}
          className="rounded px-3 py-2 transition-colors duration-200 hover:bg-white/10 hover:opacity-80 touch-manipulation"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setShowSignUp(true)}
          className="rounded-md bg-white px-4 py-2 text-primary transition-colors duration-200 hover:bg-primary-light hover:text-white touch-manipulation"
        >
          Đăng ký
        </button>

        {showSignIn && <CustomSignIn onClose={handleCloseAll} onSwitchToSignUp={handleSwitchToSignUp} />}

        {showSignUp && <CustomSignUp onClose={handleCloseAll} onSwitchToSignIn={handleSwitchToSignIn} />}
      </SignedOut>
    </div>
  )
})

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
