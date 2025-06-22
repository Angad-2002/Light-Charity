import { LocationMap } from "@/components/maps/location-map"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Home, Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"

export default function LocationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b shadow-sm py-4 bg-gray-900 dark:bg-gray-900">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-800">
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
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                        >
                          <Home className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/locations"
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground"
                        >
                          Find Locations
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <div className="text-white">
              <Logo />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-gray-800">
              <Link href="/dashboard">
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-4 md:py-8 px-4 md:px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-white">
            Find Donation Centers
          </h1>
          <LocationMap />
        </div>
      </main>

      <footer className="py-6 border-t bg-gray-900 dark:bg-gray-900">
        <div className="container text-center text-sm text-white">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}
