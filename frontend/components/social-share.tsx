"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Twitter } from "lucide-react"

interface SocialShareProps {
  title: string
  url?: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const shareOnSocial = (platform: string) => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)
    
    let socialUrl = ''
    switch (platform) {
      case 'facebook':
        socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        socialUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
        break
      case 'linkedin':
        socialUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
    }
    
    if (socialUrl) {
      window.open(socialUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => shareOnSocial('facebook')}
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => shareOnSocial('twitter')}
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => shareOnSocial('linkedin')}
      >
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  )
} 