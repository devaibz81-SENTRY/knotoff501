"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ServicesPage() {
  const services = useQuery(api.adminApi.getServices)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800">Services & Pricing</h2>
          <p className="text-muted-foreground">Manage the massage therapies you offer.</p>
        </div>
        <Button className="gap-2">
           <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
         {services === undefined ? (
            <div className="animate-pulse flex gap-6 w-full col-span-full">
               <div className="h-40 bg-slate-100 rounded-xl w-full"></div>
            </div>
         ) : services.length === 0 ? (
            <Card className="col-span-full border-dashed">
               <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <p>No services registered yet.</p>
                  <Button variant="outline" className="mt-4">Create Your First Service</Button>
               </CardContent>
            </Card>
         ) : (
            services.map(s => (
               <Card key={s._id} className="relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${s.isActive ? 'bg-[#00a3a8]' : 'bg-slate-300'}`}></div>
                  <CardHeader className="pl-6 pb-2">
                     <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{s.name}</CardTitle>
                        <span className="font-bold text-lg text-slate-700">${s.price.toFixed(2)}</span>
                     </div>
                     <CardDescription>{s.durationMins} mins</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-6 pt-2">
                     <p className="text-sm text-slate-600 mb-4">{s.description || "No description provided."}</p>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full">Edit</Button>
                        <Button variant={s.isActive ? "destructive" : "secondary"} size="sm" className="w-full">
                           {s.isActive ? "Deactivate" : "Activate"}
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))
         )}
      </div>
    </div>
  )
}
