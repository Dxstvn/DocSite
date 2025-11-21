'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { Loader2, UserCheck } from 'lucide-react'

// Validation messages by locale
const validationMessages = {
  en: {
    firstNameMin: 'First name must be at least 2 characters',
    lastNameMin: 'Last name must be at least 2 characters',
    emailInvalid: 'Please enter a valid email address (must include @)',
    phoneInvalid: 'Please enter a valid phone number',
    dateInvalid: 'Please enter a valid date (YYYY-MM-DD)',
  },
  es: {
    firstNameMin: 'El nombre debe tener al menos 2 caracteres',
    lastNameMin: 'El apellido debe tener al menos 2 caracteres',
    emailInvalid: 'Por favor ingrese un correo electrónico válido (debe incluir @)',
    phoneInvalid: 'Por favor ingrese un número de teléfono válido',
    dateInvalid: 'Por favor ingrese una fecha válida (AAAA-MM-DD)',
  },
}

// Factory function to create locale-aware schema
const createBookingFormSchema = (locale: 'en' | 'es') => {
  const msg = validationMessages[locale]
  return z.object({
    firstName: z.string().min(2, msg.firstNameMin),
    lastName: z.string().min(2, msg.lastNameMin),
    email: z.string().email(msg.emailInvalid),
    phone: z.string().regex(/^\+?1?\d{10,14}$/, msg.phoneInvalid),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, msg.dateInvalid),
    notes: z.string().optional(),
  })
}

// Type inference from schema
export type BookingFormData = z.infer<ReturnType<typeof createBookingFormSchema>>

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>
  isPending: boolean
  locale?: 'en' | 'es'
  initialValues?: Partial<BookingFormData>
  onValueChange?: (values: Partial<BookingFormData>) => void
}

export function BookingForm({ onSubmit, isPending, locale = 'en', initialValues, onValueChange }: BookingFormProps) {
  // Create locale-aware schema
  const bookingFormSchema = useMemo(() => createBookingFormSchema(locale), [locale])

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      email: initialValues?.email ?? '',
      phone: initialValues?.phone ?? '',
      dateOfBirth: initialValues?.dateOfBirth ?? '',
      notes: initialValues?.notes ?? '',
    },
  })

  // Sync form changes back to parent component
  useEffect(() => {
    if (!onValueChange) return

    // Subscribe to form changes
    const subscription = form.watch((values) => {
      onValueChange(values)
    })

    return () => subscription.unsubscribe()
  }, [form, onValueChange])

  return (
    <Card className="w-full" data-testid="booking-form">
      <CardHeader>
        <CardTitle as="h2">
          <UserCheck className="inline mr-2 h-5 w-5" />
          {locale === 'es' ? 'Información del Paciente' : 'Patient Information'}
        </CardTitle>
        <CardDescription>
          {locale === 'es'
            ? 'Complete el formulario para reservar su cita. Los campos marcados con * son obligatorios.'
            : 'Complete the form to book your appointment. Fields marked with * are required.'}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} data-testid="booking-form-element" noValidate>
          <CardContent className="space-y-6">
            {/* A11: Form-level error announcement for screen readers */}
            {Object.keys(form.formState.errors).length > 0 && (
              <div role="alert" aria-live="polite" aria-atomic="true" className="sr-only" data-testid="form-error-announcement">
                {locale === 'es'
                  ? `Hay ${Object.keys(form.formState.errors).length} errores en el formulario. Por favor corrija los campos marcados.`
                  : `There are ${Object.keys(form.formState.errors).length} errors in the form. Please correct the marked fields.`}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale === 'es' ? 'Nombre' : 'First Name'}
                      <span className="text-destructive ml-1" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-testid="first-name-input"
                        placeholder={locale === 'es' ? 'Juan' : 'John'}
                        autoComplete="given-name"
                        required
                        aria-required="true"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale === 'es' ? 'Apellido' : 'Last Name'}
                      <span className="text-destructive ml-1" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        data-testid="last-name-input"
                        placeholder={locale === 'es' ? 'García' : 'Doe'}
                        autoComplete="family-name"
                        required
                        aria-required="true"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Fields */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'es' ? 'Correo Electrónico' : 'Email Address'}
                    <span className="text-destructive ml-1" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="email-input"
                      type="email"
                      placeholder={locale === 'es' ? 'juan@ejemplo.com' : 'john@example.com'}
                      autoComplete="email"
                      required
                      aria-required="true"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {locale === 'es'
                      ? 'Enviaremos la confirmación de su cita a este correo'
                      : "We'll send your appointment confirmation to this email"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'es' ? 'Teléfono' : 'Phone Number'}
                    <span className="text-destructive ml-1" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="phone-input"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                      required
                      aria-required="true"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {locale === 'es'
                      ? 'Formato: +1 (555) 123-4567 o 5551234567'
                      : 'Format: +1 (555) 123-4567 or 5551234567'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {locale === 'es' ? 'Fecha de Nacimiento' : 'Date of Birth'}
                    <span className="text-destructive ml-1" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="date-of-birth-input"
                      type="date"
                      autoComplete="bday"
                      required
                      aria-required="true"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {locale === 'es'
                      ? 'Formato: AAAA-MM-DD (por ejemplo: 1990-01-15)'
                      : 'Format: YYYY-MM-DD (e.g., 1990-01-15)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{locale === 'es' ? 'Notas Adicionales (Opcional)' : 'Additional Notes (Optional)'}</FormLabel>
                  <FormControl>
                    <textarea
                      data-testid="notes-input"
                      className="w-full min-h-[100px] px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={
                        locale === 'es'
                          ? 'Cualquier información adicional que le gustaría compartir...'
                          : "Any additional information you'd like to share..."
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button data-testid="submit-booking-button" type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" data-testid="loading" />
                  {locale === 'es' ? 'Reservando...' : 'Booking...'}
                </>
              ) : (
                <>{locale === 'es' ? 'Confirmar Reserva' : 'Confirm Booking'}</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
