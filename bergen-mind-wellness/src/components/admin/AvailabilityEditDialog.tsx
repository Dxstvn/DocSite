'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AvailabilityForm } from '@/components/admin/AvailabilityForm'
import { Pencil } from 'lucide-react'

type AvailabilitySlot = {
  id: string
  day_of_week: number | null
  specific_date: string | null
  start_time: string
  end_time: string
  is_recurring: boolean
  is_blocked: boolean
  block_reason: string | null
}

type AvailabilityEditDialogProps = {
  slot: AvailabilitySlot
  locale: string
}

export function AvailabilityEditDialog({ slot, locale }: AvailabilityEditDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          aria-label="Edit"
          data-testid="edit-slot-button"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Time Slot</DialogTitle>
          <DialogDescription>
            Modify the selected time slot or change blocked status
          </DialogDescription>
        </DialogHeader>
        <AvailabilityForm
          locale={locale}
          mode="edit"
          initialData={slot}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
