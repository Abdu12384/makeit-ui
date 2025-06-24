// import PaymentForm from '../paymentForm/PaymentFormStripe'
// import { useConfirmBookingPaymentMutation, useCreateBookingPaymentMutation } from '@/hooks/ClientCustomHooks'
// import {    toast } from 'react-hot-toast'
// import { useQueryClient } from '@tanstack/react-query'

// function BookingPayment({booking,onClose}: {booking: any,onClose: () => void}) {
//     const createBookingPaymentHook = useCreateBookingPaymentMutation()
//     const confirmBookingPaymentHook = useConfirmBookingPaymentMutation()
//     const amount =booking.service.servicePrice

//     console.log('serviceprice',booking.service.servicePrice)
//     console.log('booking',booking)
//     const createBookingPayment = async (paymentMethodId: string) => {
//         const response = await createBookingPaymentHook.mutateAsync({
//             bookingId: booking.bookingId,
//             paymentIntentId: paymentMethodId,
//         })
//         return {
//             clientSecret: response.clientStripeId,
//             payload: response.booking,
//         };
//     }
//     const queryClient = useQueryClient()
//     const confirmBookingPayment = async (booking: string, paymentIntentId: string) => {
//         confirmBookingPaymentHook.mutate({ booking: booking, paymentIntentId: paymentIntentId }, {
//             onSuccess: (data) => {
//                 toast.success(data.message)
//                 queryClient.invalidateQueries({ queryKey: ['Bookings in client'] })
//                 onClose()

//             },
//             onError: (err) => {
//                 toast.error(err.message)
//             }
//         })
//     }

//     return (
//         <div>
//             <PaymentForm amount={amount} onConfirmSuccess={confirmBookingPayment} onCreatePaymentIntent={createBookingPayment} />
//         </div>
//     )
// }

// export default BookingPayment

import PaymentForm from '../paymentForm/PaymentFormStripe'
import { useConfirmBookingPaymentMutation, useCreateBookingPaymentMutation } from '@/hooks/ClientCustomHooks'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
// import TicketBookingLoading from '@/utils/animations/TicketBookingLoading'

function BookingPayment() {
    const [_loading, setLoading] = useState<boolean>(false)
    const location = useLocation()
    const queryClient = useQueryClient()
    // const navigate = useNavigate()
    
    // Get data from location state
    const data = location.state as {
        booking: any,
        amount: number,
        type: string,
        bookingDeatils: any,
        // Add any other properties you need to pass
    }
    
    console.log('booking payment data', data)
    
    const createBookingPaymentHook = useCreateBookingPaymentMutation()
    const confirmBookingPaymentHook = useConfirmBookingPaymentMutation()
    
    const { booking, amount,bookingDeatils } = data
    
    console.log('serviceprice', amount)
    console.log('booking', booking)
    console.log('bookingDeatils', bookingDeatils)
    
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
                console.log('booking payment success', response)
              
                setTimeout(() => {
                    toast.success(response.message)
                    queryClient.invalidateQueries({ queryKey: ['Bookings in client'] })
                    setLoading(false)
                    // navigate('/client/booking') 
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