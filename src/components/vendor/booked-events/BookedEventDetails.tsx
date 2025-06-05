"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, X, QrCode, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TicketScanner from "./TikcetScanner";

interface EventDetailsProps {
  event: any;
  onClose: () => void;
  onScanTicket: (data: { ticketId: string }) => void;
}

export function BookedEventDetails({ event, onClose, onScanTicket }: EventDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const handleScanTicket = () => {
    setIsScanning(true);
  };

  // Calculate stats for the table
  const totalAttendees = event?.attendeeCount || 0;
  const totalCapacity = event?.totalTicket || 1;
  const checkedIn = event?.checkedInCount || 0;
  const ticketsAvailable = totalCapacity - totalAttendees;
  const attendeesPercentage = Math.round((totalAttendees / totalCapacity) * 100) || 0;
  const checkedInPercentage = Math.round((checkedIn / (totalAttendees || 1)) * 100) || 0;
  const availablePercentage = Math.round((ticketsAvailable / totalCapacity) * 100) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-64 bg-gradient-to-r from-purple-500 to-pink-500">
        {event.posterImage && (
          <img
            src={event.posterImage[0] || "/placeholder.svg"}
            alt={event?.title}
            className="w-full h-full object-cover"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 hover:bg-background/90 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 hover:bg-background/90 rounded-full"
          onClick={() => navigate("/vendor/booked-events")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{event?.title}</h2>
            <p className="text-muted-foreground">{event?.description}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleScanTicket} className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Scan Ticket
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Link to={`/vendor/events/attendees/${event.eventId}`}>View Attendees</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Calendar className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <span className="font-medium">
                    {new Date(event?.date[0]).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <Clock className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <span className="font-medium">
                    {new Date(event?.date[0]).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                <MapPin className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{event?.address}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">About this event</h3>
              <p className="text-muted-foreground">{event?.fullDescription || event?.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                <Separator className="my-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Organizer</p>
                    <p className="font-medium">{event?.hostedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{event?.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{event?.totalTicket} people</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{event?.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                <Separator className="my-3" />
                <p className="text-muted-foreground">
                  {event?.additionalInfo || "No additional information available."}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Attendees</p>
                  <p className="text-3xl font-bold">{totalAttendees}</p>
                  <p className="text-xs text-muted-foreground">{attendeesPercentage}% of capacity</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Checked In</p>
                  <p className="text-3xl font-bold">{checkedIn}</p>
                  <p className="text-xs text-muted-foreground">{checkedInPercentage}% of attendees</p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Tickets Available</p>
                  <p className="text-3xl font-bold">{ticketsAvailable}</p>
                  <p className="text-xs text-muted-foreground">{availablePercentage}% remaining</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Ticket Sales</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-muted">
                        <th className="py-2 px-4 text-sm font-semibold text-foreground">Metric</th>
                        <th className="py-2 px-4 text-sm font-semibold text-foreground">Count</th>
                        <th className="py-2 px-4 text-sm font-semibold text-foreground">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-muted">
                        <td className="py-2 px-4 text-sm text-muted-foreground">Total Attendees</td>
                        <td className="py-2 px-4 text-sm font-medium">{totalAttendees}</td>
                        <td className="py-2 px-4 text-sm font-medium">{attendeesPercentage}%</td>
                      </tr>
                      <tr className="border-b border-muted">
                        <td className="py-2 px-4 text-sm text-muted-foreground">Checked In</td>
                        <td className="py-2 px-4 text-sm font-medium">{checkedIn}</td>
                        <td className="py-2 px-4 text-sm font-medium">{checkedInPercentage}%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-sm text-muted-foreground">Tickets Available</td>
                        <td className="py-2 px-4 text-sm font-medium">{ticketsAvailable}</td>
                        <td className="py-2 px-4 text-sm font-medium">{availablePercentage}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={isScanning}
        onOpenChange={(open) => {
          setIsScanning(open);
        }}
      >
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Scan Ticket QR Code</DialogTitle>
            <DialogDescription>Point your camera at the ticket QR code to check in the attendee.</DialogDescription>
          </DialogHeader>
          <TicketScanner />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}