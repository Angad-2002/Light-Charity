import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Clock,
  Shield,
  CheckCircle,
  UserCheck,
  Droplets,
  Coffee,
  FileText,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const donationSteps = [
  {
    step: 1,
    title: "Registration & Health Check",
    duration: "15-20 minutes",
    description: "Complete registration forms and undergo a brief health screening including vital signs check.",
    details: [
      "Photo ID verification",
      "Health history questionnaire",
      "Mini-physical examination",
      "Iron level test (finger prick)",
    ],
    icon: FileText,
  },
  {
    step: 2,
    title: "Pre-Donation Consultation",
    duration: "5-10 minutes",
    description: "Meet with a healthcare professional to review your health information and answer any questions.",
    details: [
      "Review health questionnaire",
      "Discuss any medications",
      "Address concerns or questions",
      "Final eligibility confirmation",
    ],
    icon: UserCheck,
  },
  {
    step: 3,
    title: "Blood Donation",
    duration: "8-12 minutes",
    description: "The actual blood collection process using sterile, single-use equipment.",
    details: [
      "Comfortable donation chair",
      "Sterile needle insertion",
      "Approximately 1 pint collected",
      "Continuous monitoring by staff",
    ],
    icon: Droplets,
  },
  {
    step: 4,
    title: "Recovery & Refreshments",
    duration: "15 minutes",
    description: "Rest and enjoy refreshments while your body begins to replenish the donated blood.",
    details: ["Observation period", "Snacks and beverages", "Receive donor materials", "Schedule next donation"],
    icon: Coffee,
  },
]

const donationTypes = [
  {
    type: "Whole Blood",
    duration: "45-60 minutes",
    frequency: "Every 8 weeks",
    description: "The most common type of donation where whole blood is collected.",
    benefits: "Helps trauma patients, surgery patients, and those with blood disorders.",
    eligibility: "Most healthy adults 17+ years old, weighing 110+ lbs",
  },
  {
    type: "Double Red Cells",
    duration: "75-90 minutes",
    frequency: "Every 16 weeks",
    description: "A specialized donation that collects two units of red blood cells.",
    benefits: "Ideal for trauma patients and those needing red blood cell transfusions.",
    eligibility: "Specific height/weight requirements, O+, O-, A-, B- blood types preferred",
  },
  {
    type: "Platelets",
    duration: "90-120 minutes",
    frequency: "Every 7 days (up to 24x/year)",
    description: "Collects platelets while returning other blood components to you.",
    benefits: "Critical for cancer patients and those with bleeding disorders.",
    eligibility: "Regular donors with good platelet count, specific blood types preferred",
  },
  {
    type: "Plasma",
    duration: "60-90 minutes",
    frequency: "Every 4 weeks",
    description: "Collects plasma while returning red cells and platelets to you.",
    benefits: "Used for burn victims, trauma patients, and immune deficiency treatments.",
    eligibility: "Healthy adults with good protein levels, AB blood type preferred",
  },
]

export default function DonationProcessPage() {
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
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Save Lives Today</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Donation Process</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Learn what to expect during your blood donation journey. Our streamlined process ensures your comfort
                and safety while maximizing the impact of your generous gift.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Link href="/donate">
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/locations">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find a Center
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Clock, label: "Total Time", value: "~1 Hour", color: "text-blue-500" },
                { icon: Droplets, label: "Blood Collected", value: "1 Pint", color: "text-red-500" },
                { icon: Heart, label: "Lives Saved", value: "Up to 3", color: "text-green-500" },
                { icon: Shield, label: "Safety Rate", value: "99.9%", color: "text-orange-500" },
              ].map((fact, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <fact.icon className={`h-8 w-8 ${fact.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-foreground mb-1">{fact.value}</div>
                    <div className="text-sm text-muted-foreground">{fact.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Steps */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">The Donation Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our four-step process is designed to be safe, comfortable, and efficient. Here's what you can expect
                during your visit.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {donationSteps.map((step, index) => (
                <Card key={step.step} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          {step.duration}
                        </CardDescription>
                      </div>
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Your Journey Progress</h3>
                <p className="text-sm text-muted-foreground">Track your donation process</p>
              </div>
              <div className="space-y-3">
                {donationSteps.map((step, index) => (
                  <div key={step.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-foreground">{step.title}</span>
                        <span className="text-xs text-muted-foreground">{step.duration}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Donation Types */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Types of Donations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Different types of donations serve different medical needs. Learn about each type to see which might be
                right for you.
              </p>
            </div>

            <Tabs defaultValue="Whole Blood" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-2xl grid-cols-2 lg:grid-cols-4 bg-muted">
                  {donationTypes.map((type) => (
                    <TabsTrigger
                      key={type.type}
                      value={type.type}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {type.type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {donationTypes.map((type) => (
                <TabsContent key={type.type} value={type.type}>
                  <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-foreground">{type.type} Donation</CardTitle>
                      <CardDescription className="text-lg">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Duration</h4>
                          <p className="text-sm text-muted-foreground">{type.duration}</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Frequency</h4>
                          <p className="text-sm text-muted-foreground">{type.frequency}</p>
                        </div>
                        <div className="text-center">
                          <UserCheck className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Eligibility</h4>
                          <p className="text-sm text-muted-foreground">{type.eligibility}</p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">Medical Benefits</h4>
                        <p className="text-muted-foreground">{type.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Preparation Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">How to Prepare</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these simple tips to ensure a successful and comfortable donation experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Before Your Donation",
                  tips: [
                    "Get a good night's sleep",
                    "Eat a healthy meal 3 hours before",
                    "Drink plenty of water",
                    "Bring a valid photo ID",
                    "Wear comfortable clothing",
                  ],
                  icon: "🌅",
                  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                },
                {
                  title: "During Your Donation",
                  tips: [
                    "Relax and stay calm",
                    "Inform staff of any discomfort",
                    "Squeeze the stress ball regularly",
                    "Stay hydrated",
                    "Ask questions if needed",
                  ],
                  icon: "🩸",
                  color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                },
                {
                  title: "After Your Donation",
                  tips: [
                    "Rest for 15 minutes",
                    "Drink extra fluids for 24 hours",
                    "Avoid heavy lifting for 24 hours",
                    "Keep bandage on for 4 hours",
                    "Schedule your next donation",
                  ],
                  icon: "🍃",
                  color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                },
              ].map((section, index) => (
                <Card key={index} className={`${section.color} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-2">{section.icon}</div>
                    <CardTitle className="text-foreground">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Save Lives?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Your donation can make the difference between life and death for someone in need. Join thousands of heroes
              who donate blood regularly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Schedule Donation
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-500"
                asChild
              >
                <Link href="/faqs">
                  <Phone className="h-4 w-4 mr-2" />
                  Have Questions?
                </Link>
              </Button>
            </div>
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
