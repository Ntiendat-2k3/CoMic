import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Suspense, type ReactNode } from "react"
import { getDictionary } from "@/i18n/dictionaries"
import AuthTabs from "./AuthTabs"
import styles from "./AuthPageShell.module.scss"

interface AuthPageShellProps {
  children: ReactNode
}

export default function AuthPageShell({ children }: AuthPageShellProps) {
  const { auth, brand } = getDictionary()

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="auth-brand-title">
        <Image
          src="/assets/login-hero.png"
          alt={brand.loginHeroAlt}
          fill
          priority
          quality={80}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className={styles.heroImage}
        />
        <div className={styles.heroScrim} />

        <Link href="/" className={styles.backButton} aria-label={auth.backHomeAriaLabel}>
          <ArrowLeft aria-hidden="true" size={22} strokeWidth={1.8} />
        </Link>

        <div className={styles.brandBlock}>
          <Image
            src="/assets/logo.png"
            alt=""
            width={72}
            height={72}
            className={styles.brandLogo}
          />
          <h1 id="auth-brand-title" className={styles.brandName}>
            {brand.name}
          </h1>
          <p className={styles.brandTagline}>{brand.tagline}</p>
        </div>
      </section>

      <section className={styles.authPanel} aria-label={auth.authRegionAriaLabel}>
        <div className={styles.authShell}>
          <Suspense fallback={<div className={styles.authTabsPlaceholder} />}>
            <AuthTabs />
          </Suspense>

          <div className={styles.formArea}>{children}</div>
        </div>
      </section>
    </main>
  )
}
