'use client'

import { useState } from 'react'
import { BookingConfirmation } from '@/components/appointments/BookingConfirmation'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function ConfirmationDemoPage() {
  const [showModal, setShowModal] = useState(false)

  const mockConfirmationDetails = {
    confirmationNumber: 'ad74b425-3334-4667-9f1a-2d3721f3fc17',
    patientName: 'John Doe',
    email: 'john.doe.verylongemailaddress@example.com',
    phone: '15551234567',
    date: new Date('2025-11-18'),
    timeSlot: {
      start: '2025-11-18T09:30:00',
      end: '2025-11-18T10:30:00',
    },
    appointmentType: 'Test Initial Consultation',
    notes: 'This is a test booking with some additional notes that might be quite long to test the word wrapping functionality and ensure all content stays within the modal boundaries.',
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Booking Confirmation Modal Demo
          </h1>
          <p className="text-neutral-600">
            Click the button below to test the confirmation modal with overflow fixes
          </p>
        </div>

        <Button onClick={() => setShowModal(true)} size="lg">
          Show Confirmation Modal
        </Button>

        <div className="bg-white rounded-lg p-6 shadow-sm border max-w-2xl mx-auto text-left">
          <h2 className="font-semibold text-lg mb-4">Test Data Includes:</h2>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li>✓ Long confirmation number (36-character UUID)</li>
            <li>✓ Long email address for wrapping test</li>
            <li>✓ Patient information</li>
            <li>✓ Date, time, and appointment type</li>
            <li>✓ Extended notes to test content wrapping</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 max-w-2xl mx-auto text-left">
          <h2 className="font-semibold text-blue-900 mb-2">Overflow Fixes Applied:</h2>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• <code className="bg-blue-100 px-1 rounded">overflow-hidden</code> on wrapper div</li>
            <li>• <code className="bg-blue-100 px-1 rounded">break-all</code> on confirmation number (UUID)</li>
            <li>• <code className="bg-blue-100 px-1 rounded">break-words</code> on email, phone, and notes</li>
            <li>• <code className="bg-blue-100 px-1 rounded">flex-shrink-0</code> on icons</li>
            <li>• <code className="bg-blue-100 px-1 rounded">max-w-2xl</code> modal width (672px)</li>
          </ul>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          data-testid="confirmation-modal"
          role="dialog"
          aria-modal="true"
          className="max-w-2xl"
        >
          <DialogTitle className="sr-only">Booking Confirmed!</DialogTitle>
          <BookingConfirmation
            appointmentDetails={mockConfirmationDetails}
            onBookAnother={() => setShowModal(false)}
            locale="en"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
