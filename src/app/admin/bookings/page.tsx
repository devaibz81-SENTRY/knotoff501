"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReceiptText, ScanLine, CheckCircle2 } from "lucide-react"

export default function BookingsAndReceiptsPage() {
  const bookings = useQuery(api.adminApi.getBookings)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Bookings & Receipts</h2>
          <p className="text-muted-foreground">Manage appointments, scan payments, and generate receipts.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 border-[#00A3A8] text-[#00A3A8] hover:bg-[#00a3a8]/10 bg-white">
              <ScanLine className="w-4 h-4"/> Scan Document / ID
           </Button>
           <Button className="gap-2">
              <ReceiptText className="w-4 h-4"/> Generate Generic Link
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2">
            <CardHeader>
               <CardTitle>Recent Bookings</CardTitle>
               <CardDescription>Track the status of all incoming appointments and payments.</CardDescription>
            </CardHeader>
            <CardContent>
               {bookings === undefined ? (
                   <div className="animate-pulse flex flex-col gap-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl w-full"></div>)}
                   </div>
                ) : bookings.length === 0 ? (
                   <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                      No bookings yet. Generate a generic booking link to share with clients.
                   </div>
                ) : (
                   <div className="space-y-4">
                      {bookings.map(b => (
                         <div key={b._id} className="p-4 rounded-xl border flex items-center justify-between">
                            <div>
                               <div className="font-semibold">{b.customerId}</div>
                               <div className="text-sm text-slate-500">Status: {b.status} • Total: ${b.totalPrice}</div>
                            </div>
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm">Log Payment</Button>
                               <Button variant="secondary" size="sm" className="gap-2">
                                  <ReceiptText className="w-3 h-3"/> PDF
                               </Button>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
            </CardContent>
         </Card>

         <Card className="bg-[#00a3a8]/5 border-[#00a3a8]/20">
            <CardHeader>
               <CardTitle className="text-[#00a3a8]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 bg-white rounded-lg border shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                     </div>
                     <h4 className="font-semibold">Paperless Scanner</h4>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">Upload an ID or bank transfer receipt to auto-extract details.</p>
                  <Button className="w-full text-xs" variant="outline">Open Scanner Module</Button>
               </div>
               
               <div className="p-4 bg-white rounded-lg border shadow-sm">
                  <h4 className="font-semibold mb-2 text-slate-700">Payment Gateway Portal</h4>
                  <p className="text-sm text-slate-500 mb-3">Manually verify bank transfers or log cash deposits.</p>
                  <Button className="w-full text-xs" variant="outline">Log New Payment</Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
