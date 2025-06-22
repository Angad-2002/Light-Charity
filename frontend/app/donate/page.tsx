import { DonationForm } from "@/components/donation/donation-form"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Home, Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"

export default function DonatePage() {
  return (
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
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <Logo />
                  </div>
                  <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          <Home className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/donate"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
                        >
                          Donate Blood
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 md:px-6 bg-muted/30">
        <div className="container flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Donate Blood</h1>
          <DonationForm />
        </div>
      </main>

      <footer className="py-6 border-t bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}
