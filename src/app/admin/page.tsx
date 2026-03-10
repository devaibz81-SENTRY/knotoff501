import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, DollarSign, Activity } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-[#00a3a8]/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#00A3A8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-[#00a3a8]/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-[#00A3A8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24</div>
            <p className="text-xs text-muted-foreground">+5 since yesterday</p>
          </CardContent>
        </Card>
        <Card className="hover:border-[#00a3a8]/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-[#00A3A8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">+2 since yesterday</p>
          </CardContent>
        </Card>
        <Card className="hover:border-[#00a3a8]/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Activity className="h-4 w-4 text-[#00A3A8]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently offered</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments Today</CardTitle>
            <CardDescription>You have 4 appointments today.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Appointment list placeholder */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg bg-emerald-50 p-4 border border-emerald-100">
                <div className="h-12 w-12 rounded-full bg-[#00a3a8]/20 flex items-center justify-center text-[#00a3a8] font-bold">SM</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sarah Miller</p>
                  <p className="text-sm text-muted-foreground">Swedish / Deep Tissue • 60 mins</p>
                </div>
                <div className="font-medium text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm text-sm">2:00 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
             <CardTitle>Recent Activity</CardTitle>
             <CardDescription>Latest client onboarding and payments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* Activity feed placeholder */}
               <div className="text-sm border-l-2 border-[#00a3a8] pl-4 py-1">
                  <p className="font-medium">New Client Registered</p>
                  <p className="text-muted-foreground text-xs">James Wilson submitted the onboarding form.</p>
               </div>
               <div className="text-sm border-l-2 border-[#facc15] pl-4 py-1">
                  <p className="font-medium">Receipt Generated</p>
                  <p className="text-muted-foreground text-xs">For booking #1042 (Maria Garcia)</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
