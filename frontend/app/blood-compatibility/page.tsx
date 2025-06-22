"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, AlertTriangle, CheckCircle, XCircle, Info, Zap, Shield } from "lucide-react"
import Link from "next/link"

// Blood type compatibility data
const bloodTypeData = {
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    percentage: "35.7%",
    description:
      "A+ is the second most common blood type. A+ patients can receive blood from A+, A-, O+, and O- donors.",
    rarity: "common",
    emergencyUse: false,
  },
  "A-": {
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
    percentage: "6.3%",
    description:
      "A- is relatively rare. A- patients can only receive blood from A- and O- donors, but can donate to all A and AB patients.",
    rarity: "uncommon",
    emergencyUse: false,
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    percentage: "8.5%",
    description: "B+ is less common than A+. B+ patients can receive blood from B+, B-, O+, and O- donors.",
    rarity: "uncommon",
    emergencyUse: false,
  },
  "B-": {
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
    percentage: "1.5%",
    description:
      "B- is one of the rarest blood types. B- patients can only receive blood from B- and O- donors, but can donate to all B and AB patients.",
    rarity: "rare",
    emergencyUse: false,
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    percentage: "3.4%",
    description:
      "AB+ is the universal recipient. AB+ patients can receive blood from all blood types, but can only donate to other AB+ patients.",
    rarity: "rare",
    emergencyUse: false,
  },
  "AB-": {
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["A-", "B-", "AB-", "O-"],
    percentage: "0.6%",
    description:
      "AB- is the rarest blood type. AB- patients can receive blood from A-, B-, AB-, and O- donors, and can donate to both AB+ and AB- patients.",
    rarity: "very-rare",
    emergencyUse: false,
  },
  "O+": {
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    canReceiveFrom: ["O+", "O-"],
    percentage: "37.4%",
    description:
      "O+ is the most common blood type. O+ patients can only receive blood from O+ and O- donors, but can donate to all positive blood types.",
    rarity: "common",
    emergencyUse: true,
  },
  "O-": {
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"],
    percentage: "6.6%",
    description:
      "O- is the universal donor. O- patients can only receive blood from other O- donors, but can donate to all blood types.",
    rarity: "uncommon",
    emergencyUse: true,
  },
}

// Blood type colors for visualization
const bloodTypeColors = {
  "A+": "bg-red-500 dark:bg-red-600",
  "A-": "bg-red-400 dark:bg-red-500",
  "B+": "bg-blue-500 dark:bg-blue-600",
  "B-": "bg-blue-400 dark:bg-blue-500",
  "AB+": "bg-purple-500 dark:bg-purple-600",
  "AB-": "bg-purple-400 dark:bg-purple-500",
  "O+": "bg-green-500 dark:bg-green-600",
  "O-": "bg-green-400 dark:bg-green-500",
}

const rarityColors = {
  common: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  uncommon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  rare: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  "very-rare": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
}

