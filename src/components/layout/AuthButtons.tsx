"use client"

import { LogOut, UserRound } from "lucide-react"
import Link from "next/link"
import { useAuthSession } from "@/features/auth/hooks/useAuthSession"
import { useDictionary } from "@/i18n/I18nProvider"
import { formatMessage } from "@/i18n/format-message"

interface AuthButtonsProps {
  compact?: boolean
}

export default function AuthButtons({ compact = false }: AuthButtonsProps) {
  const { auth } = useDictionary()
  const { user, isLoading, signOut } = useAuthSession()

  if (isLoading) {
    return (
      <div
        className={`${compact ? "size-10 rounded-full" : "h-10 w-20 rounded-xl"} animate-pulse bg-gray-800/60`}
        aria-hidden="true"
      />
    )
  }

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className={compact
          ? "grid size-10 place-items-center rounded-full border border-pink-400/35 bg-pink-500/10 text-pink-200 transition-colors hover:bg-pink-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          : "inline-flex min-h-11 items-center justify-center rounded-xl border border-pink-500/40 bg-pink-500/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"}
        aria-label={compact ? auth.signIn : undefined}
      >
        {compact ? <UserRound aria-hidden="true" size={18} /> : auth.signIn}
      </Link>
    )
  }

  const displayName = user.user_metadata?.full_name || user.email || auth.accountFallback

  if (compact) {
    return (
      <span
        className="relative grid size-10 place-items-center rounded-full border border-pink-400/40 bg-[radial-gradient(circle_at_35%_25%,rgba(244,114,182,.35),rgba(236,72,153,.08))] text-pink-100"
        title={displayName}
        aria-label={formatMessage(auth.signedInAs, { name: displayName })}
      >
        <UserRound aria-hidden="true" size={18} />
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#0d0e16] bg-emerald-400" aria-hidden="true" />
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="grid size-11 place-items-center rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-200"
        title={displayName}
        aria-label={formatMessage(auth.signedInAs, { name: displayName })}
      >
        <UserRound aria-hidden="true" size={19} />
      </span>
      <button
        type="button"
        onClick={signOut}
        className="grid size-11 place-items-center rounded-xl text-gray-300 transition-colors hover:bg-gray-800 hover:text-pink-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
        aria-label={auth.signOut}
      >
        <LogOut aria-hidden="true" size={19} />
      </button>
    </div>
  )
}
