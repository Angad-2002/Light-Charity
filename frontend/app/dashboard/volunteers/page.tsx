"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Eye, Mail, Phone, Calendar, Clock, Users } from "lucide-react"

interface VolunteerApplication {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  interests: string[]
  availability: string[]
  message: string
  status: 'pending' | 'contacted' | 'approved' | 'rejected'
  applicationDate: string
  contactedDate?: string
  notes?: string
}

interface Stats {
  total: number
  thisMonth: number
  pending: number
  contacted: number
  approved: number
  rejected: number
}

const statusColors = {
  pending: "bg-yellow-500",
  contacted: "bg-blue-500",
  approved: "bg-green-500",
  rejected: "bg-red-500"
}

export default function VolunteerDashboard() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<VolunteerApplication[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    thisMonth: 0,
    pending: 0,
    contacted: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchApplications = async () => {
    try {
      const statusParam = selectedStatus !== "all" ? `?status=${selectedStatus}` : ""
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/volunteer/applications${statusParam}`)
      const result = await response.json()
      
      if (response.ok) {
        setApplications(result.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch applications",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Network Error",
        description: "Please check your connection",
        variant: "destructive",
      })
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/volunteer/applications/stats`)
      const result = await response.json()
      
      if (response.ok) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/volunteer/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: "Application status updated successfully",
        })
        fetchApplications()
        fetchStats()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Network Error",
        description: "Please check your connection",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchApplications(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [selectedStatus])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Volunteer Applications</h1>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.contacted}</div>
                <div className="text-xs text-muted-foreground">Contacted</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-green-500 rounded-full" />
              <div>
                <div className="text-2xl font-bold">{stats.approved}</div>
                <div className="text-xs text-muted-foreground">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-red-500 rounded-full" />
              <div>
                <div className="text-2xl font-bold">{stats.rejected}</div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No applications found
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {application.firstName} {application.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {application.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {application.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(application.applicationDate)}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusColors[application.status]} text-white`}>
                      {application.status}
                    </Badge>
                    <Select 
                      value={application.status} 
                      onValueChange={(value) => updateApplicationStatus(application._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Areas of Interest:</h4>
                    <div className="flex flex-wrap gap-1">
                      {application.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Availability:</h4>
                    <div className="flex flex-wrap gap-1">
                      {application.availability.map((time) => (
                        <Badge key={time} variant="outline">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {application.message && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                      {application.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 