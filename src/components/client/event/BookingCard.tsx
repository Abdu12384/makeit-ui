import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import toast from "react-hot-toast";

interface BookingCardProps {
  event: Event;
  ticketCount: number;
  setTicketCount: (count: number) => void;
  handleBookNow: () => void;
}

export default function BookingCard({ event, ticketCount, setTicketCount, handleBookNow }: BookingCardProps) {
  const handleTicketChange = (change: number) => {
    const newCount = ticketCount + change;
  // const remainingTickets = event.totalTicket - (event.ticketPurchased || 0);

  if (change > 0) {
    // if (newCount >= remainingTickets) {
    //   toast.error(`${remainingTickets} tickets left.`);
    //   return;
    // }
    if (newCount > event.maxTicketsPerUser!) {
      toast.error(`You can only book up to ${event.maxTicketsPerUser} tickets.`);
      return;
    }
  }

  if (newCount >= 1) {
    setTicketCount(newCount);
  }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="sticky top-24"
    >
      <Card className="bg-white border-none shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#212A31] mb-4">Book Tickets</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[#748D92] text-sm">Price per ticket</p>
              <p className="text-2xl font-bold text-[#212A31]">₹{event.pricePerTicket}</p>
            </div>
            <Badge variant="outline" className="bg-[#124E66]/10 text-[#124E66] border-[#124E66]/20 px-3 py-1">
              {event.totalTicket - (event.ticketPurchased || 0)} left
            </Badge>
          </div>

          <div className="mb-6">
            <p className="text-[#748D92] text-sm mb-2">Tickets sold</p>
            <div className="flex items-center justify-between mb-1.5 text-xs text-[#2E3944]">
              <span>{Math.round(((event.ticketPurchased || 0) / event.totalTicket) * 100)}% Booked</span>
              <span>
                {(event.ticketPurchased || 0)} / {event.totalTicket}
              </span>
            </div>
            <Progress
              value={((event.ticketPurchased || 0) / event.totalTicket) * 100}
              className="h-2 bg-[#D3D9D4]/30"
            />
          </div>

          <Separator className="my-6 bg-[#D3D9D4]/50" />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium text-[#212A31]">Number of tickets</p>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-[#748D92]/30"
                  onClick={() => handleTicketChange(-1)}
                  disabled={ticketCount <= 1}
                >
                  -
                </Button>
                <span className="mx-4 font-medium text-[#212A31]">{ticketCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-[#748D92]/30"
                  onClick={() => handleTicketChange(1)}
                  // disabled={ticketCount >= event.maxTicketsPerUser! || ticketCount >= event.totalTicket - (event.ticketPurchased || 0)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="bg-[#D3D9D4]/10 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-[#2E3944]">Ticket price</span>
                <span className="text-[#212A31] font-medium">
                  ₹{event.pricePerTicket} x {ticketCount}
                </span>
              </div>
              <Separator className="my-3 bg-[#D3D9D4]/50" />
              <div className="flex justify-between font-bold">
                <span className="text-[#212A31]">Total</span>
                <span className="text-[#124E66]">
                  ₹{(event.pricePerTicket * ticketCount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-[#124E66] hover:bg-[#124E66]/90 text-white py-6" onClick={handleBookNow}>
            Book Now
          </Button>

          <div className="mt-4 flex items-center justify-center text-xs text-[#748D92]">
            <Info className="h-3 w-3 mr-1" />
            <span>Tickets are non-refundable after 14 days before the event</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}