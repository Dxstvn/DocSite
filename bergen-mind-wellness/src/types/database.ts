export type Locale = 'en' | 'es'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  role: 'patient' | 'doctor' | 'admin'
  timezone: string
  locale: Locale
  created_at: string
  updated_at: string
}

export type AppointmentType = {
  id: string
  name: string
  display_name: string
  display_name_es: string | null
  duration_minutes: number
  is_active: boolean
  sort_order: number
}

export type AvailabilitySlot = {
  id: string
  doctor_id: string
  day_of_week: number | null
  start_time: string
  end_time: string
  is_recurring: boolean
  specific_date: string | null
  is_blocked: boolean
  block_reason: string | null
  created_at: string
  updated_at: string
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show'

export type Appointment = {
  id: string
  patient_id: string
  doctor_id: string
  appointment_type_id: string
  start_time: string
  end_time: string
  timezone: string
  status: AppointmentStatus
  patient_name: string
  patient_email: string
  patient_phone: string | null
  patient_locale: Locale
  reason_for_visit: string | null
  internal_notes: string | null
  booking_token: string
  created_at: string
  updated_at: string
  confirmed_at: string | null
  cancelled_at: string | null
  cancelled_by: string | null
  cancellation_reason: string | null
}

export type AppointmentWithType = Appointment & {
  appointment_type: AppointmentType
}
