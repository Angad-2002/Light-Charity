"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DonorBadge } from "@/components/badges/donor-badge"

export function SidebarUser() {
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

  if (!user) return null

  return (
    <div className="p-4 border-t">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
            <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {user.userType === 'donor' && (
            <div className="absolute -top-1 -right-1">
              <DonorBadge level="gold" count={user.donationHistory?.length || 0} size="sm" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {getUserDisplayName()}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start mt-4"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  )
}