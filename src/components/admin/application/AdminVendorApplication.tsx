"use client"

import { motion } from "framer-motion"
import { Search, Filter, CheckCircle, XCircle, Eye, Clock, UserX, Users } from "lucide-react"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type React from "react"
import type { IVendor } from "@/types/User"
import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/common/textArea/TextArea"
import { ConfirmationButton } from "@/components/common/customButtons/ConfirmButton"
import { VendorView } from "./ViewApplication"

interface VendorApplicationListProps {
  vendor: IVendor[]
  totalPages: number
  currentPage: number
  isLoading: boolean
  isError: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  onPageChange: (page: number) => void
  onUpdateStatus: (vendorId: string, status: string, reason?: string) => void
  onViewVendor?: (vendorId: string) => void
}

export const VendorApplicationList: React.FC<VendorApplicationListProps> = ({
  vendor,
  totalPages,
  currentPage,
  searchQuery,
  isLoading,
  isError,
  onSearchChange,
  onPageChange,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "rejected">("pending")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [selectedVendorView, setSelectedVendorView] = useState<IVendor | undefined>()

  const handleRejectClick = (vendorId: string) => {
    setSelectedVendorId(vendorId)
    setIsRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    if (selectedVendorId) {
      onUpdateStatus(selectedVendorId, "rejected", rejectionReason)
      setIsRejectDialogOpen(false)
      setRejectionReason("")
      setSelectedVendorId(null)
    }
  }

  const handleViewVendor = (vendorI: IVendor) => {
    setSelectedVendorView(vendorI)
  }

  // Filter vendors based on active tab
  const filteredVendors = useMemo(() => {
    let filtered = vendor

    filtered = filtered.filter((v) => v.vendorStatus === activeTab)

    // if (searchQuery) {
    //   filtered = filtered.filter(
    //     (v) =>
    //       v.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
    //   )
    // }

    return filtered
  }, [vendor, activeTab, searchQuery])

  // Get counts for each status
  const statusCounts = useMemo(() => {
    return {
      all: vendor.length,
      pending: vendor.filter((v) => v.vendorStatus === "pending").length,
      rejected: vendor.filter((v) => v.vendorStatus === "rejected").length,
    }
  }, [vendor])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <UserX className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-500 bg-yellow-500/10"
      case "rejected":
        return "text-red-500 bg-red-500/10"
      case "approved":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const renderVendorTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm">
            <th className="pb-4 font-medium">Name</th>
            <th className="pb-4 font-medium">Email</th>
            <th className="pb-4 font-medium">Status</th>
            <th className="pb-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {filteredVendors.map((vendorItem) => (
            <motion.tr
              key={vendorItem?.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors"
            >
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {vendorItem.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{vendorItem.name}</span>
                </div>
              </td>
            
              <td className="py-3 text-gray-300">{vendorItem?.email}</td>
              <td className="py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vendorItem?.vendorStatus!)}`}
                >
                  {vendorItem.vendorStatus}
                </span>
              </td>
              <td className="py-3">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer border-blue-200 flex items-center"
                    onClick={() => handleViewVendor(vendorItem as IVendor)}
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </Button>

                  {vendorItem.vendorStatus === "pending" ? (
                    <>
                      <ConfirmationButton
                        buttonText="Approve"
                        buttonIcon={<CheckCircle size={14} className="mr-1" />}
                        buttonType="success"
                        confirmTitle="Confirm Approval"
                        confirmMessage={`Are you sure you want to approve ${vendorItem.name}?`}
                        confirmText="Approve"
                        onConfirm={() => onUpdateStatus(vendorItem.userId as string, "approved")}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer border-red-200 flex items-center"
                        onClick={() => handleRejectClick(vendorItem.userId as string)}
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : vendorItem.vendorStatus === "rejected" ? (
                    <div className="flex gap-2">
                      <ConfirmationButton
                        buttonText="Reconsider"
                        buttonIcon={<CheckCircle size={14} className="mr-1" />}
                        buttonType="success"
                        confirmTitle="Reconsider Application"
                        confirmMessage={`Are you sure you want to move ${vendorItem.name} back to pending?`}
                        confirmText="Move to Pending"
                        onConfirm={() => onUpdateStatus(vendorItem.userId as string, "pending")}
                      />
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                        Rejected
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Approved
                    </Badge>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
        {getStatusIcon(activeTab)}
      </div>
      {searchQuery && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSearchChange("")}
          className="mt-4 bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
        >
          Clear Search
        </Button>
      )}
    </motion.div>
  )

  return (
    <>
      <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendor Applications</h1>
            <p className="text-gray-400 text-sm mt-1">Manage and review vendor applications</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
              Total: {statusCounts.all}
            </Badge>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="flex items-center bg-gray-700/50 rounded-lg px-3 py-2 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent border-none w-full ml-2 focus:outline-none text-white placeholder:text-gray-400"
              />
            </div>
            <button className="flex items-center bg-gray-700/50 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors text-gray-300">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-700/50">
              <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-600 text-gray-300">
                <Clock className="h-4 w-4 mr-2" />
                Pending
                <Badge className="ml-2 bg-yellow-600 text-white text-xs">{statusCounts.pending}</Badge>
              </TabsTrigger>
             
              <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600 text-gray-300">
                <UserX className="h-4 w-4 mr-2" />
                Rejected
                <Badge className="ml-2 bg-red-600 text-white text-xs">{statusCounts.rejected}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading applications...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <p className="text-red-500 text-sm">Failed to load applications. Please try again.</p>
                </div>
              ) : filteredVendors.length > 0 ? (
                renderVendorTable()
              ) : (
                renderEmptyState()
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading pending applications...</p>
                </div>
              ) : filteredVendors.length > 0 ? (
                <div>
                  <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Pending Applications</span>
                    </div>
                    <p className="text-yellow-300/80 text-sm mt-1">
                      These applications are awaiting your review and approval.
                    </p>
                  </div>
                  {renderVendorTable()}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                  <p className="text-gray-400 text-sm">Loading rejected applications...</p>
                </div>
              ) : filteredVendors.length > 0 ? (
                <div>
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400">
                      <UserX className="h-5 w-5" />
                      <span className="font-medium">Rejected Applications</span>
                    </div>
                    <p className="text-red-300/80 text-sm mt-1">
                      These applications have been rejected. You can reconsider them if needed.
                    </p>
                  </div>
                  {renderVendorTable()}
                </div>
              ) : (
                renderEmptyState()
              )}
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {filteredVendors.length > 0 && (
            <div className="mt-6 flex justify-center items-center">
              <Pagination1
                currentPage={currentPage}
                totalPages={totalPages}
                onPageNext={() => onPageChange(currentPage + 1)}
                onPagePrev={() => onPageChange(currentPage - 1)}
              />
            </div>
          )}
        </div>

        {/* Rejection Reason Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Reject Vendor Application
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Please provide a reason for rejecting this vendor application. This will help the vendor understand why
                their application was not approved.
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
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {selectedVendorView && (
        <div className="mt-6">
          <VendorView vendor={selectedVendorView} onBack={() => setSelectedVendorView(undefined)} />
        </div>
      )}
    </>
  )
}
