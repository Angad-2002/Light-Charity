"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Heart, Search, Filter, Download, Calendar, MapPin, MoreHorizontal } from "lucide-react"
import { Skeleton } from "@/components/ui/loading"

export default function DonationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [donations, setDonations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setDonations([
        {
          id: "DON-001",
          donorName: "John Doe",
          bloodType: "O+",
          date: "2023-06-15",
          location: "Downtown Center",
          status: "completed",
          units: 1,
          testResults: "cleared",
        },
        {
          id: "DON-002",
          donorName: "Jane Smith",
          bloodType: "A-",
          date: "2023-06-14",
          location: "Westside Clinic",
          status: "processing",
          units: 1,
          testResults: "pending",
        },
        {
          id: "DON-003",
          donorName: "Robert Johnson",
          bloodType: "B+",
          date: "2023-06-13",
          location: "Central Hospital",
          status: "completed",
          units: 2,
          testResults: "cleared",
        },
        {
          id: "DON-004",
          donorName: "Emily Davis",
          bloodType: "AB+",
          date: "2023-06-12",
          location: "Community Center",
          status: "completed",
          units: 1,
          testResults: "cleared",
        },
        {
          id: "DON-005",
          donorName: "Michael Wilson",
          bloodType: "O-",
          date: "2023-06-11",
          location: "Mobile Unit #3",
          status: "rejected",
          units: 0,
          testResults: "failed",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredDonations = donations.filter(
    (donation) =>
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.bloodType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = [
    { title: "Total Donations", value: "0", change: "+0%", color: "text-red-500" },
    { title: "This Month", value: "0", change: "+0%", color: "text-blue-500" },
    { title: "Pending Tests", value: "0", change: "+0%", color: "text-orange-500" },
    { title: "Success Rate", value: "0%", change: "+0%", color: "text-green-500" },
  ]

  if (isLoading) {
    return (
      <div className="container animate-fade-in p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-card">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-12" />
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Blood Donations</h1>
            <p className="text-muted-foreground mt-1">Track and manage all blood donations and their status</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-border hover:bg-muted">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <Heart className="h-4 w-4 mr-2" />
              New Donation
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
                  <div className="flex items-center mt-2">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        stat.change.startsWith("+")
                          ? "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-300"
                          : "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Donations Table */}
      <Card className="shadow-lg border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl text-foreground">Recent Donations</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-background border-border"
                />
              </div>
              <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Donation ID</TableHead>
                  <TableHead className="text-muted-foreground">Donor</TableHead>
                  <TableHead className="text-muted-foreground">Blood Type</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground">Units</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Tests</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-muted/50 border-border">
                    <TableCell className="font-medium text-foreground">{donation.id}</TableCell>
                    <TableCell className="text-foreground">{donation.donorName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono border-border">
                        {donation.bloodType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{donation.date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{donation.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{donation.units}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          donation.status === "completed"
                            ? "default"
                            : donation.status === "processing"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          donation.testResults === "cleared"
                            ? "default"
                            : donation.testResults === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {donation.testResults}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          <DropdownMenuItem className="hover:bg-muted">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted">Download Report</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted">Contact Donor</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
