import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TicketEntity } from "@/types/ticket";
import { useNavigate } from "react-router-dom";
import { Event } from "@/pages/client/event-details-page";


interface BookingFormProps {
  event: Event;
  ticketCount: number;
  setTicketCount: (count: number) => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
}

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address")
    .max(254, "Email must be less than 255 characters")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+?[1-9]\d{9,14}$/,
      "Enter a valid phone number with 10 to 15 digits, optionally starting with +"
    ),
});

export default function EventBookingForm({
  event,
  ticketCount,
  setTicketCount,
  setIsBookingOpen,
}: BookingFormProps) {
  // Calculate total amount
  const ticketPrice = event.pricePerTicket * ticketCount;
  // const serviceFee = event.pricePerTicket * 0.1 * ticketCount;
  const totalAmount = (ticketPrice).toFixed(2);

  const navigate = useNavigate();

  // Handle ticket count change
  const handleTicketChange = (change: number) => {
    const newCount = ticketCount + change;
    if (newCount >= 1 && newCount <= 10 && newCount <= event.totalTicket - event.attendeesCount) {
      setTicketCount(newCount);
    }
  };


  const handlePayment = (values: { email: string; phone: string }) => {
   
    console.log(values)
    const ticketPaymentData: TicketEntity = {
      clientId: "clientId",
      email: values.email,
      phone: values.phone,
      eventId: event.eventId,
    };

    navigate("/ticket-payment", {
      state: {
        amount: event.pricePerTicket * ticketCount,
        event,
        ticket: ticketPaymentData,
        type: "ticketBooking",
        totalTicketCount: ticketCount,
        vendorId: event?.vendorDetails?.userId,
      },
    });
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-[#212A31]">Complete Your Booking</DialogTitle>
        <DialogDescription className="text-[#748D92]">
          Enter your details to book {ticketCount} ticket{ticketCount > 1 ? "s" : ""} for {event.title}
        </DialogDescription>
      </DialogHeader>

      <Formik
        initialValues={{
          email: "",
          phone: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
            handlePayment(values);
            setSubmitting(false);
          }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                className={errors.email && touched.email ? "border-red-500" : ""}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Field
                as={Input}
                id="phone"
                name="phone"
                placeholder="+91 123 456 7890"
                className={errors.phone && touched.phone ? "border-red-500" : ""}
              />
              {errors.phone && touched.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Number of tickets</Label>
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-[#748D92]/30"
                  onClick={() => handleTicketChange(-1)}
                  disabled={ticketCount <= 1}
                  type="button"
                >
                  -
                </Button>
                <span className="mx-4 font-medium text-[#212A31]">{ticketCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-[#748D92]/30"
                  onClick={() => handleTicketChange(1)}
                  disabled={ticketCount >= 10 || ticketCount >= event.totalTicket - event.attendeesCount}
                  type="button"
                >
                  +
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="bg-[#D3D9D4]/10 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-[#2E3944]">Ticket price</span>
                <span className="text-[#212A31] font-medium">
                  ₹{event.pricePerTicket} x {ticketCount}
                </span>
              </div>
              {/* <div className="flex justify-between mb-2">
                <span className="text-[#2E3944]">Service fee</span>
                <span className="text-[#212A31] font-medium">₹{serviceFee.toFixed(2)}</span>
              </div> */}
              <Separator className="my-3 bg-[#D3D9D4]/50" />
              <div className="flex justify-between font-bold">
                <span className="text-[#212A31]">Total</span>
                <span className="text-[#124E66]">₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsBookingOpen(false)}
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#124E66] hover:bg-[#124E66]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </DialogContent>
  );
}