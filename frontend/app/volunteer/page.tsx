"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { CalendarIcon, Clock, MapPin, Users, Heart, Award, TrendingUp, HandHeart, UserCheck, Globe } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { VolunteerApplicationForm } from "@/components/volunteer/volunteer-application-form"
import { Toaster } from "@/components/ui/toaster"

// Mock volunteer opportunities data
const volunteerOpportunities = [
  {
    id: 1,
    title: "Blood Drive Event Assistant",
    description:
      "Help organize and run blood drive events. Tasks include greeting donors, assisting with registration, and providing post-donation refreshments.",
    location: "Various Locations",
    commitment: "Flexible, 4-hour shifts",
    skills: ["Customer Service", "Organization", "Communication"],
    category: "Event Support",
  },
  {
    id: 2,
    title: "Administrative Support Volunteer",
    description:
      "Assist with office tasks such as data entry, filing, answering phones, and other administrative duties to help our operations run smoothly.",
    location: "Main Office",
    commitment: "Weekly, 3-4 hours",
    skills: ["Computer Skills", "Organization", "Attention to Detail"],
    category: "Office Support",
  },
  {
    id: 3,
    title: "Community Outreach Ambassador",
    description:
      "Represent Light Charity at community events, schools, and businesses to educate the public about blood donation and recruit new donors.",
    location: "Various Locations",
    commitment: "Monthly, 2-4 hours",
    skills: ["Public Speaking", "Enthusiasm", "Knowledge of Blood Donation"],
    category: "Outreach",
  },
  {
    id: 4,
    title: "Transportation Volunteer",
    description:
      "Help transport blood donations from collection sites to processing centers or hospitals. Must have a valid driver's license and clean driving record.",
    location: "Regional",
    commitment: "Weekly, 4-hour shifts",
    skills: ["Driving", "Reliability", "Time Management"],
    category: "Logistics",
  },
  {
    id: 5,
    title: "Donor Follow-up Caller",
    description:
      "Call donors after their donation to thank them, check on their well-being, and encourage future donations.",
    location: "Remote/Virtual",
    commitment: "Weekly, 2-3 hours",
    skills: ["Phone Skills", "Empathy", "Communication"],
    category: "Donor Relations",
  },
  {
    id: 6,
    title: "Social Media Volunteer",
    description:
      "Help manage our social media presence by creating content, responding to comments, and helping to build our online community.",
    location: "Remote/Virtual",
    commitment: "Flexible, 2-5 hours per week",
    skills: ["Social Media Knowledge", "Writing", "Creativity"],
    category: "Marketing",
  },
]

// Mock upcoming volunteer events
const volunteerEvents = [
  {
    id: 1,
    title: "Community Blood Drive",
    date: "July 15, 2023",
    time: "9:00 AM - 3:00 PM",
    location: "Central Park Community Center",
    volunteers: 0,
    volunteersNeeded: 0,
    category: "Event Support",
  },
  {
    id: 2,
    title: "High School Education Session",
    date: "July 22, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Lincoln High School",
    volunteers: 0,
    volunteersNeeded: 0,
    category: "Outreach",
  },
  {
    id: 3,
    title: "Corporate Donation Day",
    date: "August 5, 2023",
    time: "11:00 AM - 4:00 PM",
    location: "Tech Solutions Inc. Headquarters",
    volunteers: 0,
    volunteersNeeded: 0,
    category: "Event Support",
  },
]

export default function VolunteerPage() {
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
                <HandHeart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Our Mission</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Volunteer With Us</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Not everyone can donate blood, but everyone can help save lives. Join our team of dedicated volunteers
                and make a difference in your community.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Users, label: "Active Volunteers", value: "0", color: "text-blue-500" },
                { icon: Clock, label: "Volunteer Hours This Month", value: "0", color: "text-green-500" },
                { icon: Heart, label: "Lives Impacted", value: "0", color: "text-red-500" },
                { icon: Globe, label: "Community Events", value: "0", color: "text-orange-500" },
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

        {/* Why Volunteer */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Volunteer With Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Make a Meaningful Impact</h3>
                  <p className="text-muted-foreground">
                    Your time and skills directly contribute to saving lives in your community. Each volunteer hour
                    helps us collect more blood donations.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gain Valuable Experience</h3>
                  <p className="text-muted-foreground">
                    Develop new skills, build your resume, and gain experience in healthcare, event planning, customer
                    service, and more.
                  </p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Join a Community</h3>
                  <p className="text-muted-foreground">
                    Connect with like-minded individuals who share your passion for helping others and making a
                    difference in your community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section id="opportunities" className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Available Opportunities</h2>

            <Tabs defaultValue="roles" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-muted">
                  <TabsTrigger value="roles">Volunteer Roles</TabsTrigger>
                  <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="roles">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {volunteerOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col">
                      <CardHeader>
                        <Badge className="w-fit mb-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">{opportunity.category}</Badge>
                        <CardTitle className="text-foreground">{opportunity.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {opportunity.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-muted-foreground mb-4 leading-relaxed">{opportunity.description}</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">Time Commitment:</p>
                            <p className="text-sm text-muted-foreground">{opportunity.commitment}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Skills Needed:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {opportunity.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">Apply Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {volunteerEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col">
                      <CardHeader>
                        <Badge className="w-fit mb-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{event.category}</Badge>
                        <CardTitle className="text-foreground">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {event.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {event.volunteers}/{event.volunteersNeeded} volunteers
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-2.5 rounded-full"
                              style={{ width: `${(event.volunteers / event.volunteersNeeded) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">Sign Up</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Volunteer Process */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">How to Become a Volunteer</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Apply Online</h3>
                  <p className="text-muted-foreground">
                    Fill out our volunteer application form with your contact information, availability, and areas of
                    interest.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Interview</h3>
                  <p className="text-muted-foreground">
                    Meet with our volunteer coordinator to discuss your interests, skills, and how you can contribute to
                    our mission.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Training</h3>
                  <p className="text-muted-foreground">
                    Complete our volunteer orientation and any specific training required for your chosen role.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl">
                    4
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Start Volunteering</h3>
                  <p className="text-muted-foreground">
                    Begin your volunteer journey with Light Charity and start making a difference in your community.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer Stories */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Volunteer Stories</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-red-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-blue-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-green-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer Application */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Ready to Join Us?</h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below to start your volunteer journey with Light Charity.
            </p>

            <VolunteerApplicationForm />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="qualifications" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Do I need any special qualifications to volunteer?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Most volunteer positions don't require special qualifications. We provide all necessary training.
                    Some roles, like transportation volunteers, may require specific licenses or certifications.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time-commitment" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  How much time do I need to commit?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Volunteer commitments vary by role. Some positions require regular weekly hours, while others are
                    more flexible or event-based. We work with your schedule to find the right fit.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-donation" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Can I volunteer if I can't donate blood?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Many of our volunteers are unable to donate blood themselves. Volunteering is a wonderful way to
                    contribute to our mission without donating.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="age-requirement" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Is there an age requirement for volunteering?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Most volunteer positions require volunteers to be at least 16 years old. Some roles may have higher
                    age requirements. We also offer special youth volunteer programs for those under 16 with parental
                    supervision.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-volunteering" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Can I volunteer as part of a group or organization?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Yes! We welcome volunteer groups from schools, businesses, religious organizations, and community
                    groups. Contact us to discuss group volunteer opportunities.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Stay Connected</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to our volunteer newsletter to receive updates about new opportunities, volunteer spotlights, 
                  and ways to make an even bigger impact in your community.
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
      <Toaster />
    </div>
  )
}
