import PaymentForm from '../paymentForm/PaymentFormStripe'
import { useConfirmBookingPaymentMutation, useCreateBookingPaymentMutation } from '@/hooks/ClientCustomHooks'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { IBooking } from '@/types/bookings'
// import TicketBookingLoading from '@/utils/animations/TicketBookingLoading'

function BookingPayment() {
    const [_loading, setLoading] = useState<boolean>(false)
    // const [isOpen, setIsOpen] = useState<boolean>(false)
    const location = useLocation()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    
    // Get data from location state
    const data = location.state as {
        booking: IBooking,
        amount: number,
        type: string,
        bookingDeatils: IBooking,
    }
    
    
    const createBookingPaymentHook = useCreateBookingPaymentMutation()
    const confirmBookingPaymentHook = useConfirmBookingPaymentMutation()
    
    const { booking, amount,bookingDeatils } = data
    
    
    const createBookingPayment = async (paymentMethodId: string) => {
        const response = await createBookingPaymentHook.mutateAsync({
            bookingId: booking.bookingId,
            paymentIntentId: paymentMethodId,
            bookingDetails: bookingDeatils,
        })
        return {
            clientSecret: response.clientStripeId,
            payload: response.booking,
        };
    }
    
    const confirmBookingPayment = async (bookingData: string, paymentIntentId: string) => {
        setLoading(true)
        confirmBookingPaymentHook.mutate({ 
            booking: bookingData, 
            paymentIntentId: paymentIntentId 
        }, {
            onSuccess: (response) => {
                setTimeout(() => {
                    toast.success(response.message)
                    queryClient.invalidateQueries({ queryKey: ['Bookings in client'] })
                    setLoading(false)
                    navigate('/client/bookings')
                }, 3000)
            },
            onError: (err) => {
                toast.error(err.message)
                setLoading(false)
            }
        })
    }
    
    return (
        <div className='h-screen'>
            <PaymentForm 
                amount={amount} 
                onConfirmSuccess={confirmBookingPayment} 
                onCreatePaymentIntent={createBookingPayment} 
            />
            {/* {loading && <TicketBookingLoading visible={loading}/>} */}
        </div>
    )
}

export default BookingPayment