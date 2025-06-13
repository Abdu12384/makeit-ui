import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import VendorDetailsPage from "./VendorDetails"; 
import { IVendor } from "@/types/User"; 
import { Event } from "@/types/event"; 

interface VendorDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: IVendor | Event['vendorDetails'] |  null;  
}

export const VendorDetailsDialog: React.FC<VendorDetailsDialogProps> = React.memo(
  ({ isOpen, onClose, vendor }) => {
    if (!isOpen || !vendor) return null;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black"
              onClick={onClose} 
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl shadow-xl w-full mx-4 max-h-[100vh] overflow-y-auto"
            >
              <VendorDetailsPage vendor={vendor} onClose={onClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);