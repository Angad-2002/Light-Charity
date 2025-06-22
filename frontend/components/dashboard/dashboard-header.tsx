"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Mail, Settings, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DonorBadge } from "@/components/badges/donor-badge"
import Link from "next/link"

export function DashboardHeader() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  const getUserInitials = () => {
    if (user?.userType === 'donor' && user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    if (user?.userType === 'hospital' && user.name) {
      return user.name.substring(0, 2).toUpperCase()
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'U'
  }

  const getUserDisplayName = () => {
    if (user?.userType === 'donor' && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.userType === 'hospital' && user.name) {
      return user.name
    }
    return user?.email || 'User'
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
        <span className="sr-only">Notifications</span>
      </Button>
      
      <Button variant="ghost" size="icon">
        <Mail className="h-5 w-5" />
        <span className="sr-only">Messages</span>
      </Button>

      {user?.userType === 'donor' && (
        <DonorBadge level="gold" count={user.donationHistory?.length || 0} />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.userType || 'User'}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 