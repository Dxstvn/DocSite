import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bergen Mind & Wellness</h3>
            <p className="text-sm">
              Compassionate, evidence-based mental health care serving New Jersey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/education" className="hover:text-white transition-colors">Education</Link></li>
              <li><Link href="/screening" className="hover:text-white transition-colors">Screening Tools</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/nutrition" className="hover:text-white transition-colors">Nutrition & Brain Health</Link></li>
              <li><Link href="/mindfulness" className="hover:text-white transition-colors">Mindfulness Practices</Link></li>
              <li>
                <a
                  href="https://988lifeline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  988 Suicide & Crisis Lifeline
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                HIPAA Compliant
              </Badge>
              <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
                Secure SSL
              </Badge>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {currentYear} Bergen Mind & Wellness, LLC. All rights reserved.</p>
          <p className="mt-2 text-neutral-400">
            Licensed in the State of New Jersey. For emergencies, call 911 or visit your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  )
}
