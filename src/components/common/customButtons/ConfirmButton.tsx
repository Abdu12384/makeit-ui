"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle, X, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type ConfirmationType = "info" | "success" | "warning" | "danger"

interface ConfirmationButtonProps {
  // Button props
  buttonText: string
  buttonClassName?: string
  buttonIcon?: React.ReactNode
  buttonType?: ConfirmationType

  // Confirmation dialog props
  confirmTitle: string
  confirmMessage: string
  confirmText?: string
  cancelText?: string
  confirmType?: ConfirmationType

  // Callback function
  onConfirm: () => void
}

export function ConfirmationButton({
  // Button defaults
  buttonText,
  buttonClassName,
  buttonIcon,
  buttonType = "info",

  // Dialog defaults
  confirmTitle,
  confirmMessage,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmType,

  // Action
  onConfirm,
}: ConfirmationButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Use the button type for the confirmation dialog if not specified
  const dialogType = confirmType || buttonType

  // Get styles based on type
  const getTypeStyles = (type: ConfirmationType) => {
    switch (type) {
      case "success":
        return {
          icon: buttonIcon || <CheckCircle className="h-4 w-4" />,
          buttonBg: "bg-green-600 hover:bg-green-700 text-white",
          dialogIcon: <CheckCircle className="h-6 w-6 text-green-500" />,
          confirmBg: "bg-green-600 hover:bg-green-700",
          headerBg: "bg-green-500/10",
          borderColor: "border-green-500/20",
        }
      case "warning":
        return {
          icon: buttonIcon || <AlertTriangle className="h-4 w-4" />,
          buttonBg: "bg-yellow-600 hover:bg-yellow-700 text-white",
          dialogIcon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          confirmBg: "bg-yellow-600 hover:bg-yellow-700",
          headerBg: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
        }
      case "danger":
        return {
          icon: buttonIcon || <AlertCircle className="h-4 w-4" />,
          buttonBg: "bg-red-600 hover:bg-red-700 text-white",
          dialogIcon: <AlertCircle className="h-6 w-6 text-red-500" />,
          confirmBg: "bg-red-600 hover:bg-red-700",
          headerBg: "bg-red-500/10",
          borderColor: "border-red-500/20",
        }
      default:
        return {
          icon: buttonIcon || <AlertCircle className="h-4 w-4" />,
          buttonBg: "bg-indigo-600 hover:bg-indigo-700 text-white",
          dialogIcon: <AlertCircle className="h-6 w-6 text-indigo-500" />,
          confirmBg: "bg-indigo-600 hover:bg-indigo-700",
          headerBg: "bg-indigo-500/10",
          borderColor: "border-indigo-500/20",
        }
    }
  }

  const buttonStyles = getTypeStyles(buttonType)
  const dialogStyles = getTypeStyles(dialogType)

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          buttonStyles.buttonBg,
          buttonClassName,
        )}
        onClick={() => setIsOpen(true)}
      >
        {buttonStyles.icon}
        {buttonText}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div
              className={cn(
                "w-full max-w-md overflow-hidden rounded-xl bg-gray-800 shadow-xl",
                dialogStyles.borderColor,
              )}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className={cn("flex items-center gap-3 p-4", dialogStyles.headerBg)}>
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  {dialogStyles.dialogIcon}
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex-1"
                >
                  <h3 className="text-lg font-semibold text-white">{confirmTitle}</h3>
                </motion.div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="p-5">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 text-gray-300"
                >
                  {confirmMessage}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-end gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                  >
                    {cancelText}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onConfirm()
                      setIsOpen(false)
                    }}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                      dialogStyles.confirmBg,
                    )}
                  >
                    {confirmText}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
