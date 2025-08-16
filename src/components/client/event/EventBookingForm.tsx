// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { ITicket } from "@/types/ticket";
// import { useNavigate } from "react-router-dom";
// import { IEvent } from "@/types/event";
// import { useCheckEventBookingAvailabilityMutation } from "@/hooks/ClientCustomHooks";
// import toast from "react-hot-toast";


// interface BookingFormProps {
//   event: IEvent;
//   ticketCount: number;
//   isBookingOpen: boolean;
//   setIsBookingOpen: (open: boolean) => void;
// }

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   email: Yup.string()
//     .required("Email is required")
//     .email("Enter a valid email address")
//     .max(254, "Email must be less than 255 characters")
//     .matches(
//       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//       "Invalid email format"
//     ),

//   phone: Yup.string()
//     .required("Phone number is required")
//     .matches(
//       /^\+?[1-9]\d{9,14}$/,
//       "Enter a valid phone number with 10 to 15 digits, optionally starting with +"
//     ),
// });

// export default function EventBookingForm({
//   event,
//   ticketCount,
//   setIsBookingOpen,
// }: BookingFormProps) {
//   // Calculate total amount
//   const ticketPrice = event.pricePerTicket * ticketCount;
//   const totalAmount = (ticketPrice).toFixed(2);


//   const checkEventBookingAvailabilityMutation = useCheckEventBookingAvailabilityMutation();
 
//   const navigate = useNavigate();


//   const handlePayment = (values: { email: string; phone: string }) => {
   
//     const ticketPaymentData: ITicket = {
//       clientId: "clientId",
//       email: values.email,
//       phone: values.phone,
//       eventId: event.eventId,
//     };

//     checkEventBookingAvailabilityMutation.mutate(
//       {
//         eventId: event.eventId!,
//         ticketCount
//       },
//       {
//         onSuccess: () => {
//           navigate("/ticket-payment", {
//               state: {
//             amount: event.pricePerTicket * ticketCount,
//             event,
//             ticket: ticketPaymentData,
//             type: "ticketBooking",
//             totalTicketCount: ticketCount,
//             vendorId: event?.vendorDetails?.userId,
//             },
//           });
//         },
//         onError: (error) => {
//           toast.error(error?.message)
//         }
//      });

//   }

//   return (
//     <DialogContent className="sm:max-w-md">
//       <DialogHeader>
//         <DialogTitle className="text-[#212A31]">Complete Your Booking</DialogTitle>
//         <DialogDescription className="text-[#748D92]">
//           Enter your details to book {ticketCount} ticket{ticketCount > 1 ? "s" : ""} for {event.title}
//         </DialogDescription>
//       </DialogHeader>

//       <Formik
//         initialValues={{
//           email: "",
//           phone: "",
//         }}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting }) => {
//             handlePayment(values);
//             setSubmitting(false);
//           }}
//       >
//         {({ errors, touched, isSubmitting }) => (
//           <Form className="space-y-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Field
//                 as={Input}
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="john.doe@example.com"
//                 className={errors.email && touched.email ? "border-red-500" : ""}
//               />
//               {errors.email && touched.email && (
//                 <p className="text-red-500 text-xs">{errors.email}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone number</Label>
//               <Field
//                 as={Input}
//                 id="phone"
//                 name="phone"
//                 placeholder="+91 123 456 7890"
//                 className={errors.phone && touched.phone ? "border-red-500" : ""}
//               />
//               {errors.phone && touched.phone && (
//                 <p className="text-red-500 text-xs">{errors.phone}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label>Number of tickets</Label>
//            </div>

//             <Separator className="my-4" />

//             <div className="bg-[#D3D9D4]/10 rounded-lg p-4">
//               <div className="flex justify-between mb-2">
//                 <span className="text-[#2E3944]">Ticket price</span>
//                 <span className="text-[#212A31] font-medium">
//                   ₹{event.pricePerTicket} x {ticketCount}
//                 </span>
//               </div>
//               <Separator className="my-3 bg-[#D3D9D4]/50" />
//               <div className="flex justify-between font-bold">
//                 <span className="text-[#212A31]">Total</span>
//                 <span className="text-[#124E66]">₹{totalAmount}</span>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsBookingOpen(false)}
//                 type="button"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-[#124E66] hover:bg-[#124E66]/90 text-white"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Processing..." : "Complete Booking"}
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </DialogContent>
//   );
// }






