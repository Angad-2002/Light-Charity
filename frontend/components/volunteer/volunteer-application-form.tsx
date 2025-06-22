"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  interests: string[]
  availability: string[]
  message: string
}

const interestOptions = ["Event Support", "Office Support", "Outreach", "Logistics", "Donor Relations", "Marketing"]
const availabilityOptions = ["Weekdays", "Weekends", "Mornings", "Afternoons", "Evenings"]

export function VolunteerApplicationForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interests: [],
    availability: [],
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (field: 'interests' | 'availability', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/volunteer/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Application Submitted Successfully!",
          description: "Thank you for your interest in volunteering. We'll contact you soon.",
        })
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          interests: [],
          availability: [],
          message: ""
        })
      } else {
        toast({
          title: "Submission Failed",
          description: result.message || "Please try again later.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-foreground">Volunteer Application</CardTitle>
        <CardDescription>
          Please provide your information and we'll contact you about volunteer opportunities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-background"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-background"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-background"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="bg-background"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Areas of Interest (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={interest.toLowerCase().replace(" ", "-")}
                    checked={formData.interests.includes(interest)}
                    onChange={() => handleCheckboxChange('interests', interest)}
                    className="rounded"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={interest.toLowerCase().replace(" ", "-")}
                    className="text-sm text-foreground"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Availability
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availabilityOptions.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={time.toLowerCase()}
                    checked={formData.availability.includes(time)}
                    onChange={() => handleCheckboxChange('availability', time)}
                    className="rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor={time.toLowerCase()} className="text-sm text-foreground">
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Why do you want to volunteer with Light Charity?
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
              disabled={isSubmitting}
              maxLength={1000}
              placeholder="Tell us about your motivation to volunteer with us..."
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.message.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 