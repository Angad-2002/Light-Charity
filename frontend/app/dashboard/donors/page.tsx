"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DonorBadge } from "@/components/badges/donor-badge"
import { BadgeFilter } from "@/components/badges/badge-filter"
import { Search, Filter, UserPlus, Phone, Mail, MapPin, MoreHorizontal, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/loading"

export default function DonorsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [donors, setDonors] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDonors([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          bloodType: "O+",
          donations: 0,
          lastDonation: "2023-06-15",
          status: "active",
          location: "New York, NY",
          badgeLevel: "gold" as const,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1 (555) 234-5678",
          bloodType: "A-",
          donations: 0,
          lastDonation: "2023-05-20",
          status: "eligible",
          location: "Los Angeles, CA",
          badgeLevel: "bronze" as const,
        },
        {
          id: 3,
          name: "Robert Johnson",
          email: "robert@example.com",
          phone: "+1 (555) 345-6789",
          bloodType: "B+",
          donations: 0,
          lastDonation: "2023-03-10",
          status: "active",
          location: "Chicago, IL",
          badgeLevel: "lifesaver" as const,
        },
        {
          id: 4,
          name: "Emily Davis",
          email: "emily@example.com",
          phone: "+1 (555) 456-7890",
          bloodType: "AB+",
          donations: 0,
          lastDonation: "2023-06-05",
          status: "active",
          location: "Houston, TX",
          badgeLevel: "silver" as const,
        },
        {
          id: 5,
          name: "Michael Wilson",
          email: "michael@example.com",
          phone: "+1 (555) 567-8901",
          bloodType: "O-",
          donations: 0,
          lastDonation: "2023-02-28",
          status: "pending",
          location: "Phoenix, AZ",
          badgeLevel: "bronze" as const,
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBadge = selectedBadge ? donor.badgeLevel === selectedBadge : true

    return matchesSearch && matchesBadge
  })

  const stats = [
    { title: "Total Donors", value: donors.length.toString(), color: "text-blue-500" },
    {
      title: "Active Donors",
      value: donors.filter((d) => d.status === "active").length.toString(),
      color: "text-green-500",
    },
    { title: "New This Month", value: "0", color: "text-orange-500" },
    {
      title: "Lifesaver Badges",
      value: donors.filter((d) => d.badgeLevel === "lifesaver").length.toString(),
      color: "text-red-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="container p-4 md:p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-card">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-card">
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Blood Donors</h1>
            <p className="text-muted-foreground mt-1">Manage and track all registered blood donors</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-border hover:bg-muted">
              <Filter className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Donor
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
                <Users className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-border bg-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl text-foreground">Donor Directory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search donors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-background border-border"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <BadgeFilter selectedBadge={selectedBadge} onBadgeChange={setSelectedBadge} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <Card
                key={donor.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-card border-border"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg" alt={donor.name} />
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            {donor.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1">
                          <DonorBadge level={donor.badgeLevel} count={donor.donations} size="sm" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{donor.name}</h3>
                        <p className="text-sm text-muted-foreground">{donor.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem className="hover:bg-muted">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-muted">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-muted">
                          <MapPin className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Blood Type:</span>
                      <Badge variant="outline" className="font-mono border-border">
                        {donor.bloodType}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Donations:</span>
                      <span className="text-sm font-medium text-foreground">{donor.donations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Donation:</span>
                      <span className="text-sm font-medium text-foreground">{donor.lastDonation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          donor.status === "active" ? "default" : donor.status === "eligible" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {donor.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm font-medium text-foreground truncate">{donor.location}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-muted">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-muted">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDonors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No donors found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
