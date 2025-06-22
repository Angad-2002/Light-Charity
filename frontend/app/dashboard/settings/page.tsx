"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"
import { Loader2, User, Shield, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user, refreshProfile, logout } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    address: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        postalCode: user.postalCode || "",
        address: (user as any).address || "",
      })
    }
  }, [user])

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic frontend validation
    if (user?.userType === 'donor') {
      if (!profileData.firstName || profileData.firstName.length < 2) {
        toast({
          title: "Validation Error",
          description: "First name must be at least 2 characters long.",
          variant: "destructive",
        })
        return
      }
      if (!profileData.lastName || profileData.lastName.length < 2) {
        toast({
          title: "Validation Error", 
          description: "Last name must be at least 2 characters long.",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!profileData.name || profileData.name.length < 2) {
        toast({
          title: "Validation Error",
          description: "Organization name must be at least 2 characters long.",
          variant: "destructive",
        })
        return
      }
    }

    if (profileData.address && profileData.address.length < 10) {
      toast({
        title: "Validation Error",
        description: "Address must be at least 10 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the actual backend API to update profile
      const updateData = {
        email: profileData.email,
        phone: profileData.phone,
        postalCode: profileData.postalCode,
        address: profileData.address,
        ...(user?.userType === 'donor' ? {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
        } : {
          name: profileData.name,
        })
      }

      await authService.updateProfile(updateData)
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
      
      // Refresh profile data
      await refreshProfile()
    } catch (error: any) {
      console.error('Profile update error:', error)
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Call the actual backend API to change password
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
      
      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      console.error('Password change error:', error)
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)

    try {
      // Call the actual backend API to deactivate account
      await authService.deleteAccount()
      
      toast({
        title: "Account deactivated",
        description: "Your account has been deactivated successfully.",
      })
      
      // Logout to redirect to login page
      await logout()
    } catch (error: any) {
      console.error('Account deactivation error:', error)
      toast({
        title: "Deactivation failed",
        description: error.message || "Failed to deactivate account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        {/* Header with user info */}
        <div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
            <AvatarFallback className="text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="mt-1 capitalize">
              {user.userType}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and contact details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  {user.userType === 'donor' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={isLoading}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={profileData.postalCode}
                      onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <h3 className="font-medium text-destructive mb-2">Deactivate Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Deactivating your account will disable access and hide your profile. 
                    Your data will be preserved and you can contact support to reactivate later.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Deactivate Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to deactivate?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will deactivate your account and you won't be able to log in. 
                          Your data will be preserved and you can contact support to reactivate your account later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deactivate Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 