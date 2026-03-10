"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { format, addDays, startOfToday } from "date-fns"
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react"

export default function GeneralBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
  const [step, setStep] = useState<"pick" | "details" | "done">("pick")
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "", notes: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const slots = useQuery(api.adminApi.getAvailableSlotsByDate, { date: dateStr })
  const createBooking = useMutation(api.adminApi.createPublicBooking)

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) { setError("Name and phone are required."); return }
    setLoading(true); setError("")
    try {
      await createBooking({
        slotId: selectedSlotId as any,
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp || undefined,
        notes: form.notes || undefined,
      })
      setStep("done")
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#00a3a8]/10 flex flex-col items-center justify-start p-4 pt-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <span className="text-3xl font-black text-[#00a3a8]">K</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Knotoff501 Studio</h1>
        <p className="text-slate-500 text-sm mt-1">Book your massage session</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* DONE */}
        {step === "done" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">You're Booked! 🎉</h2>
            <p className="text-slate-600 text-sm mb-1 font-medium">{format(selectedDate, "EEEE, MMMM do")} at {selectedSlotTime}</p>
            <p className="text-slate-400 text-xs mt-2">We'll confirm your appointment via WhatsApp or phone. See you soon!</p>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl text-left">
              <p className="text-xs font-medium text-slate-600">📍 Knotoff501 Studio</p>
              <p className="text-xs text-slate-500">18th Street, San Ignacio, Cayo</p>
              <p className="text-xs text-slate-500">📱 +501-6014727</p>
            </div>
          </div>
        )}

        {/* PICK DATE & SLOT */}
        {step === "pick" && (
          <>
            <div className="bg-[#00a3a8] text-white p-5">
              <p className="text-xs font-medium opacity-75 mb-3 uppercase tracking-wider">Select a Date</p>
              {/* Week strip */}
              <div className="flex gap-1 justify-between">
                {[-2,-1,0,1,2].map(offset => {
                  const d = addDays(selectedDate, offset)
                  const isSelected = offset === 0
                  return (
                    <button key={offset} onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center rounded-xl py-2 flex-1 transition-colors ${isSelected ? 'bg-white text-[#00a3a8]' : 'text-white/70 hover:bg-white/10'}`}>
                      <span className="text-xs font-medium">{format(d, "EEE")}</span>
                      <span className="text-lg font-bold">{format(d, "d")}</span>
                      <span className="text-xs opacity-70">{format(d, "MMM")}</span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between mt-3">
                <button onClick={() => setSelectedDate(addDays(selectedDate, -5))}
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white">
                  <ChevronLeft className="w-3 h-3"/> Earlier
                </button>
                <button onClick={() => setSelectedDate(addDays(selectedDate, 5))}
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white">
                  Later <ChevronRight className="w-3 h-3"/>
                </button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm font-semibold text-slate-600 mb-3">
                Available Times — <span className="text-[#00a3a8]">{format(selectedDate, "MMM do")}</span>
              </p>
              {slots === undefined ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#00a3a8]" /></div>
              ) : slots.length === 0 ? (
                <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="font-medium">No slots available</p>
                  <p className="text-xs mt-1">Try a different date ↑</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {slots.map(slot => (
                    <button key={slot._id}
                      onClick={() => { setSelectedSlotId(slot._id); setSelectedSlotTime(slot.startTime); setStep("details") }}
                      className="p-4 rounded-xl border-2 border-[#00a3a8]/30 bg-[#00a3a8]/5 text-center hover:bg-[#00a3a8] hover:text-white hover:border-[#00a3a8] transition-all duration-200 transform hover:scale-105 group">
                      <p className="font-bold text-lg text-[#00a3a8] group-hover:text-white">{slot.startTime}</p>
                      <p className="text-xs text-slate-400 group-hover:text-white/80">to {slot.endTime}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* FILL DETAILS */}
        {step === "details" && (
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5 p-3 bg-[#00a3a8]/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-[#00a3a8] shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-800">{format(selectedDate, "MMMM do, yyyy")}</p>
                <p className="text-xs text-slate-500">at {selectedSlotTime}</p>
              </div>
              <button className="text-xs text-[#00a3a8] underline" onClick={() => setStep("pick")}>Change</button>
            </div>

            <p className="text-sm font-semibold text-slate-700 mb-4">Your Details</p>
            <form onSubmit={handleBook} className="space-y-3">
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "Jane Smith" },
                { label: "Phone *", key: "phone", type: "tel", placeholder: "+501-000-0000" },
                { label: "WhatsApp (optional)", key: "whatsapp", type: "tel", placeholder: "+501-000-0000" },
                { label: "Email (optional)", key: "email", type: "email", placeholder: "jane@example.com" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-slate-600 block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Notes (optional)</label>
                <textarea placeholder="Any health info or preferences for your therapist..." value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm resize-none" />
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full h-12 bg-[#00a3a8] hover:bg-[#008a8f] disabled:opacity-60 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Confirming...</> : "Confirm Booking →"}
              </button>
            </form>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-6 text-center">
        18th Street, San Ignacio, Cayo • +501-6014727 • rc.stradiboy@gmail.com
      </p>
    </div>
  )
}
