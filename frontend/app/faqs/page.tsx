"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, HelpCircle, Users, Shield, Clock, Phone } from "lucide-react"
import Link from "next/link"

// FAQ Data organized by categories
const faqData = {
  general: [
    {
      id: "general-1",
      question: "Why should I donate blood?",
      answer:
        "Blood donation is a critical and selfless act that directly saves lives. When you donate blood, you're helping accident victims, surgery patients, cancer patients, and many others who depend on blood transfusions. A single donation can save up to three lives, making it one of the most impactful ways to help others.",
    },
    {
      id: "general-2",
      question: "How often can I donate blood?",
      answer:
        "Donation frequency depends on the type of donation: Whole Blood every 8 weeks (56 days), Double Red Cells every 16 weeks (112 days), and Platelets every 7 days (up to 24 times per year).",
    },
    {
      id: "general-3",
      question: "Is donating blood safe?",
      answer:
        "Yes, donating blood is very safe. All equipment used is sterile and disposed of after a single use. The donation process is conducted by trained professionals who follow strict safety protocols with a 99.9% safety rate.",
    },
    {
      id: "general-4",
      question: "How long does a blood donation take?",
      answer:
        "The entire process takes about an hour: Registration & Health Check (15-20 min), Actual Donation (8-10 min), and Rest & Refreshments (15 min).",
    },
    {
      id: "general-5",
      question: "What happens to my blood after donation?",
      answer:
        "Your donated blood is tested, processed, and separated into components (red cells, plasma, platelets) that can help multiple patients. It's then distributed to hospitals and medical centers where it's needed most.",
    },
    {
      id: "general-6",
      question: "Can I donate blood if I have tattoos or piercings?",
      answer:
        "Yes, you can donate blood if you have tattoos or piercings, as long as they were done at a licensed facility using sterile equipment. There may be a waiting period depending on when you got them.",
    },
    {
      id: "general-7",
      question: "Do I get paid for donating blood?",
      answer:
        "No, blood donation is a voluntary, unpaid service. However, you'll receive refreshments after donation and the satisfaction of knowing you've helped save lives.",
    },
    {
      id: "general-8",
      question: "Can I donate blood during my lunch break?",
      answer:
        "Yes! The entire process takes about an hour, making it perfect for a lunch break. We recommend eating a good meal beforehand and staying hydrated.",
    },
  ],
  eligibility: [
    {
      id: "eligibility-1",
      question: "Who can donate blood?",
      answer:
        "Basic eligibility includes: At least 17 years old (16 with parental consent in some states), weigh at least 110 pounds, be in good general health, and feel well on donation day.",
    },
    {
      id: "eligibility-2",
      question: "Can I donate if I have a medical condition?",
      answer:
        "It depends on the condition. Many people with managed conditions like diabetes or high blood pressure can still donate. Our medical staff will determine your eligibility during the screening process.",
    },
    {
      id: "eligibility-3",
      question: "Can I donate if I'm taking medication?",
      answer:
        "Many medications do not prevent blood donation. However, some may require a waiting period. During screening, you'll be asked about medications, and a healthcare professional will determine your eligibility.",
    },
    {
      id: "eligibility-4",
      question: "Can I donate if I've traveled recently?",
      answer:
        "Travel to certain countries may require a waiting period before you can donate, depending on disease risks in those areas. Our staff will review your travel history during the screening process.",
    },
    {
      id: "eligibility-5",
      question: "Can I donate if I'm pregnant or breastfeeding?",
      answer:
        "Pregnant women cannot donate blood. Breastfeeding mothers can donate after 6 weeks postpartum, provided they meet all other eligibility requirements and feel well.",
    },
    {
      id: "eligibility-6",
      question: "Is there an upper age limit for blood donation?",
      answer:
        "There's no upper age limit for blood donation as long as you're healthy and meet all other eligibility requirements. Donors over 65 may need additional medical clearance.",
    },
  ],
  process: [
    {
      id: "process-1",
      question: "What should I bring to my donation appointment?",
      answer:
        "Please bring a valid photo ID (driver's license, passport, etc.) and your donor card if you have one. We also recommend bringing a list of current medications and wearing comfortable clothing.",
    },
    {
      id: "process-2",
      question: "Will donating blood hurt?",
      answer:
        "You may feel a brief pinch when the needle is inserted, similar to getting a vaccination. Most donors report minimal discomfort during the actual donation process.",
    },
    {
      id: "process-3",
      question: "Can I donate if I have a fear of needles?",
      answer:
        "Many people with needle anxiety successfully donate blood. Our staff provides relaxation techniques, distraction methods, and extra support to help nervous donors feel comfortable.",
    },
    {
      id: "process-4",
      question: "What should I do before donating blood?",
      answer:
        "Eat a healthy meal, drink plenty of water, get a good night's sleep, and avoid alcohol for 24 hours before donation. Bring your ID and wear comfortable clothing with sleeves that can be rolled up.",
    },
    {
      id: "process-5",
      question: "What should I do after donating blood?",
      answer:
        "Rest for 15 minutes, drink plenty of fluids, avoid heavy lifting for 24 hours, and eat iron-rich foods. If you feel dizzy or unwell, contact us immediately.",
    },
  ],
  safety: [
    {
      id: "safety-1",
      question: "How is my donated blood tested?",
      answer:
        "Every unit undergoes comprehensive testing for infectious diseases (HIV, Hepatitis B & C, Syphilis, West Nile Virus) and blood typing (ABO group, Rh factor, antibody screening).",
    },
    {
      id: "safety-2",
      question: "What happens if my blood tests positive for something?",
      answer:
        "If any test results are positive, your blood will not be used for transfusion and you will be notified confidentially. We provide counseling and referral services for appropriate medical care.",
    },
    {
      id: "safety-3",
      question: "Are there any side effects from donating blood?",
      answer:
        "Most people experience no side effects. Some may have slight fatigue, mild thirst, or temporary lightheadedness. Rare side effects include bruising at the needle site, fainting, or nausea.",
    },
    {
      id: "safety-4",
      question: "How do you ensure the safety of the blood supply?",
      answer:
        "We follow strict FDA guidelines, use sterile single-use equipment, conduct thorough donor screening, perform comprehensive testing, and maintain proper storage and handling procedures.",
    },
  ],
}

