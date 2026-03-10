"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createWorker } from "tesseract.js"
import { Loader2, UploadCloud, CheckCircle2, FileText, AlertCircle } from "lucide-react"

export default function PaperlessScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [amount, setAmount] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setStatus("idle")
      setExtractedText("")
      setAmount("")
      setName("")
    }
  }

  const runOCR = async () => {
    if (!preview) return

    setStatus("scanning")
    setIsScanning(true)

    try {
      const worker = await createWorker('eng');
      const ret = await worker.recognize(preview);
      const text = ret.data.text;
      setExtractedText(text);
      
      // Simple regex to find names (very loose) and currency amounts
      const amountMatch = text.match(/\$\s?(\d+[.,]\d{2})/);
      if (amountMatch) {
         setAmount(amountMatch[1]);
      } else {
         // Try finding numbers that look like prices near total
         const totalMatch = text.match(/(total|amount).*?(\d+[.,]\d{2})/i);
         if (totalMatch) setAmount(totalMatch[2]);
      }

      const nameMatch = text.match(/(name|customer|from).*?([A-Za-z]+\s[A-Za-z]+)/i);
      if (nameMatch) {
         setName(nameMatch[2]);
      }

      await worker.terminate();
      setStatus("success")
    } catch (err) {
      setStatus("error")
      console.error(err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleGenerateReceipt = () => {
     // placeholder for PDF/JPEG generation logic
     alert("Receipt Generation logic will trigger here with: " + amount)
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Paperless Scanner</h2>
        <p className="text-muted-foreground">Upload IDs or bank transfer receipts to auto-extract details and log payments.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
               <CardTitle>Upload Document</CardTitle>
               <CardDescription>Select an image of a receipt or transfer confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                     ${preview ? 'border-[#00a3a8] bg-[#00a3a8]/5' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                  onClick={() => fileInputRef.current?.click()}
               >
                  <input 
                     type="file" 
                     className="hidden" 
                     ref={fileInputRef} 
                     accept="image/*"
                     onChange={handleFileChange}
                  />
                  {preview ? (
                     <div className="space-y-4">
                        <div className="relative h-48 w-full max-w-sm mx-auto rounded-lg overflow-hidden border">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={preview} alt="Document Preview" className="object-contain w-full h-full bg-slate-100" />
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreview(null) }}>
                           Remove
                        </Button>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="w-10 h-10 text-slate-400" />
                        <h3 className="font-semibold text-slate-700">Click to upload or drag and drop</h3>
                        <p className="text-sm text-slate-500">PNG, JPG or JPEG (max. 10MB)</p>
                     </div>
                  )}
               </div>

               <Button 
                  className="w-full gap-2" 
                  disabled={!preview || isScanning}
                  onClick={runOCR}
               >
                  {isScanning ? (
                     <><Loader2 className="w-4 h-4 animate-spin"/> Scanning Document...</>
                  ) : (
                     <><FileText className="w-4 h-4"/> Extract Data</>
                  )}
               </Button>
            </CardContent>
         </Card>

         <Card className="flex flex-col">
            <CardHeader>
               <CardTitle>Extracted Data & Payment Verification</CardTitle>
               <CardDescription>Review the scanned information before confirming.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-6">
               {status === "idle" && (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-6 border rounded-lg bg-slate-50">
                     <FileText className="w-12 h-12 mb-2 opacity-50" />
                     <p>Upload and scan a document to see extracted data here.</p>
                  </div>
               )}

               {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg flex gap-3 items-start border border-red-200 animate-in zoom-in-95">
                     <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                     <div>
                        <p className="font-semibold">Scan Failed</p>
                        <p className="text-sm">We couldn't read the text. Try checking the image quality.</p>
                     </div>
                  </div>
               )}

               {status === "success" && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                     <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg flex gap-3 items-center border border-emerald-200">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <p className="font-medium text-sm">Document successfully scanned!</p>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-slate-700">Extracted Amount ($)</label>
                           <input 
                              type="text" 
                              className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8]"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-slate-700">Client Name Found</label>
                           <input 
                              type="text" 
                              className="w-full h-10 px-3 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00a3a8]"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                           />
                        </div>
                        
                        <div className="pt-4 border-t space-y-3">
                           <Button className="w-full gap-2 bg-[#00a3a8] hover:bg-[#008f94]" onClick={handleGenerateReceipt}>
                              <CheckCircle2 className="w-4 h-4"/> Confirm & Log Payment
                           </Button>
                           <Button variant="outline" className="w-full" onClick={() => router.push('/admin/bookings')}>
                              Return to Bookings
                           </Button>
                        </div>
                     </div>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
