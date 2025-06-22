import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SocialShare } from "@/components/social-share"
import Link from "next/link"
import { CalendarIcon, Clock, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Generate static params for static export
export async function generateStaticParams() {
  try {
    // In production, fetch from API
    if (API_BASE_URL.includes('localhost')) {
      // For development/build without backend, return sample params
      return [
        { id: 'sample-blog-post-1' },
        { id: 'sample-blog-post-2' },
        { id: 'sample-blog-post-3' },
      ]
    }

    const response = await fetch(`${API_BASE_URL}/blogs?status=published`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      console.warn('Failed to fetch blog posts for static generation')
      return []
    }
    
    const posts = await response.json()
    return posts.map((post: any) => ({
      id: post._id
    }))
  } catch (error) {
    console.warn('Error generating static params for blog:', error)
    // Return empty array to allow build to continue
    return []
  }
}

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

async function fetchBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function fetchRelatedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?status=published`, {
      cache: 'no-store'
    })
    if (response.ok) {
      const data = await response.json()
      // Get 3 random posts for related posts
      const shuffled = data.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    }
    return []
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, relatedPosts] = await Promise.all([
    fetchBlogPost(params.id),
    fetchRelatedPosts()
  ])

  if (!post) {
    notFound()
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
                    <div className="flex justify-center">
                      <SocialShare title={post.title} />
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
