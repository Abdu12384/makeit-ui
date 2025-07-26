import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  Calendar, Clock, MapPin, User, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {  ITicketConfirmationModalProps } from "@/types/ticket";
import { CLOUDINARY_BASE_URL } from "@/types/config/config";



export default function TicketConfirmationModal({ isOpen, setIsOpen, ticket,event }: ITicketConfirmationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const eventName = ticket?.eventName || "EVENT NAME";
  const eventDate =
    ticket?.eventDate ||
    new Date(ticket.createdAt!)
      .toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();

  // Format data for display
  const formattedDate = event?.date?.[0]?.date
  ? new Date(event.date[0].date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\//g, ".")
  : "N/A";
  // const formattedAmount = (ticket.totalAmount / 100).toFixed(2);
  const ticketIdShort = ticket?.ticketId?.substring(ticket.ticketId.length - 8);
  const transactionIdShort = ticket?.paymentTransactionId?.substring(0, 12);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      document.body.style.overflow = "auto";
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleBackToEvent = () => {
    setIsOpen(false);
    navigate(`/events`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl transition-all duration-500 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >

        {/* Ticket Content */}
        <div className="flex justify-center items-center bg-gray-100 p-4">
          <div
            className={`max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-700 ${
              isAnimating ? "scale-105" : "scale-100"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Section */}
              <div className="w-full md:w-7/12 bg-white p-8 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-800"></div>

                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">{event?.title}</h1>
                  <p className="text-gray-600 mt-1">Ticket #{ticketIdShort}</p>
                </div>

                <div className="relative h-48 md:h-64 mb-6 overflow-hidden rounded-lg">
                  <img
                    src={CLOUDINARY_BASE_URL + event?.posterImage[0] || "/placeholder.svg"}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event?.address}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-purple-600" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-600" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{event?.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="text-purple-600" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold truncate max-w-[150px]">{ticket.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-purple-600" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold">{ticket.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed pt-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Price</p>
                    <p className="text-2xl font-bold">₹{ticket.totalAmount}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                    <Check size={16} className="text-green-600" />
                    <span className="text-green-600 font-medium text-sm">Payment Successful</span>
                  </div>
                </div>

                <Button
                  onClick={handleBackToEvent}
                  className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-800 hover:from-purple-700 hover:to-indigo-900 text-white"
                >
                  Back to Event
                </Button>
              </div>

              {/* Right Section - Tear Line */}
              <div className="hidden md:flex flex-col items-center justify-center px-1">
                <div className="h-full w-0 border-l border-dashed border-gray-300 relative">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-gray-100 rounded-full -left-1.5"
                      style={{ top: `${i * 8 + 4}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Right Section */}
              <div className="w-full md:w-5/12 bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-8 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{eventName}</h2>
                  <p className="opacity-80 text-sm mt-1">#{ticketIdShort}</p>
                </div>

                <div className="mb-6">
                  <p className="opacity-80">{eventDate}</p>
                  <p className="opacity-80 text-sm mt-2">Ticket Status: {ticket?.ticketStatus?.toUpperCase()}</p>
                </div>

                <div className="mt-auto">
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <div className="flex justify-center">
                      <img
                        src={ticket.qrCodeLink}
                        alt="QR Code"
                        className="w-full max-w-[180px] h-auto"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="opacity-80 text-sm">Scan this QR code at the event entrance</p>
                    <p className="mt-4 text-xs opacity-70">Transaction ID: {transactionIdShort}...</p>
                    <p className="text-xs opacity-70">Created: {new Date(ticket.createdAt!).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}