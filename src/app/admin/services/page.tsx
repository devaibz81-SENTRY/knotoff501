"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, X, ListPlus } from "lucide-react"

const PRESET_SERVICES = [
  { name: "Swedish / Deep Tissue", price: 60, durationMins: 60, description: "Full body relaxation and deep muscle therapy." },
  { name: "Bojin / Tendon Stimulation", price: 60, durationMins: 60, description: "Targeted tendon and tissue stimulation using Bojin technique." },
  { name: "Guasha / Scraping / IASTM", price: 60, durationMins: 60, description: "Instrument-assisted soft tissue mobilization." },
  { name: "Tuina / Manual Therapy", price: 60, durationMins: 60, description: "Traditional Chinese manual therapy and manipulation." },
  { name: "Cupping", price: 60, durationMins: 60, description: "Suction cup therapy for muscle tension and recovery." },
  { name: "Sports Massage / Pre-Event", price: 60, durationMins: 60, description: "Targeted massage for athletic performance and recovery." },
]

export default function ServicesPage() {
  const services = useQuery(api.adminApi.getServices)
  const addService = useMutation(api.adminApi.addService)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", price: "60", durationMins: "60", description: "" })
  const [error, setError] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError("Name and price are required."); return }
    setSaving(true); setError("")
    try {
      await addService({ name: form.name, price: parseFloat(form.price), durationMins: parseInt(form.durationMins), description: form.description || undefined })
      setForm({ name: "", price: "60", durationMins: "60", description: "" })
      setShowModal(false)
    } catch (e) {
      setError("Failed to save. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddPreset = async (preset: typeof PRESET_SERVICES[0]) => {
    setSaving(true)
    try { await addService(preset) } finally { setSaving(false) }
  }

  const handleAddAllPresets = async () => {
    setSaving(true)
    try { for (const p of PRESET_SERVICES) await addService(p) } finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Services & Pricing</h2>
          <p className="text-muted-foreground">Manage your massage therapy offerings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-[#00a3a8] border-[#00a3a8]" onClick={handleAddAllPresets} disabled={saving}>
            Add All Default Services
          </Button>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Custom Service
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-800">Add Service</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Service Name *</label>
                <input type="text" placeholder="e.g. Deep Tissue Massage" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Price ($) *</label>
                  <input type="number" min="0" step="0.01" value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Duration (mins)</label>
                  <input type="number" min="5" step="5" value={form.durationMins}
                    onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <textarea placeholder="Brief description of the service..." value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm resize-none" />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save Service"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Presets (only show if no services yet) */}
      {services?.length === 0 && (
        <Card className="border-dashed border-[#00a3a8]/40 bg-[#00a3a8]/5">
          <CardHeader>
            <CardTitle className="text-[#00a3a8] flex items-center gap-2"><ListPlus className="w-5 h-5"/> Quick Add — Default Services</CardTitle>
            <CardDescription>Add your standard Knotoff501 services in one click.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {PRESET_SERVICES.map((p, i) => (
              <div key={i} className="p-3 bg-white rounded-lg border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-slate-500">${p.price} / {p.durationMins} mins</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAddPreset(p)} disabled={saving}>Add</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services === undefined ? (
          [1,2,3].map(i => <div key={i} className="h-36 bg-slate-100 rounded-xl animate-pulse"/>)
        ) : (
          services.map(s => (
            <Card key={s._id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${s.isActive ? 'bg-[#00a3a8]' : 'bg-slate-300'}`}/>
              <CardHeader className="pl-6 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base leading-snug">{s.name}</CardTitle>
                  <span className="font-bold text-lg text-[#00a3a8] shrink-0">${s.price}</span>
                </div>
                <CardDescription>{s.durationMins} mins</CardDescription>
              </CardHeader>
              <CardContent className="pl-6 pt-1">
                <p className="text-sm text-slate-500 leading-snug">{s.description || "No description."}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
