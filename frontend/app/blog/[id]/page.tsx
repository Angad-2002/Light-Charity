"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { CalendarIcon, Clock, Facebook, Linkedin, Twitter, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

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
  "blog": "Education",
  "event": "Events",
  "story": "Stories"
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchBlogPost(params.id)
      fetchRelatedPosts()
    }
  }, [params.id])

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`)
      if (!response.ok) {
        throw new Error('Blog post not found')
      }
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs?status=published`)
      if (response.ok) {
        const data = await response.json()
        // Get 3 random posts for related posts
        const shuffled = data.sort(() => 0.5 - Math.random())
        setRelatedPosts(shuffled.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
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

  const getExcerpt = (content: string, maxLength = 120) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText
  }

  const shareOnSocial = (platform: string) => {
    if (!post) return
    
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post.title)
    
    let shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The article you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              <Button asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
          <div className="container max-w-4xl">
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            <Badge className="mb-4">{categoryDisplayNames[post.category] || post.category}</Badge>
            <h1 className="text-4xl font-bold mb-6 text-foreground">{post.title}</h1>
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{getReadTime(post.content)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.imageUrl && (
          <section className="py-8 bg-background">
          <div className="container max-w-4xl">
              <div className="relative rounded-lg overflow-hidden h-80 bg-gray-200 dark:bg-gray-700">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title} 
                  fill 
                  className="object-cover"
                />
              </div>
          </div>
        </section>
        )}

        {/* Blog Content */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Author Sidebar */}
              <div className="md:order-2">
                <div className="sticky top-8 space-y-8">
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback className="text-lg">
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg">{post.author}</h3>
                      <p className="text-primary text-sm mb-2">Author</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Contributing writer for Light Charity's mission to save lives through blood donation.
                      </p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/blog">View All Posts</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Share This Post</h3>
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => shareOnSocial('facebook')}
                      >
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Share on Facebook</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => shareOnSocial('twitter')}
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Share on Twitter</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full"
                        onClick={() => shareOnSocial('linkedin')}
                      >
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">Share on LinkedIn</span>
                      </Button>
                    </div>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3 md:order-1">
                <div 
                  className="prose prose-red max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground" 
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} 
                />

                {/* Call to Action */}
                <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
                  <p className="mb-6 text-muted-foreground">
                    Your blood donation can save up to three lives. Schedule your appointment today and join our
                    community of heroes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    <Link href="/donate">Donate Blood Now</Link>
                  </Button>
                    <Button asChild variant="outline">
                      <Link href="/locations">Find Locations</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-center">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost._id} className="bg-background rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      <Image 
                        src={relatedPost.imageUrl || "/placeholder.svg"} 
                        alt={relatedPost.title} 
                        fill 
                        className="object-cover"
                      />
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="mb-3">
                        {categoryDisplayNames[relatedPost.category] || relatedPost.category}
                    </Badge>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{relatedPost.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {getExcerpt(relatedPost.content)}
                      </p>
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" asChild>
                          <Link href={`/blog/${relatedPost._id}`}>Read More</Link>
                      </Button>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(relatedPost.createdAt)}
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}
      </main>

      <footer className="bg-muted/30 border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
