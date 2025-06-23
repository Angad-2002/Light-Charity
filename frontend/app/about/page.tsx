import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, Users, Globe, Award, Target, Eye, Lightbulb, Shield, TrendingUp, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/10 dark:to-red-900/10"></div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saving Lives</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
                <span className="gradient-text-fallback gradient-text" style={{ lineHeight: "1.3" }}>
                  About Light Charity
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We're on a mission to ensure that everyone who needs blood can receive it. Through our network of donors
                and centers, we're saving lives every day.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Heart, label: "Blood Donations", value: "0", color: "text-red-500" },
                { icon: Users, label: "Lives Saved", value: "0", color: "text-blue-500" },
                { icon: MapPin, label: "Partner Hospitals", value: "0", color: "text-green-500" },
                { icon: Globe, label: "Donation Centers", value: "0", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mb-4">
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">What We Do</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-6 text-foreground">
                    Connecting Lives Through <span className="text-orange-600 dark:text-orange-400">Innovation</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Integrated Platform</h3>
                      <p className="text-muted-foreground">
                        We provide an integrated platform that connects patients with compatible donors, blood banks,
                        and hospitals within their vicinity to facilitate timely access to life-saving blood matches
                        during emergencies.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Collaborative Network</h3>
                      <p className="text-muted-foreground">
                        In collaboration with local blood services and charitable organizations, we work to enhance the
                        efficiency and reach of our support network. Our operations encompass the collection of blood,
                        plasma, stem cells, organs, and tissues.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground">Advanced Technology</h3>
                      <p className="text-muted-foreground">
                        Using cutting-edge technology and data analytics, we optimize blood distribution, predict
                        demand, and ensure the right blood reaches the right patient at the right time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl transform rotate-3"></div>
                <Card className="relative bg-card rounded-2xl shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Blood Donations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Lives Saved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Partner Hospitals</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">0</div>
                        <div className="text-sm text-muted-foreground">Donation Centers</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full mb-6 shadow-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Trusted by Canadians</span>
              </div>
              <h2 className="text-4xl font-bold mb-8 text-foreground">About Us</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We serve as the vital link between donors and patients, healthcare professionals, and medical
                  researchers. As the national organization entrusted with ensuring a safe, reliable, accessible, and
                  sustainable system of life essentials for transfusion and transplantation, we are committed to
                  supporting the health and well-being of Canadians.
                </p>
                <p className="text-xl font-medium text-foreground">
                  Each day, we work with diligence and integrity to save lives, restore health, and uphold the trust
                  placed in us by the nation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Vision */}
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <CardContent className="p-10 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                  </div>
                  <div className="space-y-4">
                    {[
                      { text: "To save", icon: "💝", desc: "Every life matters to us" },
                      { text: "To help", icon: "🤝", desc: "Communities in need" },
                      { text: "To match", icon: "🎯", desc: "Donors with recipients" },
                      { text: "To serve", icon: "🌟", desc: "With excellence and care" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <span className="text-xl font-medium text-foreground">{item.text}</span>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mission */}
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <CardContent className="p-10 relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500">
                      <p className="text-xl font-semibold text-foreground mb-2">
                        To save lives, just one donation can save up to three lives.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Every donation makes a difference in someone's life
                      </p>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <Lightbulb className="h-8 w-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <div>
                        <p className="text-lg font-medium text-foreground">Research and Innovation</p>
                        <p className="text-sm text-muted-foreground">
                          Advancing medical technologies for better patient outcomes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full mb-6 shadow-sm">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Expert Leadership</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-foreground">Our Valuable Partners</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the dedicated professionals leading our mission to save lives and serve communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  color: "from-orange-400 to-red-400",
                },
                {
                  color: "from-red-400 to-orange-400",
                },
                {
                  color: "from-orange-500 to-red-500",
                },
                {
                  color: "from-red-500 to-orange-500",
                },
              ].map((member, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div
                      className={`h-48 bg-gradient-to-br ${member.color} flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="relative w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      </div>
                    </div>
                    <div className="p-6">
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join our community of heroes and help save lives. Every donation counts, and together we can ensure that
                life-saving blood is available when it's needed most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
                  <Link href="/donate">
                    <Heart className="h-4 w-4 mr-2" />
                    Become a Donor
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/volunteer">
                    <Users className="h-4 w-4 mr-2" />
                    Volunteer With Us
                  </Link>
                </Button>
              </div>
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
