"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, addDays, startOfWeek } from "date-fns"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const slots = useQuery(api.adminApi.getSlotsByDate, { date: dateStr })
  const toggleSlot = useMutation(api.adminApi.toggleSlotStatus)
  const addSlot = useMutation(api.adminApi.addSlot)

  const handleToggle = (slotId: any, currentStatus: string) => {
    toggleSlot({ slotId, newStatus: currentStatus === "AVAILABLE" ? "TAKEN" : "AVAILABLE" })
  }

  const handleAddDemoSlot = () => {
     addSlot({
        date: dateStr,
        startTime: "09:00",
        endTime: "10:00",
        status: "AVAILABLE"
     })
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Schedule</h2>
          <p className="text-muted-foreground">Manage your availability and appointments.</p>
        </div>
        <Button onClick={handleAddDemoSlot} className="gap-2">
           <Plus className="w-4 h-4" /> Add Slot
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Mini Calendar / Date Picker Placeholder */}
        <Card className="h-fit">
          <CardHeader>
             <CardTitle className="flex justify-between items-center text-slate-700">
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
             <div className="text-center font-medium text-[#00A3A8] mb-4">
                Selected: {format(selectedDate, "EEEE, MMMM do")}
             </div>
             <p className="text-sm text-slate-500">Pick a date to view or modify time slots.</p>
          </CardContent>
        </Card>

        {/* Time Slots Grid */}
        <Card>
           <CardHeader>
              <CardTitle>Time Slots for {format(selectedDate, "MMM do")}</CardTitle>
              <CardDescription>Click a slot to toggle between Available and Taken.</CardDescription>
           </CardHeader>
           <CardContent>
              {slots === undefined ? (
                 <div className="text-slate-500 animate-pulse">Loading slots...</div>
              ) : slots.length === 0 ? (
                 <div className="text-slate-500 py-12 text-center border-2 border-dashed rounded-lg border-slate-200">
                    No slots generated for this day. Click "Add Slot" to generate one.
                 </div>
              ) : (
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {slots.map((slot) => (
                       <button
                          key={slot._id}
                          onClick={() => handleToggle(slot._id, slot.status)}
                          className={`
                             p-4 rounded-xl border text-center transition-all duration-300 transform hover:scale-105 active:scale-95
                             ${slot.status === 'AVAILABLE' 
                                ? 'bg-[#4ade80]/10 border-[#4ade80] text-emerald-700 hover:bg-[#4ade80]/20' 
                                : 'bg-[#facc15]/10 border-[#facc15] text-amber-700 hover:bg-[#facc15]/20'}
                          `}
                       >
                          <div className="font-semibold text-lg">{slot.startTime}</div>
                          <div className="text-xs font-medium uppercase tracking-wider mt-1 opacity-80">
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
