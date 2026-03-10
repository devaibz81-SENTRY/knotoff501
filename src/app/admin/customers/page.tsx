"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail, Phone } from "lucide-react"

export default function CustomersPage() {
  const customers = useQuery(api.adminApi.getCustomers)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Customers CRM</h2>
        <p className="text-muted-foreground">Manage your client list and onboarding notes.</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Client Directory</CardTitle>
           <CardDescription>All users who have registered through the booking link.</CardDescription>
        </CardHeader>
        <CardContent>
           {customers === undefined ? (
              <div className="animate-pulse space-y-4">
                 {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-lg w-full"></div>)}
              </div>
           ) : customers.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                 No customers found. Clients will appear here once they book.
              </div>
           ) : (
              <div className="divide-y">
                 {customers.map(c => (
                    <div key={c._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-slate-50 p-4 -mx-4 rounded-xl transition-colors">
                       <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                             <div className="flex items-center gap-1"><Mail className="w-3 h-3"/> {c.email}</div>
                             <div className="flex items-center gap-1"><Phone className="w-3 h-3"/> {c.phone}</div>
                          </div>
                          {c.notes && <p className="text-sm mt-2 p-2 bg-yellow-50 text-yellow-800 rounded-md">Note: {c.notes}</p>}
                       </div>
                       <div className="flex gap-2">
                          {c.whatsapp && (
                             <a href={`https://wa.me/${c.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                                   <MessageCircle className="w-4 h-4"/> WhatsApp
                                </Button>
                             </a>
                          )}
                          <Button variant="outline" size="sm">Edit Details</Button>
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
