"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageSquare, Send, Search, Plus, Clock, CheckCircle, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/loading"
import { toast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [messageForm, setMessageForm] = useState({
    to: "",
    subject: "",
    message: ""
  })

  // API function to send message
  const sendMessage = async () => {
    try {
      setIsSending(true)
      
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to send messages",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageForm)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Message sent successfully!"
        })
        setMessageForm({ to: "", subject: "", message: "" })
        setIsDialogOpen(false)
        // Optionally refresh message list here
      } else {
        toast({
          title: "Error",
          description: data.message || 'Failed to send message',
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setMessageForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageForm.to || !messageForm.subject || !messageForm.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    sendMessage()
  }

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: "Dr. Sarah Johnson",
          subject: "Blood Drive Results - Downtown Center",
          preview: "The blood drive at Downtown Center was a huge success! We collected 45 units...",
          time: "2 hours ago",
          read: false,
          priority: "high",
          avatar: "/placeholder.svg",
        },
        {
          id: 2,
          sender: "Mike Chen",
          subject: "Volunteer Schedule Update",
          preview: "Hi team, I wanted to update you on the volunteer schedule for next week...",
          time: "4 hours ago",
          read: true,
          priority: "normal",
          avatar: "/placeholder.svg",
        },
        {
          id: 3,
          sender: "Emily Rodriguez",
          subject: "Donor Follow-up Required",
          preview: "We need to follow up with the donors from yesterday's mobile unit...",
          time: "1 day ago",
          read: false,
          priority: "medium",
          avatar: "/placeholder.svg",
        },
        {
          id: 4,
          sender: "System Notification",
          subject: "Monthly Report Generated",
          preview: "Your monthly donation report has been generated and is ready for review...",
          time: "2 days ago",
          read: true,
          priority: "low",
          avatar: "/placeholder.svg",
        },
        {
          id: 5,
          sender: "David Wilson",
          subject: "Equipment Maintenance Schedule",
          preview: "Reminder: Equipment maintenance is scheduled for this Friday...",
          time: "3 days ago",
          read: true,
          priority: "normal",
          avatar: "/placeholder.svg",
        },
      ])
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredMessages = messages.filter(
    (message) =>
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => !m.read).length

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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground mt-1">Manage communications and notifications</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Compose New Message</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Send a message to team members or donors
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">To</label>
                    <Input 
                      placeholder="Enter recipient email" 
                      className="bg-background border-border"
                      value={messageForm.to}
                      onChange={(e) => handleFormChange('to', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <Input 
                      placeholder="Message subject" 
                      className="bg-background border-border"
                      value={messageForm.subject}
                      onChange={(e) => handleFormChange('subject', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <Textarea
                      placeholder="Type your message here..."
                      value={messageForm.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      rows={4}
                      className="bg-background border-border"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { title: "Total Messages", value: messages.length.toString(), color: "text-blue-500" },
          { title: "Unread", value: unreadCount.toString(), color: "text-orange-500" },
          { title: "Sent Today", value: "12", color: "text-green-500" },
          { title: "Response Rate", value: "94%", color: "text-purple-500" },
        ].map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-300 bg-card border-border">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                </div>
                <MessageSquare className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages List */}
      <Card className="shadow-lg border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl text-foreground">Recent Messages</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-background border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-border ${
                  !message.read ? "border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10" : "bg-card"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                      <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        {message.sender
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium truncate ${!message.read ? "font-bold" : ""} text-foreground`}>
                            {message.sender}
                          </h3>
                          {message.priority === "high" && (
                            <Badge variant="destructive" className="text-xs">
                              High
                            </Badge>
                          )}
                          {message.priority === "medium" && (
                            <Badge variant="secondary" className="text-xs">
                              Medium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {message.time}
                          {message.read && <CheckCircle className="h-3 w-3 text-green-500" />}
                        </div>
                      </div>
                      <h4 className={`text-sm mb-1 truncate ${!message.read ? "font-semibold" : ""} text-foreground`}>
                        {message.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
