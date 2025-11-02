'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Phone } from 'lucide-react'

export default function CrisisButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 shadow-lg z-50 bg-red-600 hover:bg-red-700 text-white"
        size="lg"
        aria-label="Access crisis resources"
      >
        <Phone className="mr-2 h-5 w-5" />
        Crisis Help: 988
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Immediate Crisis Resources</DialogTitle>
            <DialogDescription>
              If you are experiencing a mental health emergency, please use one of these resources immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">988 Suicide & Crisis Lifeline</h3>
              <p className="text-sm text-red-800 mb-3">24/7 free and confidential support</p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white">
                <a href="tel:988">Call 988</a>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Crisis Text Line</h3>
              <p className="text-sm text-blue-800 mb-3">Text HOME to 741741</p>
              <Button asChild variant="outline" className="w-full border-blue-300 hover:bg-blue-100">
                <a href="sms:741741&body=HOME">Send Text</a>
              </Button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Emergency Services</h3>
              <p className="text-sm text-orange-800 mb-3">For life-threatening emergencies</p>
              <Button asChild variant="outline" className="w-full border-orange-300 hover:bg-orange-100">
                <a href="tel:911">Call 911</a>
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
