import AuthForm from "@/features/auth/components/AuthForm"

interface SignInPageProps {
  searchParams: Promise<{ error?: string; next?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, next } = await searchParams
  return <AuthForm mode="sign-in" redirectTo={next} initialError={error} />
}
