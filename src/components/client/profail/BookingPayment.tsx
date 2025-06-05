import PaymentForm from '../paymentForm/PaymentFormStripe'
import { useConfirmBookingPaymentMutation, useCreateBookingPaymentMutation } from '@/hooks/ClientCustomHooks'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
// import { BookingType } from '@/types/BookingType'
import { useQueryClient } from '@tanstack/react-query'

function BookingPayment({booking,onClose}: {booking: any,onClose: () => void}) {
    const createBookingPaymentHook = useCreateBookingPaymentMutation()
    const confirmBookingPaymentHook = useConfirmBookingPaymentMutation()
    const amount =booking.service.servicePrice

    console.log('serviceprice',booking.service.servicePrice)
    console.log('booking',booking)
    const navigate = useNavigate()
    const createBookingPayment = async (paymentMethodId: string) => {
        const response = await createBookingPaymentHook.mutateAsync({
            bookingId: booking.bookingId,
            paymentIntentId: paymentMethodId,
        })
        return {
            clientSecret: response.clientStripeId,
            payload: response.booking,
        };
    }
    const queryClient = useQueryClient()
    const confirmBookingPayment = async (booking: string, paymentIntentId: string) => {
        confirmBookingPaymentHook.mutate({ booking: booking, paymentIntentId: paymentIntentId }, {
            onSuccess: (data) => {
                toast.success(data.message)
                queryClient.invalidateQueries({ queryKey: ['Bookings in client'] })
                onClose()

            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }

    return (
        <div>
            <PaymentForm amount={amount} onConfirmSuccess={confirmBookingPayment} onCreatePaymentIntent={createBookingPayment} />
        </div>
    )
}

export default BookingPayment
