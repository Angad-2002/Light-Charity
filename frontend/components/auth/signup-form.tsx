"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function SignupForm() {
  const [donorData, setDonorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    postalCode: "",
    donorNumber: "",
    password: "",
    confirmPassword: "",
  })

  const [hospitalData, setHospitalData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
  })

  const { signup, isLoading } = useAuth()

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (donorData.password !== donorData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await signup({
        userType: "donor",
        firstName: donorData.firstName,
        lastName: donorData.lastName,
        email: donorData.email,
        phone: donorData.phone,
        dateOfBirth: donorData.dateOfBirth,
        postalCode: donorData.postalCode,
        donorNumber: donorData.donorNumber || undefined,
        password: donorData.password,
      })
    } catch (error) {
      console.error("Donor signup failed:", error)
    }
  }

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hospitalData.password !== hospitalData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await signup({
        userType: "hospital",
        name: hospitalData.name,
        email: hospitalData.email,
        phone: hospitalData.phone,
        address: hospitalData.address,
        postalCode: hospitalData.postalCode,
        password: hospitalData.password,
      })
    } catch (error) {
      console.error("Hospital signup failed:", error)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Sign up to start donating or managing blood donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="donor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="hospital">Hospital/Blood Bank</TabsTrigger>
          </TabsList>
          <TabsContent value="donor">
            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    required 
                    disabled={isLoading}
                    value={donorData.firstName}
                    onChange={(e) => setDonorData({...donorData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    required 
                    disabled={isLoading}
                    value={donorData.lastName}
                    onChange={(e) => setDonorData({...donorData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  value={donorData.email}
                  onChange={(e) => setDonorData({...donorData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  disabled={isLoading}
                  value={donorData.phone}
                  onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    required 
                    disabled={isLoading}
                    value={donorData.dateOfBirth}
                    onChange={(e) => setDonorData({...donorData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    required 
                    disabled={isLoading}
                    value={donorData.postalCode}
                    onChange={(e) => setDonorData({...donorData, postalCode: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorNumber">Donor Number (if any)</Label>
                <Input 
                  id="donorNumber" 
                  disabled={isLoading}
                  value={donorData.donorNumber}
                  onChange={(e) => setDonorData({...donorData, donorNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput 
                  id="password" 
                  required 
                  disabled={isLoading}
                  value={donorData.password}
                  onChange={(e) => setDonorData({...donorData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput 
                  id="confirmPassword" 
                  required 
                  disabled={isLoading}
                  value={donorData.confirmPassword}
                  onChange={(e) => setDonorData({...donorData, confirmPassword: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register as Donor"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="hospital">
            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hospital/Blood Bank Name</Label>
                <Input 
                  id="name" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.name}
                  onChange={(e) => setHospitalData({...hospitalData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalEmail">Email</Label>
                <Input 
                  id="hospitalEmail" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.email}
                  onChange={(e) => setHospitalData({...hospitalData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPhone">Phone Number</Label>
                <Input 
                  id="hospitalPhone" 
                  type="tel" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.phone}
                  onChange={(e) => setHospitalData({...hospitalData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.address}
                  onChange={(e) => setHospitalData({...hospitalData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPostalCode">Postal Code</Label>
                <Input 
                  id="hospitalPostalCode" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.postalCode}
                  onChange={(e) => setHospitalData({...hospitalData, postalCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPassword">Password</Label>
                <PasswordInput 
                  id="hospitalPassword" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.password}
                  onChange={(e) => setHospitalData({...hospitalData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalConfirmPassword">Confirm Password</Label>
                <PasswordInput 
                  id="hospitalConfirmPassword" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.confirmPassword}
                  onChange={(e) => setHospitalData({...hospitalData, confirmPassword: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register as Hospital/Blood Bank"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
