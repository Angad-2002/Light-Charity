import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Light Charity",
  description: "Be a Light. Donate Blood, \nSave Lives.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  icons: {
    icon: [
      { url: '/images/light-charity-logo-new.png' },
      { url: '/images/light-charity-logo-new.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/light-charity-logo-new.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/light-charity-logo-new.png',
    apple: '/images/light-charity-logo-new.png',
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
