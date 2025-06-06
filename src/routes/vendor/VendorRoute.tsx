
import ForgotPasswordEmail from "@/components/common/ForgotPassword/ForgotPassword"
import ResetPassword from "@/components/common/ForgotPassword/ResetPassword"
import { AttendeesList } from "@/components/vendor/booked-events/AttendeesInfo"
import { BookedEventsList } from "@/components/vendor/booked-events/BookedEventList"
import BookingList from "@/components/vendor/bookings/VendorBookingList"
import CreateEventPage from "@/components/vendor/events/CreateEvents"
import EditEventPage from "@/components/vendor/events/EditEvents"
import  {  VendorLoginPage } from "@/components/vendor/login/Login"
import { ServiceListingPage } from "@/components/vendor/service/ServiceComponent"
import { SignupPage } from "@/components/vendor/signup/Signup"
import {VendorDashboard} from "@/components/vendor/vendor-dashboard/VendorDashboard"
import {ProfileForm} from "@/components/vendor/vendorProfile/VendorProfileForm"
import VendorWallet from "@/components/vendor/wallet/VendorWallet"
import VendorChatPage from "@/pages/vendor/chat-page-vendor"
import VendorHomePage from "@/pages/vendor/home-page-vendor"
import VendorEventsPage from "@/pages/vendor/VendorEventPage"
import { VendorProfilePage } from "@/pages/vendor/VendorProfilePage"
import WorkSamplePage from "@/pages/vendor/WorkSamplePage"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Routes, Route } from "react-router-dom"


export const VendorRoute = () =>{

      return(
        <Routes>


          <Route path="/login" element={<NoAuthRoute element={<VendorLoginPage />} />} />
          <Route path="/signup" element={<NoAuthRoute element={<SignupPage />} />} />
          <Route path="/forgot-password" element={<NoAuthRoute element={<ForgotPasswordEmail userType="vendor" />} />} />
          <Route path="/reset-password/:token" element={<NoAuthRoute element={<ResetPassword userType="vendor" />} />} />

          
           {/* ProtectRoute */}
            {/* <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["vendor"]} element={<VendorProfile />} />
             } />          */}

            <Route path="/home" element={
            <ProtectedRoute allowedRoles={["vendor"]} element={<VendorHomePage />} />
            } />

          <Route path="/" element={ 
            <ProtectedRoute  allowedRoles={["vendor"]}  element={<VendorProfilePage/>} />}>
             <Route index element={<ProfileForm/>}/>
              <Route path="/profile" element={<ProfileForm />} />
              <Route path="/dashboard" element={<VendorDashboard />} />
              <Route path="/services" element={<ServiceListingPage />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/events" element={<VendorEventsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/events/edit/:id" element={<EditEventPage />} />
              <Route path="/booked-events" element={<BookedEventsList />} />
              <Route path="/events/attendees/:eventId" element={<AttendeesList />} />
              <Route path="/work-sample" element={<WorkSamplePage />} />
              <Route path="/wallet" element={<VendorWallet />} />
              <Route path="/chat" element={<VendorChatPage/>} />
              <Route path="/chat/:receiverId" element={<VendorChatPage/>} />
           </Route>
        </Routes>
      )
}
