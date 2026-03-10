"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Phone, Plus, X, User } from "lucide-react"

export default function CustomersPage() {
  const customers = useQuery(api.adminApi.getCustomers)
  const addCustomer = useMutation(api.adminApi.addCustomer)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "", notes: "" })
  const [error, setError] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone) { setError("Name, email, and phone are required."); return }
    setSaving(true)
    setError("")
    try {
      await addCustomer({ name: form.name, email: form.email, phone: form.phone, whatsapp: form.whatsapp || undefined, notes: form.notes || undefined })
      setForm({ name: "", email: "", phone: "", whatsapp: "", notes: "" })
      setShowModal(false)
    } catch (e) {
      setError("Failed to save client. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Customers CRM</h2>
          <p className="text-muted-foreground">Manage your client list and onboarding.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Client
        </Button>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-800">Add New Client</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "Jane Smith" },
                { label: "Email *", key: "email", type: "email", placeholder: "jane@example.com" },
                { label: "Phone *", key: "phone", type: "tel", placeholder: "+501-000-0000" },
                { label: "WhatsApp Number", key: "whatsapp", type: "tel", placeholder: "+501-000-0000 (optional)" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Notes / Health Info</label>
                <textarea placeholder="Any relevant notes, health conditions, or preferences..." value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} rows={3}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8] text-sm resize-none" />
              </div>
              {error && <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save Client"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>{customers?.length ?? 0} clients registered.</CardDescription>
        </CardHeader>
        <CardContent>
          {customers === undefined ? (
            <div className="space-y-4 animate-pulse">{[1,2,3].map(i=><div key={i} className="h-20 bg-slate-100 rounded-xl"/>)}</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
              <User className="w-10 h-10 mx-auto mb-3 opacity-30"/>
              <p className="font-medium mb-1">No clients yet</p>
              <p className="text-sm mb-4">Click "New Client" to onboard your first customer.</p>
            </div>
          ) : (
            <div className="divide-y">
              {customers.map(c => (
                <div key={c._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 px-3 -mx-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00a3a8]/10 text-[#00a3a8] flex items-center justify-center font-bold text-sm shrink-0">
                      {c.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3"/>{c.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3"/>{c.phone}</span>
                      </div>
                      {c.notes && <p className="text-xs mt-1 px-2 py-1 bg-yellow-50 text-yellow-800 rounded">📝 {c.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {c.whatsapp && (
                      <a href={`https://wa.me/${c.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                          <MessageCircle className="w-3.5 h-3.5"/> WhatsApp
                        </Button>
                      </a>
                    )}
                    <Button variant="outline" size="sm">View History</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
