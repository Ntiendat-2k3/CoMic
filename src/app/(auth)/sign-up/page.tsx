import AuthForm from "@/features/auth/components/AuthForm"

interface SignUpPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { next } = await searchParams
  return <AuthForm mode="sign-up" redirectTo={next} />
}
