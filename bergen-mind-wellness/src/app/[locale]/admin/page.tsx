import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, Users, Settings, CheckCircle2, XCircle, Circle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function AdminDashboard({ params }: PageProps) {
  const { locale } = await params
  const supabase = await createClient()

  // Fetch upcoming appointments count
  const { count: upcomingCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('start_time', new Date().toISOString())
    .eq('status', 'confirmed')

  // Fetch today's appointments count
  const today = new Date()
  const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const { count: todayCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('start_time', todayStart)
    .lte('start_time', todayEnd)
    .eq('status', 'confirmed')

  // Fetch pending appointments count
  const { count: pendingCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Fetch recent appointments for activity feed (last 5)
  const { data: recentAppointments } = await supabase
    .from('appointments')
    .select(`
      id,
      patient_name,
      start_time,
      status,
      created_at,
      appointment_type:appointment_types(display_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Today's Appointments",
      value: todayCount || 0,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Upcoming Appointments',
      value: upcomingCount || 0,
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Requests',
      value: pendingCount || 0,
      icon: Users,
      color: 'bg-amber-500',
    },
  ]

  const quickActions = [
    {
      title: 'View All Appointments',
      description: 'Manage and review appointment requests',
      href: `/${locale}/admin/appointments`,
      icon: Calendar,
    },
    {
      title: 'Manage Availability',
      description: 'Set your available time slots',
      href: `/${locale}/admin/availability`,
      icon: Settings,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-neutral-600 mt-2">
          Welcome to your admin dashboard. Here's an overview of your appointments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={action.href}>Go to {action.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest appointment requests and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!recentAppointments || recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm mt-1">
                New appointment requests will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => {
                const StatusIcon =
                  appointment.status === 'confirmed' ? CheckCircle2 :
                  appointment.status === 'cancelled' ? XCircle :
                  Circle

                const statusColor =
                  appointment.status === 'confirmed' ? 'text-green-600' :
                  appointment.status === 'cancelled' ? 'text-red-600' :
                  'text-amber-600'

                const appointmentType = Array.isArray(appointment.appointment_type)
                  ? appointment.appointment_type[0]
                  : appointment.appointment_type

                return (
                  <div key={appointment.id} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900">
                        {appointment.patient_name}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {appointmentType?.display_name || 'Appointment'} • {format(new Date(appointment.start_time), 'MMM d, yyyy h:mm a')}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {formatDistanceToNow(new Date(appointment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
