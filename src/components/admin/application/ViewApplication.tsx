import type React from "react"
import { useState } from "react"
import { ArrowLeft, Mail, Phone, Calendar, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { IVendor } from "@/types/User"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/common/textArea/TextArea"
import { CLOUDINARY_BASE_URL } from "@/types/config/config"

interface VendorViewProps {
  vendor: IVendor | null
  onBack: () => void
  // onUpdateStatus: (vendorId: string, status: string, reason?: string) => void
}

export const VendorView: React.FC<VendorViewProps> = ({ vendor , onBack}) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")



  if (!vendor) {
    return (
      <div className="p-6 text-center">
        <p>No vendor selected</p>
        <Button  variant="outline" className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to list
        </Button>
      </div>
    )
  }


  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
      <Button
          onClick={() => {
          onBack()
          }}
          variant="outline"
          className="mb-6 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to applications
        </Button>

        <div className="grid gap-6">
          {/* Header Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-indigo-500">
                  <AvatarImage src={vendor.profileImage || "/placeholder.svg?height=64&width=64"} alt={vendor.name} />
                  <AvatarFallback className="bg-indigo-600 text-lg">
                    {vendor.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{vendor.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-gray-400">
                    <Store size={14} />
                    <span>{vendor?.category || "General Vendor"}</span>
                  </div>
                </div>
              </div>
              
            </CardHeader>
          </Card>

          {/* Details Card */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Vendor Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p>{vendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p>{vendor.phone || "Not provided"}</p>
                    </div>
                  </div>
                
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Joined</p>
                      <p>{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "Unknown"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Store className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                    <div className="flex flex-col gap-2">
                          <p className="text-sm text-gray-400">ID Proof</p>
                          <img
                            src={CLOUDINARY_BASE_URL + vendor.idProof}
                            alt="ID Proof"
                            className="w-full max-w-xs border border-gray-600 rounded"
                          />
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <Separator className="bg-gray-700" /> */} 
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please provide a reason for rejecting this vendor application.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              rows={4}
            />
          </div>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
