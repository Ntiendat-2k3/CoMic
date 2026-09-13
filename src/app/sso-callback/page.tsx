import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"
import { getDictionary } from "@/i18n/dictionaries"

export default function SSOCallback() {
  const { auth } = getDictionary()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">{auth.callbackTitle}</h2>
        <p className="text-gray-400">{auth.callbackDescription}</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
