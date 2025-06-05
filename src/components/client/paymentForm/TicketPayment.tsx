import { useCreateTicketMutation, useConfirmTicketAndPaymentMutation } from '@/hooks/ClientCustomHooks'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PaymentForm from './PaymentFormStripe'
import { TicketBackendEntity } from '@/types/ticket'
import { TicketEntity } from '@/types/ticket'
import toast from 'react-hot-toast'
import TicketConfirmationModal from '../event/TicketConfirmationModal'
import TicketBookingLoading from '@/utils/animations/TicketBookingLoading'

function TicketPaymentForm() {
    const [updatedTicket, setUpdatedTicket] = useState<TicketBackendEntity>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const location = useLocation()
    const [loading,setLoading] = useState<boolean>(false)
    const data = location.state
    const createTicket = useCreateTicketMutation()
    const confirmTicket = useConfirmTicketAndPaymentMutation()

    const handleCreatePaymentIntent = async (paymentMethodId: string) => {
        setLoading(true)
        const response = await createTicket.mutateAsync({
            ticket: data.ticketData,
            paymentIntentId: paymentMethodId,
            totalAmount: data.amount,
            totalCount: data.totalTicketCount,
            vendorId: data.vendorId,
        });
        return {  
            clientSecret: response.stripeClientId,
            payload: response.createdTicket,
        };
    };

    const handleConfirmSuccess = (ticketData: TicketEntity, paymentIntentId: string) => {
        confirmTicket.mutate({
            ticket: ticketData,
            paymentIntentId: paymentIntentId,
            vendorId: data.vendorId,
        }, {
            onSuccess: (response) => {
                console.log('data',response)
                setTimeout(() => {
                    setUpdatedTicket(response.confirmTicket)
                    setIsOpen(true)
                    setLoading(false)
                }, 3000)
            },
            onError:(err)=>{
                toast.error(err.message)
                setLoading(false)
            }
        });
    };

    return (
        <div className='h-screen'>
            <PaymentForm amount={data.amount} onConfirmSuccess={handleConfirmSuccess} onCreatePaymentIntent={handleCreatePaymentIntent} />
            {isOpen && <TicketConfirmationModal isOpen={isOpen} setIsOpen={setIsOpen} ticket={updatedTicket!}  event={data.event}/>}
            {loading && <TicketBookingLoading visible={loading}/>}
        </div>
    )
}

export default TicketPaymentForm
