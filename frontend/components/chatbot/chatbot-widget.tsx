"use client"

import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  MapPin,
  UserPlus,
  Droplet,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RotateCcw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading"
import { cn } from "@/lib/utils"
import { MessageRenderer } from "./message-renderer"
import { CopyButton } from "./copy-button"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "quick-actions"
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [sessionId, setSessionId] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize session ID when component mounts
    if (!sessionId) {
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      localStorage.setItem('chatbot-session-id', newSessionId)
    }
  }, [sessionId])

  useEffect(() => {
    // Check backend connectivity
    const checkConnection = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chatbot/health`)
        if (response.ok) {
          setIsConnected(true)
          setIsOnline(true)
        } else {
          setIsConnected(false)
          setIsOnline(false)
        }
      } catch (error) {
        console.warn('Backend not reachable, using fallback mode')
        setIsConnected(false)
        setIsOnline(true) // Show as online but use fallback
      }
    }

    checkConnection()
    
    // Check connection periodically
    const interval = setInterval(checkConnection, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when first opened
      const welcomeMessage: Message = {
        id: "welcome",
        content: `Hi there! 👋 I'm your Blood Donation Assistant powered by AI.

## I can help you with:
- Understanding blood donation process
- Eligibility requirements and preparation
- Finding donation centers and scheduling
- Blood types and compatibility
- Website navigation and features

How can I assist you today?`,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages([welcomeMessage])

      // Add quick suggestions after a delay
      setTimeout(() => {
        const suggestionsMessage: Message = {
          id: "suggestions",
          content: "Here are some popular topics I can help with:",
          sender: "bot",
          timestamp: new Date(),
          type: "quick-actions",
        }

        setMessages((prev) => [...prev, suggestionsMessage])
      }, 2000)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    const currentInput = input
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      if (isConnected) {
        // Try to use the backend API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chatbot/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: currentInput,
            sessionId: sessionId,
            userId: 'anonymous', // Could be enhanced with actual user IDs
            messages: messages
          }),
        })

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success && data.response) {
          // Update session ID if returned from backend
          if (data.sessionId && data.sessionId !== sessionId) {
            setSessionId(data.sessionId)
            localStorage.setItem('chatbot-session-id', data.sessionId)
          }

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, botMessage])
        } else {
          throw new Error(data.error || 'Invalid response from backend')
        }
      } else {
        throw new Error('Backend not connected')
      }
    } catch (error) {
      console.warn('Backend API failed, falling back to local responses:', error)
      setIsConnected(false)
      
      // Enhanced fallback responses
      const botResponse = getEnhancedBotResponse(currentInput.toLowerCase())
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const getEnhancedBotResponse = (message: string): string => {
    // More comprehensive fallback responses with better formatting
    if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return `Hello! 👋 Welcome to Light Charity's Blood Donation Assistant!

## I'm here to help you with:

• Blood donation information and process
• Eligibility requirements and preparation  
• Finding donation centers near you
• Scheduling appointments
• Understanding blood types

What would you like to know about blood donation today?`
    } 
    
    else if (message.includes("blood") && (message.includes("what") || message.includes("about"))) {
      return `# About Blood

Blood is a vital fluid that circulates through our bodies, carrying oxygen, nutrients, and waste products to and from our cells. 

## Components:

• **Plasma:** Clear liquid carrying proteins, nutrients, and hormones
• **Red Blood Cells:** Carry oxygen from lungs to body tissues
• **White Blood Cells:** Fight infections and diseases  
• **Platelets:** Help with blood clotting to stop bleeding

> Blood is essential for life, and donations help save up to **3 lives** per donation! 🩸

Would you like to know more about the donation process?`
    }
    
    else if (message.includes("donor") || message.includes("donate") || message.includes("donation")) {
      return `## Blood Donation - Save Lives! ❤️

Every blood donation can save up to **3 lives**. Here's what you need to know:

**Quick Actions:**

• Use the 'Register as Donor' button below
• Visit our signup page for full registration
• Schedule an appointment at your convenience

**Benefits of Donating:**

• Save lives in your community
• Free health screening
• Feel good about helping others
• Join our donor recognition program

Ready to become a hero? The process is quick and easy!`
    }
    
    else if (message.includes("eligib") || message.includes("qualify") || message.includes("requirements")) {
      return `## Donation Eligibility Requirements

**Basic Requirements:**

• Age: 18-65 years old
• Weight: At least 50kg (110 lbs)
• Good general health
• No recent illness or fever

**Preparation Tips:**

• Get good night's sleep
• Eat healthy meal before donating
• Drink plenty of water
• Bring valid ID
• Avoid alcohol 24 hours before

**Wait Periods:**

• 56 days between whole blood donations
• Recent tattoos/piercings may require waiting

Would you like to check if you're eligible to donate?`
    }
    
    else if (message.includes("blood") && message.includes("type")) {
      return `## Blood Types & Compatibility

**Universal Types:**

• **O Negative:** Universal donor - can donate to all types
• **AB Positive:** Universal plasma donor

**Most Needed Types:**

• O Negative (only 7% of population)
• O Positive (most common - 37% of population)  
• B Negative (rare type)

**All Blood Types Accepted:**

🅰️ A Positive & A Negative
🅱️ B Positive & B Negative  
🅾️ O Positive & O Negative
🆎 AB Positive & AB Negative

Every donation is valuable regardless of your blood type!`
    }
    
    else if (message.includes("location") || message.includes("center") || message.includes("near") || message.includes("where")) {
      return `## Finding Donation Centers

📍 **Easy Ways to Find Centers:**

• Use 'Find Nearest Center' button below
• Visit our interactive map on the website
• Call our helpline for directions
• Check our mobile blood drive schedule

**Our Services:**

• Permanent donation centers
• Mobile blood drives  
• Corporate donation programs
• School and community partnerships

We have multiple locations across the city for your convenience!`
    }
    
    else if (message.includes("process") || message.includes("what happens") || message.includes("steps")) {
      return `# Donation Process - Step by Step

## 1. Registration *(5 mins)*

• Check-in and provide ID
• Complete basic information

## 2. Health Screening *(10-15 mins)*

• Mini-physical and questionnaire
• Check blood pressure, temperature, iron levels

## 3. Donation *(8-10 mins)*

• Comfortable chair, sterile equipment
• About 1 pint (450ml) collected
• Minimal discomfort - like a brief pinch

## 4. Recovery *(10-15 mins)*

• Rest and enjoy refreshments
• Receive donation certificate

---

**Total Time:** 45-60 minutes  
*Most of your time is spent on screening and recovery!*`
    }
    
    else if (message.includes("appointment") || message.includes("schedule") || message.includes("book")) {
      return `## Scheduling Your Donation

📅 **Easy Scheduling Options:**

• Online appointment booking
• Call our centers directly  
• Walk-in appointments (limited)
• Group appointments for organizations

**Best Times:**

• Weekday mornings (less crowded)
• Avoid lunch hours
• Weekend slots available

**What to Bring:**

• Valid government-issued ID
• List of current medications
• Comfortable clothing

Ready to schedule? Use our online booking system!`
    }
    
    else if (message.includes("after") || message.includes("recovery") || message.includes("care")) {
      return `## After Your Donation - Important Care

**Immediate Care (First 4-6 hours):**

• Keep bandage on
• Drink extra fluids
• Eat iron-rich foods
• Avoid heavy lifting

**Next 24-48 Hours:**

• Continue drinking extra fluids
• Avoid alcohol for 24 hours
• Eat well-balanced meals
• Get adequate rest

**When to Contact Us:**

• Unusual bruising or pain
• Feeling dizzy or faint
• Any concerns about your donation site

Your health and comfort are our priority!`
    }
    
    else if (message.includes("thank")) {
      return `You're very welcome! 🙏 

## Thank YOU for your interest in saving lives!

Every potential donor like you makes a difference in our community. Your willingness to help others is truly inspiring.

**What's Next?**

• Ready to donate? Use the quick actions below
• Have more questions? I'm here to help
• Want to learn more? Explore our website

Is there anything else I can help you with today?`
    }
    
    else if (message.includes("website") || message.includes("features") || message.includes("navigate")) {
      return `## Website Features & Navigation

**Main Sections:**

• **Home:** Welcome and quick access
• **Donate:** Schedule appointments, find drives
• **Locations:** Interactive map of centers
• **Dashboard:** Track your donation history
• **About:** Learn about our mission
• **News:** Latest updates and health info

**Quick Actions Available:**

• Register as donor
• Find nearest center  
• Check blood availability
• Schedule appointment
• View donation history

Need help with any specific feature?`
    }
    
    else {
      return `I'm here to help with blood donation questions! 🤖

## I can assist with:

• Blood donation process and requirements
• Finding donation centers and scheduling
• Understanding blood types and compatibility  
• Website navigation and features
• Preparation and aftercare information

## Popular Questions:

• "Am I eligible to donate blood?"
• "What should I expect during donation?"
• "Where can I find donation centers?"
• "What are the different blood types?"

What specific information can I provide for you?`
    }
  }

  // Keep the original for backward compatibility
  const getBotResponse = (message: string): string => {
    return getEnhancedBotResponse(message)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "find-center":
        router.push("/locations")
        setIsOpen(false)
        break
      case "register":
        router.push("/signup")
        setIsOpen(false)
        break
      case "check-availability":
        router.push("/dashboard")
        setIsOpen(false)
        break
      case "donate":
        router.push("/donate")
        setIsOpen(false)
        break
      default:
        break
    }
  }

  const resetChat = async () => {
    try {
      if (isConnected && sessionId) {
        // Try to clear conversation on backend
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chatbot/conversation/${sessionId}`, {
          method: 'DELETE',
        })
      }
    } catch (error) {
      console.warn('Failed to clear backend conversation:', error)
    } finally {
      // Always clear frontend state
      setMessages([])
      setInput("")
      setIsTyping(false)
      
      // Generate new session ID
      const newSessionId = uuidv4()
      setSessionId(newSessionId)
      localStorage.setItem('chatbot-session-id', newSessionId)
    }
  }

  const quickActions = [
    {
      id: "find-center",
      label: "Find Nearest Center",
      icon: MapPin,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "register",
      label: "Register as Donor",
      icon: UserPlus,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "donate",
      label: "Donate Blood",
      icon: Droplet,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: "check-availability",
      label: "Check Blood Availability",
      icon: Droplet,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50 safe-area-inset">
      {isOpen ? (
        <Card
          className={cn(
            "shadow-2xl border-0 transition-all duration-300 animate-scale-in glass",
            isMinimized ? "w-80 h-16" : "w-80 sm:w-96 h-[500px]",
          )}
        >
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 bg-white/20">
                <AvatarFallback className="bg-white/20 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-medium">Blood Donor Assistant</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("w-2 h-2 rounded-full", 
                    isConnected ? "bg-green-400" : 
                    isOnline ? "bg-yellow-400" : "bg-gray-400"
                  )} />
                  <span className="text-xs opacity-90">
                    {isConnected ? "Online" : 
                     isOnline ? "Fallback Mode" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                <span className="sr-only">{isMinimized ? "Maximize" : "Minimize"}</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={resetChat}>
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset chat</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="h-[350px] overflow-y-auto custom-scrollbar p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 animate-slide-up",
                        message.sender === "user" ? "justify-end" : "justify-start",
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg shadow-sm relative group",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white p-3"
                            : "bg-muted",
                        )}
                      >
                        {message.sender === "user" ? (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        ) : (
                          <>
                            {/* Copy button for bot responses */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                              <CopyButton 
                                text={message.content}
                                className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
                              />
                            </div>
                            <div className="p-3">
                              <MessageRenderer 
                                content={message.content} 
                                className="text-gray-800 dark:text-gray-200"
                              />
                            </div>
                          </>
                        )}
                        <p className={cn(
                          "text-xs opacity-70 mt-2",
                          message.sender === "bot" ? "px-3 pb-3" : ""
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8 bg-muted flex-shrink-0">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 animate-slide-up">
                      <Avatar className="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500">
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                        <div className="flex items-center gap-1">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm text-muted-foreground ml-2">Assistant is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.length > 0 &&
                    messages[messages.length - 1].sender === "bot" &&
                    messages[messages.length - 1].type === "quick-actions" && (
                      <div className="grid grid-cols-2 gap-2 mt-4 animate-fade-in">
                        {quickActions.map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            size="sm"
                            className="justify-start h-auto p-3 text-xs hover:shadow-md transition-all duration-200"
                            onClick={() => handleQuickAction(action.id)}
                          >
                            <action.icon className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    )}

                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <form
                  className="flex w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                >
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 focus-visible-ring"
                    disabled={isTyping}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isTyping}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus-visible-ring"
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      ) : (
        <Button
          className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:scale-110 transition-all duration-300 focus-visible-ring"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-500 border-2 border-white animate-pulse">
            <span className="sr-only">New messages</span>
          </Badge>
        </Button>
      )}
    </div>
  )
}
