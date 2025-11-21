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
import { Plus } from 'lucide-react'

type AvailabilityDialogProps = {
  locale: string
}

export function AvailabilityDialog({ locale }: AvailabilityDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full" data-testid="add-availability-button">
          <Plus className="h-4 w-4 mr-2" />
          Add Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Available Time Slot</DialogTitle>
          <DialogDescription>
            Create a new recurring weekly time slot or specific date availability
          </DialogDescription>
        </DialogHeader>
        <AvailabilityForm locale={locale} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
