"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Home, LogOut, Settings, User, ChevronDown, Menu, X } from "lucide-react"
import { DonorBadge } from "@/components/badges/donor-badge"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  // Create display user with donor info - fallback for when backend doesn't provide badge info
  const displayUser = user ? {
    ...user,
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    avatar: user.avatar || "/placeholder.svg",
    donationCount: user.donationCount || 0,
    badgeLevel: user.badgeLevel || "bronze" as const,
  } : null

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 safe-area-inset",
        isScrolled
          ? "bg-background/95 dark:bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-background/80 dark:bg-background/80 backdrop-blur-sm border-b border-transparent",
      )}
    >
      <div className="container flex justify-between items-center py-3 md:py-4">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 hover:text-primary hover:bg-primary/10 focus-visible-ring"
              >
                About
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 animate-scale-in">
              <DropdownMenuItem asChild>
                <Link href="/about" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/donation-process" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Donation Process
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/faqs" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  FAQs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/blood-compatibility" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Blood Compatibility
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/locations"
            className="text-sm font-medium hover:text-primary transition-colors focus-visible-ring rounded-sm px-2 py-1"
          >
            Find Centers
          </Link>

          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors focus-visible-ring rounded-sm px-2 py-1 relative"
          >
            Blog & News
            <Badge className="absolute -top-2 -right-2 h-2 w-2 p-0 bg-primary dark:bg-orange-400 animate-pulse" />
          </Link>

          <Link
            href="/volunteer"
            className="text-sm font-medium hover:text-primary transition-colors focus-visible-ring rounded-sm px-2 py-1"
          >
            Volunteer
          </Link>

          <ThemeToggle />

          {isAuthenticated && displayUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-3 p-2 hover:bg-primary/10 focus-visible-ring"
                  >
                    <DonorBadge level={displayUser.badgeLevel} count={displayUser.donationCount} size="sm" />
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        {displayUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 animate-scale-in">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{displayUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Home className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 hover:text-primary focus-visible-ring"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 focus-visible-ring"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          {displayUser && (
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={displayUser.avatar || "/placeholder.svg"} alt={displayUser.name} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                {displayUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-primary/10 focus-visible-ring touch-manipulation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 dark:bg-background/95 backdrop-blur-md border-t shadow-lg animate-slide-up">
          <div className="container py-4 space-y-2 safe-area-inset">
            {isAuthenticated && displayUser ? (
              <>
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg mb-4">
                  <DonorBadge level={displayUser.badgeLevel} count={displayUser.donationCount} size="sm" />
                  <div>
                    <p className="font-medium text-sm">{displayUser.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            <div className="border-t border-border pt-2 mt-2">
              {[
                { href: "/about", label: "About Us" },
                { href: "/donation-process", label: "Donation Process" },
                { href: "/faqs", label: "FAQs" },
                { href: "/blood-compatibility", label: "Blood Compatibility" },
                { href: "/locations", label: "Find Centers" },
                { href: "/blog", label: "Blog & News" },
                { href: "/volunteer", label: "Volunteer" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {isAuthenticated && displayUser && (
              <div className="border-t border-border pt-2 mt-2">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-colors touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button 
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors w-full text-left touch-manipulation"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
