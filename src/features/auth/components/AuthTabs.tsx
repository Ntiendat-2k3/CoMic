"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useDictionary } from "@/i18n/I18nProvider"
import styles from "./AuthPageShell.module.scss"

/** Giữ thanh tab ổn định giữa hai route và bảo toàn đường dẫn đích sau đăng nhập. */
export default function AuthTabs() {
  const { auth } = useDictionary()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isSignUp = pathname === "/sign-up"
  const next = searchParams.get("next")
  const suffix = next ? `?next=${encodeURIComponent(next)}` : ""

  return (
    <nav className={styles.authTabs} aria-label={auth.authModeAriaLabel}>
      <span
        className={`${styles.tabIndicator} ${isSignUp ? styles.tabIndicatorRight : ""}`}
        aria-hidden="true"
      />
      <Link
        href={`/sign-in${suffix}`}
        className={isSignUp ? styles.inactiveTab : styles.activeTab}
        aria-current={!isSignUp ? "page" : undefined}
      >
        {auth.signIn}
      </Link>
      <Link
        href={`/sign-up${suffix}`}
        className={isSignUp ? styles.activeTab : styles.inactiveTab}
        aria-current={isSignUp ? "page" : undefined}
      >
        {auth.signUp}
      </Link>
    </nav>
  )
}