import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ITicket } from "@/types/ticket";
import { useNavigate } from "react-router-dom";
import { IEvent } from "@/types/event";
import { useCheckEventBookingAvailabilityMutation, useGetWalletAmountMutation, usePurchaseTicketWithWallet } from "@/hooks/ClientCustomHooks";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import TicketConfirmationModal from "./TicketConfirmationModal";
import TicketBookingLoading from "@/utils/animations/TicketBookingLoading";

interface BookingFormProps {
  event: IEvent;
  ticketCount: number;
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
  setIsBookingOpen,
}: BookingFormProps) {
  // Calculate total amount
  const ticketPrice = event.pricePerTicket * ticketCount;
  const totalAmount = ticketPrice.toFixed(2);

  const checkEventBookingAvailabilityMutation = useCheckEventBookingAvailabilityMutation();
  const navigate = useNavigate();

 
    const getWalletAmountMutation = useGetWalletAmountMutation();
    const purchaseTicketWithWalletMutation = usePurchaseTicketWithWallet();
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading,setLoading] = useState(false)

    useEffect(() => {
      getWalletAmountMutation.mutate(
        undefined,
        {
        onSuccess: (data) => {
          console.log('wlalet data',data)
          setWalletBalance(data.wallet)
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to fetch wallet balance")
        }
      }
    )
    },[])


  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "stripe">("wallet");
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [updatedTicket, setUpdatedTicket] = useState<ITicket>()

  const handlePayment = (values: { email: string; phone: string }) => {
    const ticketPaymentData: ITicket = {
      clientId: "clientId", 
      email: values.email,
      phone: values.phone,
      eventId: event.eventId,
      paymentMethod, 
    };

    checkEventBookingAvailabilityMutation.mutate(
      {
        eventId: event.eventId!,
        ticketCount,
      },
      {
        onSuccess: () => {
          if (paymentMethod === "wallet" && walletBalance >= ticketPrice) {
            setLoading(true)
            purchaseTicketWithWalletMutation.mutate(
              {
                amount: ticketPrice,
                event,
                ticket: ticketPaymentData,
                type: "ticketBooking",
                totalTicketCount: ticketCount,
                vendorId: event?.vendorDetails?.userId ?? "",
                paymentMethod: "wallet",
              },
              {
                onSuccess: (response) => {
                  toast.success("Ticket purchased successfully");
                  setUpdatedTicket(response.data.Ticket)  
                  setTimeout(() => {
                    setLoading(false)
                    setIsOpen(true)
                  }, 2000)
                  
                },
                onError: (error) => {
                  toast.error(error?.message || "Failed to purchase ticket");
                  setLoading(false)
                },
              }
            );


             

          } else if (paymentMethod === "wallet" && walletBalance < ticketPrice) {
            toast.error("Insufficient wallet balance. Please use Stripe or add funds.");
            setPaymentMethod("stripe");
          } else {
            navigate("/ticket-payment", {
              state: {
                amount: ticketPrice,
                event,
                ticket: ticketPaymentData,
                type: "ticketBooking",
                totalTicketCount: ticketCount,
                vendorId: event?.vendorDetails?.userId,
                paymentMethod: "stripe",
              },
            });
          }
        },
        onError: (error) => {
          toast.error(error?.message || "Booking failed");
        },
      }
    );
  };

  return (
    <>
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
              <p className="text-[#2E3944]">{ticketCount}</p>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                  />
                  <span className="text-[#2E3944]">Wallet Pay</span>
                </label>
                <label className="flex items-center gap-2">
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                  />
                  <span className="text-[#2E3944]">Stripe Pay</span>
                </label>
              </div>
              {paymentMethod === "wallet" && (
                <div className="text-sm text-[#748D92]">
                  Wallet Balance: ₹{walletBalance.toFixed(2)}
                  {walletBalance < ticketPrice && (
                    <span className="text-red-500 ml-2">Insufficient balance</span>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-4" />

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
                disabled={isSubmitting || (paymentMethod === "wallet" && walletBalance < ticketPrice)}
              >
                {isSubmitting ? "Processing..." : "Complete Booking"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </DialogContent>
       {isOpen && <TicketConfirmationModal isOpen={isOpen} setIsOpen={setIsOpen} ticket={updatedTicket!}  event={event}/>}
      {loading && <TicketBookingLoading visible={loading}/>}
     </>
  );
}