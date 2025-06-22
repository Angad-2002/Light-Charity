import type React from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, Home, LogOut, Mail, MapPin, Menu, Settings, Users, Droplet, PenTool } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DonorBadge } from "@/components/badges/donor-badge"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarUser } from "@/components/dashboard/sidebar-user"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b shadow-sm py-4 bg-card">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-card">
                  <div className="flex flex-col h-full">
                    <div className="py-4">
                      <Logo />
                    </div>
                    <nav className="flex-1 py-4">
                      <ul className="space-y-1">
                        <li>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
                          >
                            <Home className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard/donors"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Users className="h-4 w-4" />
                            Donors
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/donate"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Droplet className="h-4 w-4" />
                            Donate Blood
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard/donations"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Calendar className="h-4 w-4" />
                            Donations
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/locations"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <MapPin className="h-4 w-4" />
                            Locations
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard/messages"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Mail className="h-4 w-4" />
                            Messages
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard/blog/create"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <PenTool className="h-4 w-4" />
                            Create Blog
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <Logo />
            </div>
            <DashboardHeader />
          </div>
        </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/donors"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-4 w-4" />
                  Donors
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Droplet className="h-4 w-4" />
                  Donate Blood
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/donations"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Calendar className="h-4 w-4" />
                  Donations
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <MapPin className="h-4 w-4" />
                  Locations
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/messages"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/blog/create"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <PenTool className="h-4 w-4" />
                  Create Blog
                </Link>
              </li>
                                    <li>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </li>
            </ul>
          </nav>
          <SidebarUser />
        </aside>

        <main className="flex-1 py-6 px-4 md:px-6">{children}</main>
      </div>

      <ChatbotWidget />
    </div>
    </ProtectedRoute>
  )
}