export default function BloodCompatibilityPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<keyof typeof bloodTypeData>("O+")
  const [viewMode, setViewMode] = useState<"donate" | "receive">("donate")

  const bloodTypes = Object.keys(bloodTypeData) as Array<keyof typeof bloodTypeData>

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
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Life-Saving Knowledge</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">Blood Type Compatibility</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Understanding blood type compatibility is crucial for safe transfusions. Use our interactive tools to
                learn which blood types can donate to or receive from each other.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Users, label: "Blood Types", value: "8", color: "text-red-500" },
                { icon: Heart, label: "Lives Saved", value: "3", subtext: "per donation", color: "text-blue-500" },
                { icon: Shield, label: "Safety Rate", value: "100%", color: "text-green-500" },
                { icon: Zap, label: "Emergency Ready", value: "24/7", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    {stat.subtext && <div className="text-xs text-muted-foreground">{stat.subtext}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Chart */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Interactive Compatibility Checker</h2>
              <p className="text-muted-foreground">Select your blood type and explore compatibility options</p>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                <CardTitle className="text-2xl text-foreground">Blood Type Compatibility Explorer</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover donation and receiving compatibility for different blood types
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Tabs defaultValue="interactive" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="interactive">Interactive Explorer</TabsTrigger>
                    <TabsTrigger value="matrix">Full Matrix</TabsTrigger>
                  </TabsList>

                  <TabsContent value="interactive" className="space-y-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Controls */}
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-foreground">Select Your Blood Type</h3>
                          <div className="grid grid-cols-4 gap-3">
                            {bloodTypes.map((type) => (
                              <Button
                                key={type}
                                variant={selectedBloodType === type ? "default" : "outline"}
                                onClick={() => setSelectedBloodType(type)}
                                className="relative h-12"
                              >
                                {type}
                                <span
                                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${bloodTypeColors[type]}`}
                                ></span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4 text-foreground">View Mode</h3>
                          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "donate" | "receive")}>
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="donate">Who I Can Donate To</TabsTrigger>
                              <TabsTrigger value="receive">Who I Can Receive From</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`w-12 h-12 rounded-full ${bloodTypeColors[selectedBloodType]} flex items-center justify-center text-white font-bold text-lg`}
                              >
                                {selectedBloodType}
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-foreground">Blood Type: {selectedBloodType}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge className={rarityColors[bloodTypeData[selectedBloodType].rarity]}>
                                    {bloodTypeData[selectedBloodType].rarity.replace("-", " ")}
                                  </Badge>
                                  {bloodTypeData[selectedBloodType].emergencyUse && (
                                    <Badge variant="destructive">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Emergency Use
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">
                              {bloodTypeData[selectedBloodType].description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-foreground">Population:</p>
                                <p className="text-2xl font-bold text-primary">
                                  {bloodTypeData[selectedBloodType].percentage}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {viewMode === "donate" ? "Can Donate To:" : "Can Receive From:"}
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                  {viewMode === "donate"
                                    ? bloodTypeData[selectedBloodType].canDonateTo.length
                                    : bloodTypeData[selectedBloodType].canReceiveFrom.length}{" "}
                                  types
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Visualization */}
                      <div>
                        <h3 className="text-lg font-medium mb-4 text-center text-foreground">
                          {viewMode === "donate"
                            ? `${selectedBloodType} Can Donate To:`
                            : `${selectedBloodType} Can Receive From:`}
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {bloodTypes.map((type) => {
                            const isCompatible =
                              viewMode === "donate"
                                ? bloodTypeData[selectedBloodType].canDonateTo.includes(type)
                                : bloodTypeData[selectedBloodType].canReceiveFrom.includes(type)

                            return (
                              <Card
                                key={type}
                                className={`transition-all duration-300 ${
                                  isCompatible
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
                                    : "border-gray-200 dark:border-gray-700 bg-background opacity-60"
                                }`}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 rounded-full ${bloodTypeColors[type]} flex items-center justify-center text-white font-bold`}
                                      >
                                        {type}
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground">{type}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {bloodTypeData[type].percentage} population
                                        </p>
                                      </div>
                                    </div>
                                    {isCompatible ? (
                                      <CheckCircle className="h-6 w-6 text-green-500" />
                                    ) : (
                                      <XCircle className="h-6 w-6 text-gray-300" />
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="matrix" className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold mb-2 text-foreground">Complete Compatibility Matrix</h3>
                      <p className="text-muted-foreground">
                        Comprehensive view of all blood type compatibility relationships
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full bg-card shadow-lg rounded-lg">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="p-4 text-left font-medium text-foreground">Donor Type</th>
                            <th className="p-4 text-center font-medium text-foreground" colSpan={8}>
                              Can Donate To (Recipient Types)
                            </th>
                          </tr>
                          <tr className="bg-muted/30">
                            <th className="p-4"></th>
                            {bloodTypes.map((type) => (
                              <th key={type} className="p-3 text-center text-sm font-medium text-foreground">
                                <div
                                  className={`w-8 h-8 rounded-full ${bloodTypeColors[type]} flex items-center justify-center text-white font-bold text-xs mx-auto mb-1`}
                                >
                                  {type}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bloodTypes.map((donorType, index) => (
                            <tr key={donorType} className={index % 2 === 0 ? "bg-muted/20" : "bg-background"}>
                              <td className="p-4 font-medium">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full ${bloodTypeColors[donorType]} flex items-center justify-center text-white font-bold text-sm`}
                                  >
                                    {donorType}
                                  </div>
                                  <div>
                                    <div className="font-medium text-foreground">{donorType}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {bloodTypeData[donorType].percentage}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {bloodTypes.map((recipientType) => (
                                <td key={recipientType} className="p-4 text-center">
                                  {bloodTypeData[donorType].canDonateTo.includes(recipientType) ? (
                                    <CheckCircle className="h-6 w-6 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="h-6 w-6 text-gray-300 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Blood Type Facts */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Essential Blood Type Facts</h2>
              <p className="text-muted-foreground">Important information every donor should know</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-foreground">Universal Donor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    O- is known as the universal donor because it can be given to any blood type. This makes O- blood
                    especially valuable in emergency situations.
                  </p>
                  <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">O- Blood Type</Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-foreground">Universal Recipient</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    AB+ is known as the universal recipient because it can receive blood from any blood type. However,
                    AB+ donors can only donate to other AB+ recipients.
                  </p>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    AB+ Blood Type
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-foreground">Most Common</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    O+ is the most common blood type, found in about 37.4% of the population. This means O+ blood is
                    frequently needed for transfusions.
                  </p>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    O+ Blood Type
                  </Badge>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-foreground">Rarest Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    AB- is the rarest blood type, found in only about 0.6% of the population. This makes AB- donors
                    especially valuable for AB- patients.
                  </p>
                  <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                    AB- Blood Type
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Know Your Blood Type?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Knowing your blood type is important for medical emergencies. If you don't know yours, consider donating
              blood to find out while helping save lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100" asChild>
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Schedule a Donation
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/faqs">
                  <Info className="h-4 w-4 mr-2" />
                  Learn More About Donation
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
