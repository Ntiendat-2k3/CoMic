"use client"

import { LockKeyhole, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { useDictionary } from "@/i18n/I18nProvider"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import styles from "./AuthPageShell.module.scss"

interface PasswordRecoveryFormProps {
  mode: "request" | "update"
}

/** Gửi email khôi phục hoặc cập nhật mật khẩu cho phiên recovery đã xác thực. */
export default function PasswordRecoveryForm({ mode }: PasswordRecoveryFormProps) {
  const { auth } = useDictionary()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: "error" | "success"; text: string } | null>(null)
  const isUpdate = mode === "update"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)

    if (isUpdate && password !== confirmPassword) {
      setFeedback({ kind: "error", text: auth.passwordMismatch })
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setFeedback({ kind: "error", text: auth.missingConfiguration })
      return
    }

    setIsSubmitting(true)
    const { error } = isUpdate
      ? await supabase.auth.updateUser({ password })
      : await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        })

    if (error) {
      setFeedback({ kind: "error", text: auth.genericError })
      setIsSubmitting(false)
      return
    }

    if (isUpdate) {
      router.replace("/")
      router.refresh()
      return
    }

    setFeedback({ kind: "success", text: auth.resetEmailSent })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <h2 className={styles.formTitle}>{isUpdate ? auth.updatePasswordTitle : auth.recoveryTitle}</h2>
        <p className={styles.formDescription}>
          {isUpdate ? auth.updatePasswordDescription : auth.recoveryDescription}
        </p>
      </div>

      {!isUpdate && (
        <div className={styles.fieldGroup}>
          <label htmlFor="recovery-email" className={styles.srOnly}>{auth.emailLabel}</label>
          <Mail className={styles.fieldIcon} aria-hidden="true" size={19} />
          <input
            id="recovery-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={auth.emailPlaceholder}
            className={styles.input}
            required
            disabled={isSubmitting}
          />
        </div>
      )}

      {isUpdate && (
        <>
          <div className={styles.fieldGroup}>
            <label htmlFor="new-password" className={styles.srOnly}>{auth.passwordLabel}</label>
            <LockKeyhole className={styles.fieldIcon} aria-hidden="true" size={19} />
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={auth.newPasswordPlaceholder}
              className={styles.input}
              minLength={8}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="confirm-new-password" className={styles.srOnly}>{auth.confirmPasswordLabel}</label>
            <LockKeyhole className={styles.fieldIcon} aria-hidden="true" size={19} />
            <input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={auth.confirmPasswordLabel}
              className={styles.input}
              minLength={8}
              required
              disabled={isSubmitting}
            />
          </div>
        </>
      )}

      {feedback && (
        <p
          className={feedback.kind === "error" ? styles.errorMessage : styles.successMessage}
          role={feedback.kind === "error" ? "alert" : "status"}
        >
          {feedback.text}
        </p>
      )}

      <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
        {isSubmitting ? auth.submitting : isUpdate ? auth.savePassword : auth.sendRecoveryLink}
      </button>
    </form>
  )
}
