import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Logo } from "@/components/logo"

// Generate static params for static export
export async function generateStaticParams() {
  // Reset password tokens are dynamic and cannot be predetermined
  // Return empty array to allow static export but handle tokens dynamically
  return []
}

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm py-4">
        <div className="container">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <ResetPasswordForm token={params.token} />
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 