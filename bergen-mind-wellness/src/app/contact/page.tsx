import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container max-w-2xl">
        <h1 className="mb-8">Contact Us</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Appointment booking form will be implemented in Phase 7.
        </p>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:info@bergenmindwellness.com"
                    className="text-neutral-600 hover:text-primary-700"
                  >
                    info@bergenmindwellness.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a
                    href="tel:+12015550123"
                    className="text-neutral-600 hover:text-primary-700"
                  >
                    (201) 555-0123
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-neutral-600">
                    123 Main Street, Suite 200<br />
                    Bergen County, NJ 07000
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
          <h2 className="text-xl font-semibold mb-3">Office Hours</h2>
          <div className="space-y-2 text-neutral-700">
            <div className="flex justify-between">
              <span className="font-medium">Monday - Friday:</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saturday:</span>
              <span>10:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Sunday:</span>
              <span>Closed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
