import { SignupForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/logo"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm py-4">
        <div className="container">
          <Logo />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <SignupForm />
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