const categories = [
  {
    id: "general",
    title: "General",
    count: faqData.general.length,
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    icon: Heart,
  },
  {
    id: "eligibility",
    title: "Eligibility",
    count: faqData.eligibility.length,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Users,
  },
  {
    id: "process",
    title: "Process",
    count: faqData.process.length,
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    icon: Clock,
  },
  {
    id: "safety",
    title: "Safety",
    count: faqData.safety.length,
    color:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    icon: Shield,
  },
]

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general")

  const currentQuestions = faqData[selectedCategory as keyof typeof faqData] || faqData.general

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 dark:from-red-900/10 dark:to-orange-900/10"></div>
          <div className="container relative px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Get Your Questions Answered
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions about blood donation, eligibility, and the donation process.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 md:py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
              {[
                { icon: Heart, label: "Lives Saved Daily", value: "0", color: "text-red-500" },
                { icon: Users, label: "Active Donors", value: "0", color: "text-blue-500" },
                { icon: Shield, label: "Safety Rate", value: "0%", color: "text-green-500" },
                { icon: Clock, label: "Donation Time", value: "0 Minutes", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} mx-auto mb-2 md:mb-3`} />
                    <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic FAQ Categories */}
        <section className="py-8 md:py-16 bg-muted/30">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Browse by Category</h2>
              <p className="text-muted-foreground">Choose a category to find specific information</p>
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-12">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedCategory === category.id
                      ? `${category.color} shadow-lg scale-105`
                      : "hover:shadow-md border-border"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                    <category.icon
                      className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 ${
                        selectedCategory === category.id
                          ? category.id === "general"
                            ? "text-red-600 dark:text-red-400"
                            : category.id === "eligibility"
                              ? "text-blue-600 dark:text-blue-400"
                              : category.id === "process"
                                ? "text-green-600 dark:text-green-400"
                                : "text-orange-600 dark:text-orange-400"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div
                      className={`text-sm md:text-base font-medium mb-2 ${
                        selectedCategory === category.id ? "text-foreground" : "text-foreground"
                      }`}
                    >
                      {category.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category.count} questions</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Category Questions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const category = categories.find((c) => c.id === selectedCategory)
                  const IconComponent = category?.icon || Heart
                  return (
                    <>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedCategory === "general"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : selectedCategory === "eligibility"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : selectedCategory === "process"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-orange-100 dark:bg-orange-900/30"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${
                            selectedCategory === "general"
                              ? "text-red-600 dark:text-red-400"
                              : selectedCategory === "eligibility"
                                ? "text-blue-600 dark:text-blue-400"
                                : selectedCategory === "process"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-orange-600 dark:text-orange-400"
                          }`}
                        />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">{category?.title} Questions</h2>
                    </>
                  )
                })()}
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {currentQuestions.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg bg-card">
                    <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-6 md:p-8 text-center">
                <Phone className="h-8 w-8 md:h-12 md:w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Still Have Questions?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
                  Our friendly staff is here to help! Contact us directly or visit one of our donation centers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us: 1-800-DONATE
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/locations">Find a Center</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8 md:mt-12">
              <p className="mb-4 text-foreground">Ready to make a difference?</p>
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Blood Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-8 md:py-12">
        <div className="container text-center text-sm text-muted-foreground px-4">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
