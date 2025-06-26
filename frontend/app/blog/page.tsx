"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalendarIcon, Clock, User, Search, TrendingUp, Heart, Users, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

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

const categories = ["All", "news", "blog", "event", "story"]

const categoryDisplayNames: Record<string, string> = {
  "All": "All",
  "news": "News", 
  "blog": "Education",
  "event": "Events",
  "story": "Stories"
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterPosts()
  }, [blogPosts, activeCategory, searchQuery])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/blogs?status=published`)
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      const data = await response.json()
      setBlogPosts(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blog posts')
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const filterPosts = () => {
    let filtered = blogPosts

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter(post => post.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPosts(filtered)
  }

  const getFeaturedPost = () => {
    return filteredPosts[0] || null
  }

  const getRecentPosts = () => {
    return filteredPosts.slice(1) || []
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  const getExcerpt = (content: string, maxLength = 150) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchBlogs}>Try Again</Button>
          </div>
        </main>
      </div>
    )
  }

  const featuredPost = getFeaturedPost()
  const recentPosts = getRecentPosts()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 dark:from-red-900/10 dark:to-orange-900/10"></div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Latest Updates</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">News & Stories</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Stay informed with the latest news, educational content, and inspiring stories from our blood donation
                community.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Heart, label: "Lives Saved This Month", value: "0", color: "text-red-500" },
                { icon: Users, label: "New Donors", value: "0", color: "text-blue-500" },
                { icon: Award, label: "Volunteer Hours", value: "0", color: "text-green-500" },
                { icon: TrendingUp, label: "Blood Units Collected", value: "0", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
                <TabsList className="bg-background">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {categoryDisplayNames[category] || category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Results Summary */}
        {(searchQuery || activeCategory !== "All") && (
          <section className="py-4 bg-muted/30">
            <div className="container">
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length === 0 
                  ? "No articles found matching your criteria." 
                  : `Found ${filteredPosts.length} article${filteredPosts.length === 1 ? '' : 's'}`
                }
                {searchQuery && ` for "${searchQuery}"`}
                {activeCategory !== "All" && ` in ${categoryDisplayNames[activeCategory]}`}
              </p>
            </div>
          </section>
        )}

        {/* Featured Article */}
        {featuredPost && (
          <section className="py-16 bg-background">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Featured Article</h2>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <div className="h-64 md:h-full bg-gray-200 dark:bg-gray-700 relative">
                      <Image 
                        src={featuredPost.imageUrl || "/placeholder.svg"} 
                        alt={featuredPost.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">Featured</Badge>
                      <Badge variant="outline">{categoryDisplayNames[featuredPost.category] || featuredPost.category}</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{featuredPost.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {getExcerpt(featuredPost.content, 200)}
                    </p>
                    <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {formatDate(featuredPost.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getReadTime(featuredPost.content)}
                      </div>
                    </div>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      <Link href={`/blog/${featuredPost._id}`}>Read Full Article</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* Recent Articles */}
        {recentPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8 text-foreground">Recent Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      <Image 
                        src={post.imageUrl || "/placeholder.svg"} 
                        alt={post.title} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{categoryDisplayNames[post.category] || post.category}</Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight text-foreground">{post.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {getExcerpt(post.content)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getReadTime(post.content)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/blog/${post._id}`}>Read More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && !loading && (
          <section className="py-16 bg-background">
            <div className="container text-center">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse all categories to find what you're looking for.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                  <Button variant="outline" onClick={() => setActiveCategory("All")}>
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Stay Updated</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter to receive the latest news, stories, and updates from Light Charity
                  directly in your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input placeholder="Enter your email" type="email" className="flex-1 bg-background" />
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
