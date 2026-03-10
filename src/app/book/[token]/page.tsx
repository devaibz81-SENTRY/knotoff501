import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PublicBookingPage({ params }: { params: { token: string } }) {
   return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <Card className="w-full max-w-lg shadow-xl border-t-4 border-t-[#00A3A8]">
            <CardHeader className="text-center pb-8 border-b">
               <div className="mx-auto w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center -mt-16 mb-4 border border-slate-100">
                  <span className="text-3xl font-bold text-[#00A3A8]">K</span>
               </div>
               <CardTitle className="text-2xl font-bold text-slate-800">Knotoff501 Studio</CardTitle>
               <CardDescription>Book your premium massage experience.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
               <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <p className="font-semibold">Available Slots Found!</p>
                  <p>Please select a time and enter your details to confirm.</p>
               </div>
               
               {/* This is where the public available slots list will go */}
               <div className="space-y-3">
                  <div className="font-medium text-slate-700 mb-2">Available Times for Date</div>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="p-3 border rounded-lg text-center hover:bg-[#00A3A8] hover:text-white transition-colors border-[#00A3A8]/30 font-semibold focus-visible:ring-2 ring-[#00A3A8]">
                        9:00 AM
                     </button>
                     <button className="p-3 border rounded-lg text-center hover:bg-[#00A3A8] hover:text-white transition-colors border-[#00A3A8]/30 font-semibold focus-visible:ring-2 ring-[#00A3A8]">
                        11:30 AM
                     </button>
                     <button className="p-3 border rounded-lg text-center hover:bg-[#00A3A8] hover:text-white transition-colors border-[#00A3A8]/30 font-semibold focus-visible:ring-2 ring-[#00A3A8]">
                        2:00 PM
                     </button>
                  </div>
               </div>

               <Button className="w-full mt-4 h-12 text-lg font-semibold rounded-xl">Continue to Details</Button>
            </CardContent>
         </Card>
      </div>
   )
}
