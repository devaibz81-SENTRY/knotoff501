"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileImage, FileText } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ReceiptProps {
  bookingId: string
  customerName: string
  amount: string
  date: string
  services: string[]
}

export default function ReceiptGenerator({ bookingId, customerName, amount, date, services }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateJPEG = async () => {
    if (!receiptRef.current) return
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 3, backgroundColor: "#ffffff" })
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      const link = document.createElement("a")
      link.download = `Receipt_${customerName.replace(/\s+/g, "_")}_${bookingId}.jpg`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePDF = async () => {
    if (!receiptRef.current) return
    setIsGenerating(true)
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: "#ffffff" })
      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Receipt_${customerName.replace(/\s+/g, "_")}_${bookingId}.pdf`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
       <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={handleGenerateJPEG} disabled={isGenerating} className="gap-2 text-[#00a3a8] hover:bg-[#00a3a8]/10 border-[#00a3a8]">
             <FileImage className="w-4 h-4"/> Download JPEG
          </Button>
          <Button variant="default" size="sm" onClick={handleGeneratePDF} disabled={isGenerating} className="gap-2 bg-slate-800 hover:bg-slate-700">
             <FileText className="w-4 h-4"/> Download PDF
          </Button>
       </div>

       {/* Hidden actual receipt that gets snapshotted */}
       <div className="overflow-hidden border rounded-xl bg-slate-100 p-8 flex justify-center">
         <div 
            ref={receiptRef} 
            className="w-full max-w-[400px] bg-white p-8 shadow-sm flex flex-col font-sans text-slate-800"
            style={{ minHeight: "600px" }}
         >
            <div className="text-center pb-6 border-b-2 border-slate-100 mb-6 space-y-2">
               {/* Logo area */}
               <div className="mx-auto w-16 h-16 bg-[#00a3a8]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#00a3a8]">K</span>
               </div>
               <h1 className="text-2xl font-bold tracking-tight">Knotoff501 Studio</h1>
               <p className="text-sm text-slate-500">18th Street, San Ignacio, Cayo</p>
               <p className="text-sm text-slate-500">+501-6014727</p>
            </div>

            <h2 className="text-center font-bold text-lg mb-6 tracking-widest uppercase text-slate-400">Payment Receipt</h2>

            <div className="space-y-2 text-sm mb-6">
               <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-medium">{date}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">Booking Ref:</span>
                  <span className="font-medium">#{bookingId.slice(-6).toUpperCase()}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-medium">{customerName}</span>
               </div>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 mb-6">
               <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3 border-b pb-2">Services Rendered</div>
               <ul className="space-y-2 text-sm">
                  {services.map((s, i) => (
                     <li key={i} className="flex justify-between items-center">
                        <span>{s}</span>
                     </li>
                  ))}
               </ul>
            </div>

            <div className="mt-auto pt-6 border-t-2 border-slate-900 border-dashed">
               <div className="flex justify-between items-center text-lg">
                  <span className="font-bold">Total Paid</span>
                  <span className="font-bold text-[#00a3a8]">${amount}</span>
               </div>
            </div>

            <div className="text-center mt-12 text-xs text-slate-400 pb-2">
               Thank you for choosing Knotoff501 Studio for your wellness journey.
            </div>
         </div>
       </div>
    </div>
  )
}
