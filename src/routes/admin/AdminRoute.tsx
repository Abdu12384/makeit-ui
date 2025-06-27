import { lazyWithFallback } from "@/utils/lazyLoading/ReactLasyLoading"
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "@/utils/protected/ProtectedRoute"
import NoAuthRoute from "@/utils/protected/PublicRoute"

const CategoryManagement = lazyWithFallback(() => import("@/components/admin/mangement/CategoryManagement"))
import { AdminLoginPage } from "@/components/admin/login/Login"
const AdminLayout = lazyWithFallback(() => import("@/pages/admin/admin-home"))
const  AdminVendorApplicationPage = lazyWithFallback(() => import("@/pages/admin/applications/AdminVendorApplicationPage"))
const AdminClientManagementPage = lazyWithFallback(() => import("@/pages/admin/managementPage/AdminClientManagenemtPage"))
const AdminVendorManagementPage = lazyWithFallback(() => import("@/pages/admin/managementPage/AdminVendorManagementPage"))
const AdminWallet = lazyWithFallback(() => import("@/components/admin/wallet/AdminWallet"))
const AdminEventsPage =  lazyWithFallback(() => import("@/pages/admin/managementPage/AdminEventManagement")) 
const AdminBookingsPage = lazyWithFallback(() => import("@/pages/admin/managementPage/AdminBookingManagement"))
const AdminDashboard = lazyWithFallback(() => import("@/pages/admin/managementPage/AdminDashboard"))




export const  AdminRoutes = () =>{
   
  return (
     <Routes> 
       <Route path="/login" element={<NoAuthRoute element={<AdminLoginPage/>} />}/>
            
            <Route path="/" element={ 
            <ProtectedRoute  allowedRoles={["admin"]}  element={<AdminLayout/>} />}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminClientManagementPage />} />
            <Route path="vendors" element={<AdminVendorManagementPage />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="application" element={<AdminVendorApplicationPage/>}/>
            <Route path="wallet" element={<AdminWallet/>}/>
            <Route path="bookings" element={<AdminBookingsPage/>}/>
            <Route path="events" element={<AdminEventsPage/>}/>
           </Route>

     </Routes>
         
  )
}