"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Calendar, Mail, MapPin, Settings, Droplet } from "lucide-react"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/dashboard/donors",
    label: "Donors",
    icon: Users,
  },
  {
    href: "/donate",
    label: "Donate Blood",
    icon: Droplet,
  },
  {
    href: "/dashboard/donations",
    label: "Donations",
    icon: Calendar,
  },
  {
    href: "/locations",
    label: "Locations",
    icon: MapPin,
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: Mail,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || 
          (item.href === "/dashboard" && pathname === "/dashboard") ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
} 