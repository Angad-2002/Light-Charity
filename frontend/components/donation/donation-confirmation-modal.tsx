"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"

interface DonationConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  bloodGroup: string
  date?: Date
  location: string
}

export function DonationConfirmationModal({
  isOpen,
  onClose,
  onComplete,
  bloodGroup,
  date,
  location,
}: DonationConfirmationModalProps) {
  // Calculate impact based on blood group
  const getImpact = () => {
    // Different blood groups can help different numbers of people
    const impactMap: Record<string, number> = {
      "O-": 4, // Universal donor
      "O+": 3,
      "A-": 3,
      "A+": 2,
      "B-": 3,
      "B+": 2,
      "AB-": 2,
      "AB+": 1,
    }

    return impactMap[bloodGroup] || 3
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thank You for Donating!</DialogTitle>
          <DialogDescription>
            Your donation has been scheduled. Here&apos;s a summary of your donation details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <div className="text-4xl font-bold text-primary mb-2">{getImpact()}</div>
            <p className="text-sm text-gray-600">
              Your donation could save up to <strong>{getImpact()} lives</strong>!
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Blood Group:</span>
              <span>{bloodGroup}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{date ? format(date, "PPP") : "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Location:</span>
              <span className="text-right">{location}</span>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <p>Please remember to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Get a good night&apos;s sleep before donation</li>
              <li>Eat a healthy meal before your appointment</li>
              <li>Drink plenty of water</li>
              <li>Bring a valid ID</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Edit Details
          </Button>
          <Button type="button" onClick={onComplete}>
            Confirm Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
