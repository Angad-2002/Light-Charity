"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPin, Navigation } from "lucide-react"

// Mock data for blood centers
const bloodCenters = [
  {
    id: 1,
    name: "Central Blood Bank",
    address: "123 Main St, New York, NY",
    lat: 40.7128,
    lng: -74.006,
    bloodAvailability: ["A+", "B+", "O+", "AB+"],
  },
  {
    id: 2,
    name: "City Hospital Blood Center",
    address: "456 Park Ave, New York, NY",
    lat: 40.7282,
    lng: -73.9942,
    bloodAvailability: ["A+", "A-", "O+", "O-"],
  },
  {
    id: 3,
    name: "Downtown Donation Center",
    address: "789 Broadway, New York, NY",
    lat: 40.7309,
    lng: -73.9973,
    bloodAvailability: ["B+", "B-", "AB+", "AB-"],
  },
  {
    id: 4,
    name: "Uptown Medical Center",
    address: "321 5th Ave, New York, NY",
    lat: 40.7489,
    lng: -73.9851,
    bloodAvailability: ["A+", "B+", "AB+", "O-"],
  },
  {
    id: 5,
    name: "Eastside Blood Donation",
    address: "654 3rd Ave, New York, NY",
    lat: 40.7168,
    lng: -73.9861,
    bloodAvailability: ["O+", "O-", "A+", "B+"],
  },
]

export function LocationMap() {
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [bloodFilter, setBloodFilter] = useState<string>("")
  const [radiusFilter, setRadiusFilter] = useState<string>("10")
  const [filteredCenters, setFilteredCenters] = useState(bloodCenters)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => {
      setIsLoading(false)
      setMapLoaded(true)

      // Simulate getting user location
      setUserLocation({ lat: 40.7128, lng: -74.006 })
    }, 2000)
  }, [])

  useEffect(() => {
    if (!userLocation) return

    // Filter centers based on blood type and radius
    const filtered = bloodCenters.filter((center) => {
      // Filter by blood type if selected
      if (bloodFilter && !center.bloodAvailability.includes(bloodFilter)) {
        return false
      }

      // Filter by radius if user location is available
      if (userLocation) {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, center.lat, center.lng)

        return distance <= Number.parseInt(radiusFilter)
      }

      return true
    })

    setFilteredCenters(filtered)
  }, [bloodFilter, radiusFilter, userLocation])

  // Simple distance calculation (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180)
  }

  const getDirections = (center: (typeof bloodCenters)[0]) => {
    if (!userLocation) return

    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${center.lat},${center.lng}&travelmode=driving`
    window.open(url, "_blank")
  }

  return (
    <Card className="w-full shadow-soft">
      <CardHeader>
        <CardTitle>Find Donation Centers</CardTitle>
        <CardDescription>Locate blood donation centers near you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select value={bloodFilter} onValueChange={setBloodFilter}>
              <SelectTrigger id="bloodType">
                <SelectValue placeholder="Any blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any blood type</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Distance (km)</Label>
            <Select value={radiusFilter} onValueChange={setRadiusFilter}>
              <SelectTrigger id="radius">
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="flex gap-2">
              <Input id="search" placeholder="Search by name or address" />
              <Button type="button" size="icon">
                <MapPin className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[400px] bg-gray-100 rounded-md overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 bg-gray-200">
                {mapLoaded && (
                  <div className="w-full h-full relative">
                    {/* Placeholder for map */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Map would be displayed here</p>
                    </div>

                    {/* Markers for centers */}
                    {filteredCenters.map((center, index) => (
                      <div
                        key={center.id}
                        className="absolute w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${((center.lng + 74.006) * 1000) % 100}%`,
                          top: `${((center.lat - 40.7128) * 1000) % 100}%`,
                        }}
                        title={center.name}
                      >
                        {index + 1}
                      </div>
                    ))}

                    {/* User location marker */}
                    {userLocation && (
                      <div
                        className="absolute w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: "50%", top: "50%" }}
                        title="Your location"
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Nearby Centers ({filteredCenters.length})</h3>

          {filteredCenters.length === 0 ? (
            <p className="text-muted-foreground">No centers found matching your criteria.</p>
          ) : (
            <div className="space-y-3">
              {filteredCenters.map((center, index) => (
                <div key={center.id} className="flex items-start gap-3 p-3 bg-muted rounded-md">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{center.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{center.address}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {center.bloodAvailability.map((blood) => (
                        <span
                          key={blood}
                          className={`text-xs px-2 py-0.5 rounded-full ${blood === bloodFilter ? "bg-primary text-white" : "bg-muted-foreground/20"}`}
                        >
                          {blood}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => getDirections(center)}>
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
