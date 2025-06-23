"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Droplet, FileText, Heart, Users, Shield, Award, MapPin, Phone, Mail, TrendingUp, CheckCircle, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface BlogPost {
  _id: string
  title: string
  content: string
  author: string
  imageUrl: string
  tags: string[]
  category: 'news' | 'blog' | 'event' | 'story'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

const categoryDisplayNames: Record<string, string> = {
  "news": "News", 
  "blog": "Health",
  "event": "Events",
  "story": "Stories"
}

const categoryColors: Record<string, string> = {
  "news": "bg-blue-500 hover:bg-blue-600",
  "blog": "bg-orange-500 hover:bg-orange-600", 
  "event": "bg-red-500 hover:bg-red-600",
  "story": "bg-green-500 hover:bg-green-600"
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated, login } = useAuth()

  useEffect(() => {
    fetchLatestBlogs()
  }, [])

  const fetchLatestBlogs = async () => {
    try {
      setLoadingBlogs(true)
      const response = await fetch(`${API_BASE_URL}/api/blogs?status=published`)
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data.slice(0, 3)) // Get latest 3 posts
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogPosts([])
    } finally {
      setLoadingBlogs(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getExcerpt = (content: string, maxLength = 120) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return ''
    if (user.name) return user.name
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    if (user.firstName) return user.firstName
    return 'User'
  }

  // Handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      setIsLoading(true)
      await login({ email, password })
      // Reset form
      setEmail('')
      setPassword('')
    } catch (error) {
      // Error handling is done in the login function via toast
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 dark:from-orange-950/20 dark:via-red-950/20 dark:to-orange-950/20 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 dark:from-orange-400/5 dark:to-red-400/5"></div>
          <div className="container relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800">
                  <Heart className="h-3 w-3 mr-1" />
                  Saving Lives Together
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Be a Light. <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent leading-[1.3] inline-block">
                    Donate Blood, <br /> Save Lives.
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  Join our community of heroes and help save lives. Every donation counts and can help up to three
                  people in need. Your contribution makes a real difference.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/donate">
                    <Heart className="h-5 w-5 mr-2" />
                    Become a Donor
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
                  <div className="text-sm text-muted-foreground">Lives Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
                  <div className="text-sm text-muted-foreground">Active Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">0</div>
                  <div className="text-sm text-muted-foreground">Centers</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              {/* Conditional rendering based on authentication state */}
              {isAuthenticated ? (
                <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 dark:bg-background/80 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-8 px-8">
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome back, {getUserDisplayName()}!</h2>
                      <p className="text-sm text-muted-foreground">Thank you for being a part of our community</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        asChild
                      >
                        <Link href="/dashboard">
                          <Heart className="h-5 w-5 mr-2" />
                          Go to Dashboard
                        </Link>
                      </Button>
                      
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                        asChild
                      >
                        <Link href="/donate">Schedule Donation</Link>
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Your Impact:</span>
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {(user?.donationCount || 0)} donations
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Lives Saved:</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {(user?.donationCount || 0) * 3}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 dark:bg-background/80 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-8 px-8">
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2 text-foreground">Join Our Community</h2>
                      <p className="text-sm text-muted-foreground">Sign up to start saving lives and track your impact</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSignIn}>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-border focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <PasswordInput
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-border focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full h-12 border-border hover:bg-muted">
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Sign in with Google
                      </Button>
                      <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                          href="/signup"
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline font-medium"
                        >
                          Sign up
                        </Link>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Donate Blood?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your blood donation is a gift of life that creates a ripple effect of hope and healing in our community.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Save Lives</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    One donation can save up to three lives. Your contribution directly impacts families and communities
                    in need.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Health Benefits</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Regular blood donation can help reduce the risk of heart disease and cancer while providing free
                    health screenings.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Community Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Join a community of heroes making a difference in people's lives every day. Together, we save lives.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* New Sections Highlight */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-orange-50/50 dark:from-muted/20 dark:to-orange-950/20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                Explore Our Resources
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Discover How You Can Help</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From donating blood to volunteering your time, there are many ways to get involved and make a meaningful
                impact.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Blog & News Card */}
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <FileText className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">Blog & News</h3>
                    <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                      New
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Stay informed with the latest articles, inspiring stories, and important updates from our community.
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>Updated weekly</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    asChild
                  >
                    <Link href="/blog">Read Latest Articles</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Blood Compatibility Card */}
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Droplet className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">Blood Compatibility</h3>
                    <Badge className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                      Interactive
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Explore our interactive chart to understand blood type compatibility for donations and transfusions.
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <Heart className="h-4 w-4 mr-2" />
                    <span>Find your match</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    asChild
                  >
                    <Link href="/blood-compatibility">View Compatibility Chart</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Volunteer Opportunities Card */}
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <Users className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-foreground">Volunteer With Us</h3>
                    <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
                      Join Us
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Discover ways to contribute beyond donation. Find volunteer opportunities that match your skills and
                    passion.
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Flexible schedules</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    asChild
                  >
                    <Link href="/volunteer">Explore Opportunities</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Preview */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                  Latest Updates
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">From Our Blog</h2>
              </div>
              <Button
                variant="outline"
                className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                asChild
              >
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>

            {loadingBlogs ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden border-0 shadow-lg">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <Card key={post._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-900/50 dark:to-red-900/50 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <Badge className={`${categoryColors[post.category] || 'bg-gray-500 hover:bg-gray-600'} text-white`}>
                          {categoryDisplayNames[post.category] || post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">{formatDate(post.createdAt)}</p>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {getExcerpt(post.content)}
                      </p>
                      <Button
                        variant="link"
                        className="p-0 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        asChild
                      >
                        <Link href={`/blog/${post._id}`}>Read More →</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Blog Posts Yet</h3>
                <p className="text-muted-foreground">Check back soon for the latest updates and stories!</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>
          <div className="container relative text-center">
            <div className="max-w-3xl mx-auto">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/20 mb-6">
                <Award className="h-3 w-3 mr-1" />
                Join Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Save Lives?</h2>
              <p className="text-xl mb-8 text-orange-100">
                Every donation makes a difference. Join thousands of donors who are already making an impact in their
                communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                  <Link href="/donate">
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
                  asChild
                >
                  <Link href="/volunteer">Volunteer With Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Light Charity</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Be a Light. Donate Blood, <br /> Save Lives. Together, we're building a healthier, more caring community.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/donation-process" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Donation Process
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Find Centers
                  </Link>
                </li>
                <li>
                  <Link href="/faqs" className="text-gray-400 hover:text-orange-400 transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/blood-compatibility" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Blood Compatibility
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Get Involved</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/donate" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Donate Blood
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Volunteer
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors">
                    Blog & News
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-6 text-lg">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-400"></span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-400"></span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-400"></span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Newsletter</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500"
                  />
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Light Charity. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}
