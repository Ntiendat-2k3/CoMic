import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform">
              TruyenHay
            </h1>
          </Link>
          <p className="text-gray-400 mt-2">Tạo tài khoản mới</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              card: "bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 shadow-2xl rounded-2xl w-full",
              header: "hidden", // Hide default header with logo
              socialButtonsBlockButton: "border border-gray-700/50 bg-gray-900/50 hover:bg-gray-800 text-white transition-colors h-11 rounded-xl",
              socialButtonsBlockButtonText: "text-gray-200 font-medium",
              dividerLine: "bg-gray-700/50",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput: "bg-gray-900/50 border border-gray-700/50 text-white rounded-xl focus:ring-pink-500 focus:border-pink-500 h-11",
              formButtonPrimary: "bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/20 text-white rounded-xl font-bold transition-all h-11",
              footerActionText: "text-gray-400",
              footerActionLink: "text-pink-400 hover:text-pink-300 font-semibold",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-pink-400",
              formFieldSuccessText: "text-green-400",
              formFieldErrorText: "text-red-400",
              alertText: "text-red-400",
              alert: "bg-red-500/10 border border-red-500/30 text-red-400",
              rootBox: "w-full flex justify-center",
            },
            variables: {
              colorPrimary: "#ec4899",
              colorBackground: "transparent",
              colorText: "white",
              colorInputText: "white",
            }
          }}
        />
      </div>
    </div>
  );
}