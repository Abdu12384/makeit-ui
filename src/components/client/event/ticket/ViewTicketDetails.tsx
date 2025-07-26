
import { ITicket } from "@/types/ticket"
import { Calendar, Clock, User, X, Download } from "lucide-react"

//  Component for the ticket details modal
export const TicketDetailsModal: React.FC<{
  ticket: ITicket
  onClose: () => void
}> = ({ ticket, onClose }) => {


  const formatTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(parseInt(hour));
    date.setMinutes(parseInt(minute));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleDownloadTicket = async () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return
      
      canvas.width = 800
      canvas.height = 400
      
      // Draw the ticket background
      // Left side (white)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 400, 400)
      
      // Right side (purple gradient effect)
      const gradient = ctx.createLinearGradient(400, 0, 800, 0)
      gradient.addColorStop(0, '#7c3aed')
      gradient.addColorStop(1, '#4338ca')
      ctx.fillStyle = gradient
      ctx.fillRect(400, 0, 400, 400)
      
      // Add border
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, 800, 400)
      
      // Left side content
      ctx.fillStyle = '#581c87'
      ctx.font = 'bold 28px Arial'
      ctx.fillText(ticket.eventDetails?.title || 'Event', 30, 60)
      
      // Event details
      ctx.font = '18px Arial'
      ctx.fillStyle = '#374151'
      ctx.fillText(`📅 ${ticket?.eventDetails?.date ? ticket.eventDetails.date.map((entry) => entry.date).join(', ') : ''}  `, 30, 100)
      ctx.fillText(`🕐 ${formatTo12Hour(ticket?.eventDetails?.startTime || "")}`, 30, 130)
      ctx.fillText(`🎫 ${ticket.ticketType || 'General Admission'}`, 30, 160)
      
      // Price section
      ctx.font = '14px Arial'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('Total Amount', 30, 200)
      ctx.font = 'bold 32px Arial'
      ctx.fillStyle = '#581c87'
      ctx.fillText(`₹${ticket.totalAmount || '0'}`, 30, 240)
      
      // Status
      ctx.font = '16px Arial'
      ctx.fillStyle = ticket.ticketStatus === 'unused' ? '#059669' : '#dc2626'
      ctx.fillText(`Status: ${ticket.ticketStatus?.toUpperCase() || 'PENDING'}`, 30, 280)
      
      // Ticket ID
      ctx.font = '12px Arial'
      ctx.fillStyle = '#6b7280'
      ctx.fillText(`Ticket ID: ${ticket.ticketId?.substring(0, 20) || 'N/A'}...`, 30, 320)
      
      // Contact info
      ctx.fillText(`Email: ${ticket.email || 'N/A'}`, 30, 340)
      ctx.fillText(`Phone: ${ticket.phone || 'N/A'}`, 30, 360)
      
      // Right side content (white text)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(ticket.eventDetails?.title || 'Event', 430, 60)
      
      ctx.font = '16px Arial'
      ctx.fillText(ticket.ticketType || 'General Admission', 430, 90)
      ctx.fillText('ADMIT ONE', 430, 120)
      ctx.fillText('THIS TICKET IS FOR YOU', 430, 150)
      
      // Payment info
      ctx.font = '14px Arial'
      ctx.fillText('Payment Status:', 430, 200)
      ctx.font = 'bold 16px Arial'
      ctx.fillText(ticket.paymentStatus?.toUpperCase() || '', 430, 220)
      
      // Add QR code if available
      if (ticket.qrCodeLink) {
        const qrImage = new Image()
        qrImage.crossOrigin = 'anonymous'
        qrImage.onload = () => {
          // Draw QR code background
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(450, 260, 120, 120)
          ctx.strokeStyle = '#e5e7eb'
          ctx.lineWidth = 1
          ctx.strokeRect(450, 260, 120, 120)
          
          // Draw QR code
          ctx.drawImage(qrImage, 460, 270, 100, 100)
          
          // QR code label
          ctx.fillStyle = '#ffffff'
          ctx.font = '12px Arial'
          ctx.fillText('SCAN TO VERIFY', 470, 250)
          
          downloadCanvas(canvas)
        }
        qrImage.onerror = () => {
          // If QR code fails to load, add placeholder
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(450, 260, 120, 120)
          ctx.strokeStyle = '#e5e7eb'
          ctx.lineWidth = 1
          ctx.strokeRect(450, 260, 120, 120)
          
          ctx.fillStyle = '#6b7280'
          ctx.font = '12px Arial'
          ctx.fillText('QR CODE', 480, 325)
          ctx.fillText('UNAVAILABLE', 470, 340)
          
          downloadCanvas(canvas)
        }
        qrImage.src = ticket.qrCodeLink
      } else {
        // Add placeholder for QR code
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(450, 260, 120, 120)
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.strokeRect(450, 260, 120, 120)
        
        ctx.fillStyle = '#6b7280'
        ctx.font = '12px Arial'
        ctx.fillText('QR CODE', 480, 325)
        ctx.fillText('UNAVAILABLE', 470, 340)
        
        downloadCanvas(canvas)
      }
      
      // Add perforation line effect
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 10])
      ctx.beginPath()
      ctx.moveTo(400, 20)
      ctx.lineTo(400, 380)
      ctx.stroke()
      ctx.setLineDash([])
      
    } catch (error) {
      console.error('Error downloading ticket:', error)
      // Fallback: download ticket details as text file
      downloadTicketAsText()
    }
  }

  const downloadCanvas = (canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `ticket-${ticket.ticketId?.substring(0, 8) || 'download'}-${ticket.eventDetails?.title?.replace(/\s+/g, '-') || 'event'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  const downloadTicketAsText = () => {
    const ticketContent = `
TICKET DETAILS
==============

Event: ${ticket.eventDetails?.title || 'N/A'}
Date:  ${ticket.eventDetails?.date?.map((entry) => entry.date).join(', ') || 'N/A'}
Time: ${ticket.eventDetails?.startTime || 'N/A'}
Ticket Type: ${ticket.ticketType || 'N/A'}
Total Amount: ₹${ticket.totalAmount || 'N/A'}
Ticket Count: ${ticket.ticketCount || 1}

CONTACT INFORMATION
==================
Email: ${ticket.email || 'N/A'}
Phone: ${ticket.phone || 'N/A'}

PAYMENT DETAILS
===============
Payment Status: ${ticket.paymentStatus || 'N/A'}
Payment Transaction ID: ${ticket.paymentTransactionId || 'N/A'}
Ticket Status: ${ticket.ticketStatus || 'N/A'}

VERIFICATION
============
Ticket ID: ${ticket.ticketId || 'N/A'}
QR Code: ${ticket.qrCodeLink || 'N/A'}

Thank you for your purchase!
Generated on: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([ticketContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ticket-${ticket.ticketId?.substring(0, 8) || 'download'}-details.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 flex bg-black/50 items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden transform transition-all duration-300`}
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <h3 className="text-2xl font-bold">{ticket?.eventDetails?.title}</h3>
          <div className="flex items-center mt-2 space-x-4">
              {ticket?.eventDetails?.date?.map((entry, index) => (
                <div key={index} className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {formatTo12Hour(entry.startTime)} - {formatTo12Hour(entry.endTime)}
                    </span>
                  </div>
                </div>
              ))}          
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{ticket?.ticketCount! > 1 ? `${ticket?.ticketCount} tickets` : "1 ticket"}</span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Left Section: Event Info and QR Code */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{ticket?.totalAmount}</p>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-600 uppercase">{ticket?.paymentStatus}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-500 uppercase font-medium">Scan to verify ticket</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-inner mx-auto max-w-[200px]">
                <img
                  src={ticket.qrCodeLink || "/placeholder.svg?height=200&width=200&text=QR+Code"}
                  alt="Ticket QR Code"
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500">Ticket ID: {ticket?.ticketId?.substring(0, 16)}...</p>
              </div>
            </div>
          </div>

          {/* Right Section: Payment and User Details */}
          <div className="flex-1">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID:</span>
                <span className="text-gray-700 font-medium">{ticket?.paymentTransactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="text-gray-700 font-medium">{ticket?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="text-gray-700 font-medium">{ticket?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-gray-700 font-medium capitalize">{ticket?.ticketStatus}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={handleDownloadTicket}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}