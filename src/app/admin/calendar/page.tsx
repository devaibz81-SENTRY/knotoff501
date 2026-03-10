"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, addDays } from "date-fns"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

const DEFAULT_SLOTS = [
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "10:30", endTime: "11:30" },
  { startTime: "12:00", endTime: "13:00" },
  { startTime: "13:30", endTime: "14:30" },
  { startTime: "16:30", endTime: "18:00" },
  { startTime: "18:30", endTime: "19:45" },
  { startTime: "20:10", endTime: "21:30" },
]

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showModal, setShowModal] = useState(false)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [adding, setAdding] = useState(false)

  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const slots = useQuery(api.adminApi.getSlotsByDate, { date: dateStr })
  const toggleSlot = useMutation(api.adminApi.toggleSlotStatus)
  const addSlot = useMutation(api.adminApi.addSlot)

  const handleToggle = (slotId: any, currentStatus: string) => {
    toggleSlot({ slotId, newStatus: currentStatus === "AVAILABLE" ? "TAKEN" : "AVAILABLE" })
  }

  const handleAddSlot = async () => {
    setAdding(true)
    try {
      await addSlot({ date: dateStr, startTime, endTime, status: "AVAILABLE" })
      setShowModal(false)
    } finally {
      setAdding(false)
    }
  }

  const handleAddAllDefault = async () => {
    setAdding(true)
    try {
      for (const slot of DEFAULT_SLOTS) {
        await addSlot({ date: dateStr, startTime: slot.startTime, endTime: slot.endTime, status: "AVAILABLE" })
      }
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Schedule</h2>
          <p className="text-muted-foreground">Manage your availability and appointments.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAddAllDefault} disabled={adding} className="gap-2 text-[#00a3a8] border-[#00a3a8]">
            {adding ? "Adding..." : "Add All Default Slots"}
          </Button>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Custom Slot
          </Button>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-800">Add Time Slot</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">Adding slot for <span className="font-medium text-[#00a3a8]">{format(selectedDate, "EEEE, MMMM do")}</span></p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Quick Select</label>
                <div className="grid grid-cols-2 gap-2">
                  {DEFAULT_SLOTS.map((s, i) => (
                    <button key={i} onClick={() => { setStartTime(s.startTime); setEndTime(s.endTime) }}
                      className={`p-2 text-xs rounded-lg border transition-colors ${startTime === s.startTime ? 'bg-[#00a3a8] text-white border-[#00a3a8]' : 'hover:bg-slate-50 border-slate-200'}`}>
                      {s.startTime} – {s.endTime}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Start Time</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">End Time</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleAddSlot} disabled={adding}>
                {adding ? "Adding..." : "Add Slot"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-slate-700 text-base">
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {format(selectedDate, "MMM yyyy")}
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center font-semibold text-[#00A3A8] mb-3 text-sm">
              {format(selectedDate, "EEEE, MMMM do")}
            </div>
            <div className="flex gap-3 justify-center mt-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4ade80]"></span> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#facc15]"></span> Taken</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slots — {format(selectedDate, "EEE, MMM do")}</CardTitle>
            <CardDescription>Click a slot to toggle Available ↔ Taken. Existing bookings show as Taken.</CardDescription>
          </CardHeader>
          <CardContent>
            {slots === undefined ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : slots.length === 0 ? (
              <div className="text-slate-500 py-16 text-center border-2 border-dashed rounded-xl border-slate-200">
                <p className="font-medium mb-2">No slots for this day</p>
                <p className="text-sm mb-4">Click "Add All Default Slots" to populate with your standard schedule.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleToggle(slot._id, slot.status)}
                    className={`p-4 rounded-xl border text-center transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${slot.status === 'AVAILABLE'
                        ? 'bg-[#4ade80]/10 border-[#4ade80] text-emerald-700 hover:bg-[#4ade80]/20'
                        : 'bg-[#facc15]/10 border-[#facc15] text-amber-700 hover:bg-[#facc15]/20'}`}
                  >
                    <div className="font-bold text-base">{slot.startTime}</div>
                    <div className="text-xs opacity-70 mb-1">to {slot.endTime}</div>
                    <div className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block
                      ${slot.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {slot.status}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
