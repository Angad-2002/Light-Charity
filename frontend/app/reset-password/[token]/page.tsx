'use client'

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Logo } from "@/components/logo"
import { useParams } from 'next/navigation'

interface ResetPasswordPageProps {
  params: {
    token: string
  }
}

export default function ResetPasswordPage() {
  const params = useParams()
  const token = params.token as string

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm py-4">
        <div className="container">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <ResetPasswordForm token={token} />
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
} 