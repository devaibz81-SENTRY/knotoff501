"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ReceiptText, ScanLine, Link2, CheckCircle2, Copy } from "lucide-react"

export default function BookingsAndReceiptsPage() {
  const bookings = useQuery(api.adminApi.getBookings)
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const bookingLink = typeof window !== "undefined"
    ? `${window.location.origin}/book/general`
    : "/book/general"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Bookings & Receipts</h2>
          <p className="text-muted-foreground">Manage appointments, scan payments, and generate receipts.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2 border-[#00A3A8] text-[#00A3A8] hover:bg-[#00a3a8]/10 bg-white" onClick={() => router.push('/admin/scanner')}>
            <ScanLine className="w-4 h-4"/> Scan Receipt
          </Button>
          <Button onClick={handleCopyLink} className={`gap-2 transition-all ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
            {copied ? <><CheckCircle2 className="w-4 h-4"/> Copied!</> : <><Copy className="w-4 h-4"/> Copy Booking Link</>}
          </Button>
        </div>
      </div>

      {/* Booking Link Card */}
      <Card className="border-[#00a3a8]/30 bg-[#00a3a8]/5">
        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-[#00a3a8] text-white rounded-lg shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm">Your Public Booking Link</p>
                <p className="text-xs text-slate-500 truncate">{bookingLink}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="border-[#00a3a8] text-[#00a3a8]">
                {copied ? "Copied ✓" : "Copy"}
              </Button>
              <a href={`https://wa.me/?text=Book your massage at Knotoff501 Studio: ${bookingLink}`} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 gap-1.5">
                  Share via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Track incoming appointments and payments.</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings === undefined ? (
              <div className="animate-pulse flex flex-col gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl"/>)}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                <p className="font-medium mb-1">No bookings yet</p>
                <p className="text-sm">Share the booking link above with your clients to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b._id} className="p-4 rounded-xl border flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm">{String(b.customerId).slice(-8)}</div>
                      <div className="text-xs text-slate-500">Status: <span className={`font-medium ${b.status === 'CONFIRMED' ? 'text-emerald-600' : 'text-slate-500'}`}>{b.status}</span> • ${b.totalPrice}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push('/admin/scanner')}>Log Payment</Button>
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        <ReceiptText className="w-3 h-3"/> Receipt
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
          <CardContent className="space-y-3">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h4 className="font-semibold text-sm">Paperless Scanner</h4>
              </div>
              <p className="text-xs text-slate-500 mb-3">Upload an ID or receipt to extract payment details.</p>
              <Button className="w-full text-xs" variant="outline" onClick={() => router.push('/admin/scanner')}>Open Scanner</Button>
            </div>
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h4 className="font-semibold text-sm mb-2 text-slate-700">Add Calendar Slots</h4>
              <p className="text-xs text-slate-500 mb-3">Add available times for clients to book.</p>
              <Button className="w-full text-xs" variant="outline" onClick={() => router.push('/admin/calendar')}>Go to Calendar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
