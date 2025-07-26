
"use client"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, ImageIcon, Share2, Check, ChevronDown, Loader2, X } from "lucide-react"
import type { ITicket } from "@/types/ticket"

interface DownloadTicketProps {
  ticket: ITicket
  className?: string
  variant?: "button" | "dropdown" | "modal"
}

// Utility function to truncate text if too long
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

// Utility function to generate ticket canvas with full data
const generateTicketCanvas = async (ticket: ITicket): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  // Set canvas dimensions
  canvas.width = 600
  canvas.height = 300

  // Draw the ticket background
  // Left side (white)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, 300, 300)

  // Right side (purple)
  ctx.fillStyle = "#6b21a8"
  ctx.fillRect(300, 0, 300, 300)

  // Left side: Full ticket data (purple text)
  ctx.fillStyle = "#581c87"

  // Event Title (truncate if too long)
  ctx.font = "bold 24px Arial, sans-serif"
  const eventTitle = truncateText(ticket.eventDetails?.title || "Event", 20)
  ctx.fillText(eventTitle, 20, 40)

  // Event Details
  ctx.font = "16px Arial, sans-serif"
  ctx.fillText(`Date: ${ticket.eventDetails?.date || "N/A"}`, 20, 70)
  ctx.fillText(`Time: ${ticket.eventDetails?.startTime || "N/A"}`, 20, 95)
  ctx.fillText(`Venue: ${truncateText(ticket.eventDetails?.venueName || "N/A", 25)}`, 20, 120)

  // Ticket Details
  ctx.font = "14px Arial, sans-serif"
  ctx.fillText(`Ticket ID: ${ticket.ticketId || "N/A"}`, 20, 150)
  ctx.fillText(`Status: ${ticket.ticketStatus || "N/A"}`, 20, 175)

  // Price
  ctx.font = "bold 20px Arial, sans-serif"
  ctx.fillText(`$${ticket.totalAmount || "N/A"}`, 20, 250)

  // Right side: Additional info and QR code (white text)
  ctx.fillStyle = "#ffffff"

  // Event Title (truncate if too long)
  ctx.font = "bold 20px Arial, sans-serif"
  ctx.fillText(truncateText(ticket.eventDetails?.title || "Event", 18), 320, 40)

  // Ticket Type and Static Text
  ctx.font = "14px Arial, sans-serif"
  ctx.fillText(truncateText(ticket.ticketType || "N/A", 20), 320, 70)
  ctx.fillText("THIS PARTY IS FOR YOU", 320, 95)

  // Add QR code if available
  if (ticket.qrCodeLink) {
    try {
      const qrImage = new Image()
      qrImage.crossOrigin = "anonymous"
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve
        qrImage.onerror = reject
        qrImage.src = ticket.qrCodeLink!
      })
      ctx.drawImage(qrImage, 320, 200, 80, 80)
    } catch (error) {
      console.warn("Could not load QR code image:", error)
      // Draw placeholder
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(320, 200, 80, 80)
      ctx.fillStyle = "#6B7280"
      ctx.font = "12px Arial, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("QR CODE", 360, 240)
      ctx.textAlign = "left" // Reset alignment
    }
  } else {
    // Draw placeholder
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(320, 200, 80, 80)
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("QR CODE", 360, 240)
    ctx.textAlign = "left" // Reset alignment
  }

  return canvas
}

// Generate PNG image
const generatePNG = async (ticket: ITicket): Promise<Blob> => {
  const canvas = await generateTicketCanvas(ticket)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, "image/png", 1.0)
  })
}

