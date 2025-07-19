import type React from "react"
import { motion } from "framer-motion"
import { Search, CheckCircle, Ban } from 'lucide-react'
import { IVendor } from "@/types/User"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { ConfirmationButton } from "@/components/common/customButtons/ConfirmButton"


interface AdminVendorManagementProps {
  vendor: IVendor[]
  totalPages: number
  currentPage: number
  isLoading: boolean
  isError: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  onPageChange: (page: number) => void
  onStatusUpdate: (userId: string) => Promise<void>;
}

export const VendorManagementComponent: React.FC<AdminVendorManagementProps> = ({
  vendor,
  totalPages,
  currentPage,
  isLoading,
  isError,
  searchQuery,
  onSearchChange,
  onPageChange,
  onStatusUpdate,
}) => {

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div className="flex items-center bg-gray-700/50 rounded-lg px-3 py-2 flex-1">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vendors..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent border-none w-full ml-2 focus:outline-none"
            />
          </div>
      
        </div>
       
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading vendor...</p>
        ) : isError ? (
          <p className="text-red-500 text-sm">Failed to load vendors. Pleas try again.</p>
        ) : (

          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium"></th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {vendor.map((vendor) => (
                <tr key={vendor?.userId} className="border-b border-gray-700">
                  <td className="py-3">{vendor.name}</td>
                  <td className="py-3">{vendor?.email}</td>
                  <td className="py-3"></td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vendor?.status === "active" 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-red-500/10 text-red-500"
                      }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="py-3">
                  <ConfirmationButton
                      buttonText={vendor.status === "active" ? "Active" : "Blocked"}
                      buttonIcon={ vendor.status === "active" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <Ban className="h-6 w-6 text-red-500" />
                      )}
                      buttonType={vendor.status === "active" ? "danger" : "success"}
                      confirmTitle={`Confirm ${vendor.status === "active" ? "Block" : "Activate"} Client`}
                      confirmMessage={`Are you sure you want to ${
                        vendor.status === "active" ? "block" : "activate"
                      } this client?`}
                      confirmText={vendor.status === "active" ? "Block" : "Activate"}
                      onConfirm={() => onStatusUpdate(vendor.userId as string)}
                      buttonClassName={
                        vendor.status === "active"
                          ? "bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer border-green-200"
                          : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer border-red-200"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        <div className="mt-6 flex justify-center items-center">
          <Pagination1
          currentPage={currentPage}
          totalPages={totalPages}
          onPageNext={() => onPageChange(currentPage + 1)}
          onPagePrev={() => onPageChange(currentPage - 1)}
          />
        </div>
      </div>
    </motion.div>
  )
}
