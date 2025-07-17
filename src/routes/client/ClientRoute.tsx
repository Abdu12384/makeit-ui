
import NotFound404 from "@/components/common/404Page/PageNotFound"
import { lazyWithFallback } from "@/utils/lazyLoading/ReactLasyLoading"
import { Routes, Route } from "react-router-dom"

const LoginComponent =  lazyWithFallback(() => import("@/components/client/login/Login"))
const ClientBookings =  lazyWithFallback(() => import("@/components/client/profail/bookings"))
const ClientProfile = lazyWithFallback(() => import("@/components/client/profail/ClientProfail"))
const SignupComponent = lazyWithFallback(() => import("@/components/client/signup/Signup"))
const ClientWallet = lazyWithFallback(() => import("@/components/client/wallet/ClientWallet"))
const TicketPaymentForm = lazyWithFallback(() => import("@/components/client/paymentForm/TicketPayment"))
const EventDetailsPage = lazyWithFallback(() => import("@/pages/client/event-details-page"))
const EventsPage = lazyWithFallback(() => import("@/pages/client/event-page"))
const ClientHome = lazyWithFallback(() => import("@/pages/client/home-page"))
const ClientProfailLayout = lazyWithFallback(() => import("@/pages/client/profail-page"))
const BookingPage = lazyWithFallback(() => import("@/pages/client/service-details-page"))
const ServiceListings = lazyWithFallback(() => import("@/pages/client/service-listing-page"))
const ProtectedRoute = lazyWithFallback(() => import("@/utils/protected/ProtectedRoute"))
const NoAuthRoute = lazyWithFallback(() => import("@/utils/protected/PublicRoute"))
const MyTickets = lazyWithFallback(() => import("@/components/client/event/ticket/BookedTickets"))
const ForgotPasswordEmail = lazyWithFallback(() => import("@/components/common/ForgotPassword/ForgotPassword"))
const ResetPassword = lazyWithFallback(() => import("@/components/common/ForgotPassword/ResetPassword"))
const ClientChatPage = lazyWithFallback(() => import("@/pages/client/chat-page-client"))
const BookingPayment = lazyWithFallback(() => import("@/components/client/profail/BookingPayment"))
const NearbyEventsPage = lazyWithFallback(() => import("@/components/client/event/LocactionBasedEvents"))



 export const ClientRoutes = () =>{
     return (
        <Routes> 
          <Route path="/" element={<ClientHome/>}/>
           
          <Route path="/signup" element={<NoAuthRoute element={<SignupComponent />} />} />
          <Route path="/login" element={<NoAuthRoute element={<LoginComponent />} />} />
          <Route path="/forgot-password" element={<NoAuthRoute element={<ForgotPasswordEmail userType="client" />} />} />
          <Route path="/reset-password" element={<NoAuthRoute element={<ResetPassword userType="client" />} />} />




            <Route path="/services" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<ServiceListings />} />
                       } />
            <Route path="/services/details/:id" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<BookingPage />} />
                       } />


            <Route path="/events" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<EventsPage />} />
                       } />
            <Route path="/events/nearby" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<NearbyEventsPage />} />
                       } />

            <Route path="/events/details/:eventId" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<EventDetailsPage />} />
                       } />

            <Route path="/ticket-payment" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<TicketPaymentForm />} />
                       } />

            <Route path="/booking-payment" element={
                       <ProtectedRoute allowedRoles={["client"]} element={<BookingPayment />} />
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
          
                     <Route path="*" element={<NotFound404 />} />

           </Routes>
            
           
            
        
     )
}