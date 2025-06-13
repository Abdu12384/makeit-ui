import { useCreateTicketMutation, useConfirmTicketAndPaymentMutation } from '@/hooks/ClientCustomHooks'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PaymentForm from './PaymentFormStripe'
import { ITicketConfirmationModal, TicketEntity } from '@/types/ticket'
import toast from 'react-hot-toast'
import TicketConfirmationModal from '../event/TicketConfirmationModal'
import TicketBookingLoading from '@/utils/animations/TicketBookingLoading'
import { IEventFormValues } from '@/types/event'

function TicketPaymentForm() {
    const [updatedTicket, setUpdatedTicket] = useState<ITicketConfirmationModal>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const location = useLocation()
    const [loading,setLoading] = useState<boolean>(false)
    const data = location.state as {
        ticket: TicketEntity,
        amount: number,
        totalTicketCount: number,
        vendorId: string,
        event: IEventFormValues
    }
    console.log('here the data',data)
    const createTicket = useCreateTicketMutation()
    const confirmTicket = useConfirmTicketAndPaymentMutation()
    const {ticket} = data

    const handleCreatePaymentIntent = async (paymentMethodId: string) => {
        console.log('ticket data', ticket)
        const response = await createTicket.mutateAsync({
            ...ticket,
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
        setLoading(true)
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
