"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  email: string
}

export function TwoFactorModal({ isOpen, onClose, onComplete, email }: TwoFactorModalProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isOpen, countdown])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate verification
    setTimeout(() => {
      if (code === "123456") {
        onComplete()
      } else {
        setError("Invalid verification code. Please try again.")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleResendCode = () => {
    setCountdown(30)
    // Simulate resending code
    setTimeout(() => {
      // Code resent
    }, 1000)
  }

  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3") : "your email"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Two-Factor Authentication</DialogTitle>
          <DialogDescription>
            We&apos;ve sent a 6-digit verification code to {maskedEmail}. Enter the code below to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="text-sm text-muted-foreground">
              {countdown > 0 ? (
                <p>Resend code in {countdown} seconds</p>
              ) : (
                <button type="button" className="text-primary hover:underline" onClick={handleResendCode}>
                  Resend verification code
                </button>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || code.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
