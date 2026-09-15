"use client"

import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { FcGoogle } from "react-icons/fc"
import { useDictionary } from "@/i18n/I18nProvider"
import { formatMessage } from "@/i18n/format-message"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSafeRedirectPath } from "../redirect"
import styles from "./AuthPageShell.module.scss"

type AuthMode = "sign-in" | "sign-up"
type SignInApiError =
  | "auth_rate_limit"
  | "configuration"
  | "email_not_confirmed"
  | "invalid_credentials"
  | "username_not_configured"

interface AuthFormProps {
  initialError?: string
  mode: AuthMode
  redirectTo?: string
}

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/

/** Điều phối đăng nhập, đăng ký và OAuth trực tiếp từ giao diện custom. */
export default function AuthForm({ initialError, mode, redirectTo }: AuthFormProps) {
  const { auth } = useDictionary()
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: "error" | "success"; text: string } | null>(() => {
    if (!initialError) return null
    return {
      kind: "error",
      text: initialError === "configuration" ? auth.missingConfiguration : auth.genericError,
    }
  })

  const nextPath = getSafeRedirectPath(redirectTo)
  const isSignUp = mode === "sign-up"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (isSignUp && password !== confirmPassword) {
      setFeedback({ kind: "error", text: auth.passwordMismatch })
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setFeedback({ kind: "error", text: auth.missingConfiguration })
      return
    }

    setIsSubmitting(true)

    try {
      if (isSignUp) {
        const normalizedUsername = username.trim().toLowerCase()
        if (!USERNAME_PATTERN.test(normalizedUsername)) {
          setFeedback({ kind: "error", text: auth.invalidUsername })
          return
        }

        const { data: isAvailable, error: availabilityError } = await supabase.rpc(
          "is_username_available",
          { candidate: normalizedUsername },
        )

        if (availabilityError) {
          setFeedback({ kind: "error", text: auth.usernameLoginNotConfigured })
          return
        }

        if (!isAvailable) {
          setFeedback({ kind: "error", text: auth.usernameTaken })
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            data: { username: normalizedUsername },
          },
        })

        if (error) {
          if (error.code === "over_email_send_rate_limit") {
            setFeedback({ kind: "error", text: auth.emailRateLimit })
          } else if (error.status === 429) {
            setFeedback({ kind: "error", text: auth.authRateLimit })
          } else if (error.code === "email_address_not_authorized") {
            setFeedback({ kind: "error", text: auth.emailNotAuthorized })
          } else if (error.code === "user_already_exists") {
            setFeedback({ kind: "error", text: auth.invalidCredentials })
          } else {
            setFeedback({ kind: "error", text: auth.genericError })
          }
          return
        }

        if (!data.session) {
          setFeedback({ kind: "success", text: auth.checkEmail })
          return
        }
      } else {
        const response = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        })

        if (!response.ok) {
          const result = (await response.json().catch(() => null)) as { error?: SignInApiError } | null
          const messageByError: Record<SignInApiError, string> = {
            auth_rate_limit: auth.authRateLimit,
            configuration: auth.missingConfiguration,
            email_not_confirmed: auth.emailNotConfirmed,
            invalid_credentials: auth.invalidCredentials,
            username_not_configured: auth.usernameLoginNotConfigured,
          }
          setFeedback({
            kind: "error",
            text: result?.error ? messageByError[result.error] : auth.genericError,
          })
          return
        }
      }

      router.replace(nextPath)
      router.refresh()
    } catch {
      setFeedback({ kind: "error", text: auth.genericError })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setFeedback(null)
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setFeedback({ kind: "error", text: auth.missingConfiguration })
      return
    }

    setIsGooglePending(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })

    if (error) {
      const isProviderDisabled =
        error.code === "validation_failed" || error.message.toLowerCase().includes("provider is not enabled")
      setFeedback({ kind: "error", text: isProviderDisabled ? auth.providerNotEnabled : auth.genericError })
      setIsGooglePending(false)
    }
  }

  const isPending = isSubmitting || isGooglePending

  return (
    <div className={styles.formStack}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {isSignUp ? (
          <>
            <div className={styles.labeledField}>
              <label htmlFor="sign-up-username" className={styles.fieldLabel}>
                {auth.usernameLabel}
              </label>
              <div className={styles.fieldGroup}>
                <UserRound className={styles.fieldIcon} aria-hidden="true" size={19} />
                <input
                  id="sign-up-username"
                  name="username"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={auth.usernamePlaceholder}
                  className={styles.input}
                  minLength={3}
                  maxLength={24}
                  pattern="[A-Za-z0-9_]{3,24}"
                  aria-describedby="username-hint"
                  required
                  disabled={isPending}
                />
              </div>
              <p id="username-hint" className={styles.fieldHint}>
                {auth.usernameHint}
              </p>
            </div>

            <div className={styles.labeledField}>
              <div className={styles.fieldHeader}>
                <label htmlFor="sign-up-email" className={styles.fieldLabel}>
                  {auth.emailLabel}
                </label>
                <span className={styles.fieldNote}>{auth.emailRecoveryNote}</span>
              </div>
              <div className={styles.fieldGroup}>
                <Mail className={styles.fieldIcon} aria-hidden="true" size={19} />
                <input
                  id="sign-up-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={auth.emailPlaceholder}
                  className={styles.input}
                  required
                  disabled={isPending}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.fieldGroup}>
            <label htmlFor="sign-in-identifier" className={styles.srOnly}>
              {auth.identifierLabel}
            </label>
            <UserRound className={styles.fieldIcon} aria-hidden="true" size={19} />
            <input
              id="sign-in-identifier"
              name="identifier"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder={auth.identifierPlaceholder}
              className={styles.input}
              required
              disabled={isPending}
            />
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label htmlFor={`${mode}-password`} className={styles.srOnly}>
            {auth.passwordLabel}
          </label>
          <LockKeyhole className={styles.fieldIcon} aria-hidden="true" size={19} />
          <input
            id={`${mode}-password`}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={auth.passwordPlaceholder}
            className={styles.input}
            minLength={isSignUp ? 8 : undefined}
            required
            disabled={isPending}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? auth.hidePasswordAriaLabel : auth.showPasswordAriaLabel}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}
          </button>
        </div>

        {isSignUp && (
          <div className={styles.fieldGroup}>
            <label htmlFor="confirm-password" className={styles.srOnly}>
              {auth.confirmPasswordLabel}
            </label>
            <LockKeyhole className={styles.fieldIcon} aria-hidden="true" size={19} />
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={auth.confirmPasswordLabel}
              className={styles.input}
              minLength={8}
              required
              disabled={isPending}
            />
          </div>
        )}

        {!isSignUp && (
          <div className={styles.formMeta}>
            <span />
            <Link href="/forgot-password" className={styles.textLink}>
              {auth.forgotPassword}
            </Link>
          </div>
        )}

        {feedback && (
          <p
            className={feedback.kind === "error" ? styles.errorMessage : styles.successMessage}
            role={feedback.kind === "error" ? "alert" : "status"}
          >
            {feedback.text}
          </p>
        )}

        <button type="submit" className={styles.primaryButton} disabled={isPending}>
          {isSubmitting ? auth.submitting : isSignUp ? auth.signUp : auth.signIn}
        </button>
      </form>

      <div className={styles.divider}>
        <span />
        <p>{auth.socialDivider}</p>
        <span />
      </div>

      <div className={styles.socialButtons}>
        <button
          type="button"
          className={styles.socialButton}
          onClick={handleGoogleSignIn}
          disabled={isPending}
          aria-label={formatMessage(auth.signInWith, { provider: "Google" })}
        >
          <FcGoogle aria-hidden="true" size={21} />
          <span>{auth.googleLogin}</span>
          {isGooglePending && <span className={styles.spinner} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
