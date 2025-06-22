"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Users } from "lucide-react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Award,
  Settings,
  Camera,
  Edit,
  Save,
  X
} from "lucide-react"
import { DonorBadge } from "@/components/badges/donor-badge"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    postalCode: "",
    name: "",
    address: ""
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setEditedData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        postalCode: user.postalCode || "",
        name: user.name || "",
        address: user.address || ""
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getUserInitials = () => {
    if (user.userType === 'donor' && user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    if (user.userType === 'hospital' && user.name) {
      return user.name.substring(0, 2).toUpperCase()
    }
    return user.email?.substring(0, 2).toUpperCase() || 'U'
  }

  const getUserDisplayName = () => {
    if (user.userType === 'donor' && user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user.userType === 'hospital' && user.name) {
      return user.name
    }
    return user.email || 'User'
  }

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just show a success message
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    // Reset edited data to original user data
    setEditedData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      dateOfBirth: user.dateOfBirth || "",
      postalCode: user.postalCode || "",
      name: user.name || "",
      address: user.address || ""
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 dark:from-orange-950/20 dark:via-red-950/20 dark:to-orange-950/20">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          {/* Profile Card */}
          <Card className="mb-8 shadow-lg border-0 bg-background/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 shadow-md"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{getUserDisplayName()}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {user.userType}
                      </Badge>
                      {user.userType === 'donor' && (
                        <DonorBadge level="gold" count={user.donationHistory?.length || 0} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {user.userType === 'donor' ? 'Donation Stats' : 'Activity'}
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Personal Information
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {isEditing ? "Edit your personal information below" : "Your personal information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.userType === 'donor' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={editedData.firstName}
                            onChange={(e) => setEditedData({...editedData, firstName: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user.firstName || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={editedData.lastName}
                            onChange={(e) => setEditedData({...editedData, lastName: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user.lastName || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedData.phone}
                            onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        {isEditing ? (
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={editedData.dateOfBirth}
                            onChange={(e) => setEditedData({...editedData, dateOfBirth: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {user.dateOfBirth 
                                ? new Date(user.dateOfBirth).toLocaleDateString()
                                : 'Not provided'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        {isEditing ? (
                          <Input
                            id="postalCode"
                            value={editedData.postalCode}
                            onChange={(e) => setEditedData({...editedData, postalCode: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.postalCode || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      {user.donorNumber && (
                        <div className="space-y-2">
                          <Label>Donor Number</Label>
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span>{user.donorNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Organization Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editedData.name}
                            onChange={(e) => setEditedData({...editedData, name: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{user.name || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedData.phone}
                            onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.phone || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            value={editedData.address}
                            onChange={(e) => setEditedData({...editedData, address: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.address || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        {isEditing ? (
                          <Input
                            id="postalCode"
                            value={editedData.postalCode}
                            onChange={(e) => setEditedData({...editedData, postalCode: e.target.value})}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.postalCode || 'Not provided'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                      <Badge variant="outline" className="ml-auto">Verified</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {user.userType === 'donor' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Donations</p>
                          <p className="text-2xl font-bold text-foreground">
                            {user.donationHistory?.length || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lives Saved</p>
                          <p className="text-2xl font-bold text-foreground">
                            {(user.donationHistory?.length || 0) * 3}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Badge Level</p>
                          <p className="text-2xl font-bold text-foreground">Gold</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Organization Activity</CardTitle>
                    <CardDescription>Your organization's activity summary</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Account Created</Label>
                        <p className="text-sm text-muted-foreground">
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString()
                            : 'N/A'
                          }
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Account Type</Label>
                        <Badge variant="secondary" className="capitalize">
                          {user.userType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive email updates about donations and news</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 