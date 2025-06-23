"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Heart,
  Users,
  Calendar,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Activity,
  Target,
  Zap,
} from "lucide-react"
import { Skeleton, CardSkeleton } from "@/components/ui/loading"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [bloodData, setBloodData] = useState<any[]>([])
  const [recentDonors, setRecentDonors] = useState<any[]>([])
  const { user } = useAuth()

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBloodData([
        { group: "A+", available: 0, required: 0, trend: "+0%" },
        { group: "A-", available: 0, required: 0, trend: "+0%" },
        { group: "B+", available: 0, required: 0, trend: "+0%" },
        { group: "B-", available: 0, required: 0, trend: "+0%" },
        { group: "AB+", available: 0, required: 0, trend: "+0%" },
        { group: "AB-", available: 0, required: 0, trend: "+0%" },
        { group: "O+", available: 0, required: 0, trend: "+0%" },
        { group: "O-", available: 0, required: 0, trend: "+0%" },
      ])

      setRecentDonors([
        { name: "John Doe", group: "O+", donations: 0, date: "2023-04-15", status: "active" },
        { name: "Jane Smith", group: "A-", donations: 0, date: "2023-05-20", status: "active" },
        { name: "Robert Johnson", group: "B+", donations: 0, date: "2023-03-10", status: "eligible" },
        { name: "Emily Davis", group: "AB+", donations: 0, date: "2023-06-05", status: "active" },
        { name: "Michael Wilson", group: "O-", donations: 0, date: "2023-02-28", status: "pending" },
      ])

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getUserWelcomeMessage = () => {
    if (user?.userType === 'donor' && user.firstName) {
      return `Welcome back, ${user.firstName}!`
    }
    if (user?.userType === 'hospital' && user.name) {
      return `Welcome back, ${user.name}!`
    }
    return 'Welcome back!'
  }

  const stats = [
    {
      title: "Total Donations",
      value: "0",
      change: "+0%",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
    {
      title: "Active Donors",
      value: "0",
      change: "+0%",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "This Month",
      value: "0",
      change: "+0%",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Success Rate",
      value: "0%",
      change: "+0%",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ]

  if (isLoading) {
    return (
      <div className="container animate-fade-in">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <div>
            <CardSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">
              {getUserWelcomeMessage()} Here's what's happening with blood donations today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
            >
              <Activity className="h-3 w-3 mr-1" />
              System Healthy
            </Badge>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              <Heart className="h-4 w-4 mr-2" />
              Quick Donate
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="group hover:shadow-lg transition-all duration-300 border-border shadow-md animate-slide-up bg-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
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
                    <span className="text-xs text-muted-foreground ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-muted">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="donors" className="data-[state=active]:bg-background data-[state=active]:text-foreground">
            Donors
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Blood Group Status */}
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground">Blood Inventory Status</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Current blood type availability</p>
                </div>
                <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Trends
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bloodData.map((blood, index) => (
                  <Card
                    key={blood.group}
                    className="group hover:shadow-md transition-all duration-300 animate-scale-in bg-card border-border"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-foreground">{blood.group}</h3>
                        <Badge
                          variant={blood.available >= blood.required ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {blood.available >= blood.required ? "Good" : "Low"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available:</span>
                          <span className="font-medium text-foreground">{blood.available} units</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Required:</span>
                          <span className="font-medium text-foreground">{blood.required} units</span>
                        </div>
                        <Progress value={(blood.available / blood.required) * 100} className="h-2 mt-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span
                            className={`font-medium ${
                              blood.trend.startsWith("+")
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {blood.trend}
                          </span>
                          <span className="text-muted-foreground">this week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-lg border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Frequently used actions</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Request Donation",
                    description: "Send urgent blood requests",
                    icon: Heart,
                    color: "from-red-500 to-pink-500",
                    href: "/dashboard/requests",
                  },
                  {
                    title: "Schedule Drive",
                    description: "Organize donation events",
                    icon: Calendar,
                    color: "from-blue-500 to-cyan-500",
                    href: "/dashboard/events",
                  },
                  {
                    title: "Find Donors",
                    description: "Search available donors",
                    icon: Users,
                    color: "from-green-500 to-emerald-500",
                    href: "/dashboard/donors",
                  },
                ].map((action, index) => (
                  <Card
                    key={action.title}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer animate-slide-up bg-card border-border"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`inline-flex p-4 rounded-full bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                      <Button variant="outline" size="sm" className="border-border hover:bg-muted" asChild>
                        <Link href={action.href}>Get Started</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donors" className="space-y-6">
          <Card className="shadow-lg border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground">Recent Donors</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Latest donor activities</p>
                </div>
                <Button variant="outline" size="sm" className="border-border hover:bg-muted" asChild>
                  <Link href="/dashboard/donors">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonors.map((donor, index) => (
                  <div
                    key={donor.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:shadow-md transition-all duration-300 animate-slide-up bg-card"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src="/placeholder.svg" alt={donor.name} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          {donor.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{donor.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs border-border">
                            {donor.group}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{donor.donations} donations</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{donor.date}</p>
                        <Badge
                          variant={
                            donor.status === "active"
                              ? "default"
                              : donor.status === "eligible"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {donor.status}
                        </Badge>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Target className="h-5 w-5" />
                  Monthly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Donations Target</span>
                      <span className="text-foreground">89/100</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">New Donors</span>
                      <span className="text-foreground">23/30</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Events Hosted</span>
                      <span className="text-foreground">4/5</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Response Time", value: "2.3s", trend: "-12%" },
                    { label: "Success Rate", value: "98.5%", trend: "+2%" },
                    { label: "Donor Satisfaction", value: "4.8/5", trend: "+5%" },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{metric.value}</span>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            metric.trend.startsWith("+")
                              ? "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-300"
                              : "text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          {metric.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
