
import { Routes, Route } from "react-router-dom"
import { lazyWithFallback } from "@/utils/lazyLoading/ReactLasyLoading"

const ForgotPasswordEmail = lazyWithFallback(() => import("@/components/common/ForgotPassword/ForgotPassword"))
const ResetPassword = lazyWithFallback(() => import("@/components/common/ForgotPassword/ResetPassword"))
const AttendeesList = lazyWithFallback(() => import("@/components/vendor/booked-events/AttendeesInfo"))
const BookedEventsList = lazyWithFallback(() => import("@/components/vendor/booked-events/BookedEventList"))
const BookingList = lazyWithFallback(() => import("@/components/vendor/bookings/VendorBookingList"))
const CreateEventPage = lazyWithFallback(() => import("@/components/vendor/events/CreateEvents"))
const EditEventPage = lazyWithFallback(() => import("@/components/vendor/events/EditEvents"))
const VendorLoginPage = lazyWithFallback(() => import("@/components/vendor/login/Login"))
const ServiceListingPage = lazyWithFallback(() => import("@/components/vendor/service/ServiceComponent"))
const SignupPage = lazyWithFallback(() => import("@/components/vendor/signup/Signup"))
const VendorDashboard = lazyWithFallback(() => import("@/components/vendor/vendor-dashboard/VendorDashboard"))
const ProfileForm = lazyWithFallback(() => import("@/components/vendor/vendorProfile/VendorProfileForm"))
const VendorWallet = lazyWithFallback(() => import("@/components/vendor/wallet/VendorWallet"))
const VendorChatPage = lazyWithFallback(() => import("@/pages/vendor/chat-page-vendor"))
const VendorHomePage = lazyWithFallback(() => import("@/pages/vendor/home-page-vendor"))
const VendorEventsPage = lazyWithFallback(() => import("@/pages/vendor/VendorEventPage"))
const VendorProfilePage = lazyWithFallback(() => import("@/pages/vendor/VendorProfilePage"))
const WorkSamplePage = lazyWithFallback(() => import("@/pages/vendor/WorkSamplePage"))
const ProtectedRoute = lazyWithFallback(() => import("@/utils/protected/ProtectedRoute"))
const NoAuthRoute = lazyWithFallback(() => import("@/utils/protected/PublicRoute"))


export const VendorRoute = () =>{

      return(
        <Routes>


          <Route path="/login" element={<NoAuthRoute element={<VendorLoginPage />} />} />
          <Route path="/signup" element={<NoAuthRoute element={<SignupPage />} />} />
          <Route path="/forgot-password" element={<NoAuthRoute element={<ForgotPasswordEmail userType="vendor" />} />} />
          <Route path="/reset-password" element={<NoAuthRoute element={<ResetPassword userType="vendor" />} />} />

          
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