// Download file helper
const downloadFile = (blob: Blob, filename: string, mimeType: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.type = mimeType

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// Fallback text file download
const downloadTicketAsText = (ticket: ITicket) => {
  const ticketContent = `
TICKET DETAILS
==============

Event: ${ticket.eventDetails?.title || "N/A"}
Date: ${ticket.eventDetails?.date || "N/A"}
Time: ${ticket.eventDetails?.startTime || "N/A"}
Venue: ${ticket.eventDetails?.venueName || "N/A"}
Ticket Type: ${ticket.ticketType || "N/A"}
Total Amount: $${ticket.totalAmount || "N/A"}
Ticket ID: ${ticket.ticketId || "N/A"}
Status: ${ticket.ticketStatus || "N/A"}

QR Code: ${ticket.qrCodeLink || "N/A"}

Thank you for your purchase!
  `.trim()

  const blob = new Blob([ticketContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `ticket-${ticket.ticketId || "unknown"}-details.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const DownloadTicket: React.FC<DownloadTicketProps> = ({ ticket, className = "", variant = "dropdown" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)
  const [error, setError] = useState<string>("")

  const downloadOptions = [
    {
      id: "png",
      name: "PNG Image",
      description: "High-resolution image format",
      icon: ImageIcon,
      color: "from-blue-500 to-blue-600",
      size: "~1.8 MB",
    },
  ]

  const handleDownload = async () => {
    setIsDownloading(true)
    setError("")

    try {
      const blob = await generatePNG(ticket)
      const filename = `ticket-${ticket.ticketId || "unknown"}-${
        ticket.eventDetails?.title?.replace(/\s+/g, "-") || "event"
      }.png`
      const mimeType = "image/png"

      downloadFile(blob, filename, mimeType)

      setIsDownloading(false)
      setDownloadComplete(true)

      setTimeout(() => {
        setDownloadComplete(false)
        if (variant !== "modal") {
          setIsOpen(false)
        }
      }, 1500)
    } catch (err) {
      console.error("Download failed:", err)
      setError("Download failed. Please try again.")
      setIsDownloading(false)
      downloadTicketAsText(ticket)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: ticket.eventDetails?.title,
          text: `Check out my ticket for ${ticket.eventDetails?.title}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } catch (err) {
      console.error("Share failed:", err)
    }
  }

  // Button Variant
  if (variant === "button") {
    return (
      <div className={className}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : downloadComplete ? (
            <Check className="h-4 w-4" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>{isDownloading ? "Downloading..." : downloadComplete ? "Downloaded!" : "Download"}</span>
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    )
  }

  // Dropdown Variant
  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Download className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Download Ticket</h3>
                      <p className="text-indigo-100 text-xs">Choose your format</p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-b p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Options */}
                <div className="p-3 space-y-2">
                  {downloadOptions.map((option) => {
                    const Icon = option.icon
                    const isCurrentlyDownloading = isDownloading
                    const isCompleted = downloadComplete

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left border-indigo-500 bg-indigo-50 ${
                          isDownloading ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} text-white`}>
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.div>
                            ) : isCurrentlyDownloading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 text-sm">{option.name}</h5>
                            <p className="text-xs text-gray-600">{option.description}</p>
                          </div>

                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {option.size}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Share Option */}
                <div className="border-t p-3">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium text-sm">Share Ticket</span>
                  </button>
                </div>

                {/* Progress */}
                <AnimatePresence>
                  {isDownloading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-indigo-50 border-t px-3 py-3"
                    >
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-indigo-800">Generating PNG...</p>
                          <div className="w-full bg-indigo-200 rounded-full h-1.5 mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2 }}
                              className="bg-indigo-600 h-1.5 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success */}
                <AnimatePresence>
                  {downloadComplete && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-green-50 border-t px-3 py-3"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-green-100 rounded-full p-1">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-green-800">Download completed!</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Modal Variant
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      >
        <Download className="h-4 w-4" />
        <span>Download</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-3">
                    <Download className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Download Ticket</h3>
                    <p className="text-indigo-100 text-sm">Download as PNG image</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Ticket Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border-2 border-dashed border-gray-200">
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-800 mb-1">{ticket.eventDetails?.title}</h4>
                    <p className="text-sm text-gray-600">
                    {ticket.eventDetails?.date[0].date ? new Date(ticket.eventDetails.date[0].date).toLocaleDateString() : "Date not available"} • {ticket.eventDetails?.startTime}
                    </p>
                    <div className="mt-3 bg-white rounded-lg p-2 inline-block">
                      <img
                        src={ticket.qrCodeLink || "/placeholder.svg?height=80&width=80&text=QR"}
                        alt="QR Code"
                        className="w-16 h-16 mx-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Download Option */}
                <div className="space-y-3 mb-6">
                  {downloadOptions.map((option) => {
                    const Icon = option.icon
                    const isCurrentlyDownloading = isDownloading
                    const isCompleted = downloadComplete

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 border-indigo-500 bg-indigo-50 ${
                          isDownloading ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} text-white`}>
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            ) : isCurrentlyDownloading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>

                          <div className="flex-1 text-left">
                            <h5 className="font-semibold text-gray-800">{option.name}</h5>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {option.size}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Share Option */}
                <div className="border-t pt-4">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">Share Ticket</span>
                  </button>
                </div>
              </div>

              {/* Download Progress */}
              <AnimatePresence>
                {isDownloading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-indigo-50 border-t px-6 py-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-indigo-800">Generating your PNG...</p>
                        <div className="w-full bg-indigo-200 rounded-full h-2 mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2 }}
                            className="bg-indigo-600 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {downloadComplete && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 border-t px-6 py-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">Download completed!</p>
                        <p className="text-xs text-green-600">Your ticket has been saved successfully.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
