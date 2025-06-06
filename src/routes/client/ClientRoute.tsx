import { LoginComponent } from "@/components/client/login/Login"
import ClientBookings from "@/components/client/profail/bookings"
import { ClientProfile } from "@/components/client/profail/ClientProfail"
import { SignupComponent } from "@/components/client/signup/Signup"
import { ClientWallet } from "@/components/client/wallet/ClientWallet"
import TicketPaymentForm from "@/components/client/paymentForm/TicketPayment"
import EventDetailsPage from "@/pages/client/event-details-page"
import EventsPage from "@/pages/client/event-page"
import ClientHome from "@/pages/client/home-page"
import ClientProfailLayout from "@/pages/client/profail-page"
import { BookingPage } from "@/pages/client/service-details-page"
import { ServiceListings } from "@/pages/client/service-listing-page"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Routes, Route } from "react-router-dom"
import { MyTickets } from "@/components/client/event/ticket/BookedTickets"
import ForgotPasswordEmail from "@/components/common/ForgotPassword/ForgotPassword"
import ResetPassword from "@/components/common/ForgotPassword/ResetPassword"
import ClientChatPage from "@/pages/client/chat-page-client"


 export const ClientRoutes = () =>{
   
     return (
        <Routes> 
          <Route path="/" element={<ClientHome/>}/>
           
          <Route path="/signup" element={<NoAuthRoute element={<SignupComponent />} />} />
          <Route path="/login" element={<NoAuthRoute element={<LoginComponent />} />} />
          <Route path="/forgot-password" element={<NoAuthRoute element={<ForgotPasswordEmail userType="client" />} />} />
          <Route path="/reset-password/:token" element={<NoAuthRoute element={<ResetPassword userType="client" />} />} />




            <Route path="/services" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<ServiceListings />} />
                       } />
            <Route path="/services/details/:id" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<BookingPage />} />
                       } />


            <Route path="/events" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<EventsPage />} />
                       } />

            <Route path="/events/details/:eventId" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<EventDetailsPage />} />
                       } />

            <Route path="/ticket-payment" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<TicketPaymentForm />} />
                       } />


          <Route path="/client" element={ 
                      <ProtectedRoute  allowedRoles={["client"]}  element={<ClientProfailLayout/>} />}>
                       <Route index element={<ClientProfile/>}/>
                       <Route path="profile" element={<ClientProfile/>}/>
                       <Route path="bookings" element={<ClientBookings/>}/>
                       <Route path="wallet" element={<ClientWallet/>}/>
                       <Route path="my-tickets" element={<MyTickets/>}/>
                       <Route path="chat/:receiverId" element={<ClientChatPage/>} />
                       <Route path="chat" element={<ClientChatPage/>} />
                     </Route>
          

        </Routes>
            
           
            
        
     )
}