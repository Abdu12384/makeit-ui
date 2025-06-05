import { CategoryManagement } from "@/components/admin/mangement/CategoryManagement"
import { Dashboard } from "@/components/admin/dashboard/Dashboard"
import { AdminLoginPage } from "@/components/admin/login/Login"
import { AdminLayout } from "@/pages/admin/admin-home"
import { AdminVendorApplicationPage } from "@/pages/admin/applications/AdminVendorApplicationPage"
import { AdminClientManagementPage } from "@/pages/admin/managementPage/AdminClientManagenemtPage"
import { AdminVendorManagementPage } from "@/pages/admin/managementPage/AdminVendorManagementPage"
import { ProtectedRoute } from "@/utils/protected/ProtectedRoute"
import { NoAuthRoute } from "@/utils/protected/PublicRoute"
import { Routes, Route } from "react-router-dom"
import AdminWallet from "@/components/admin/wallet/AdminWallet"
import AdminEventsPage from "@/pages/admin/managementPage/AdminEventManagement"
import AdminBookingsPage from "@/pages/admin/managementPage/AdminBookingManagement"
import AdminDashboard from "@/pages/admin/managementPage/AdminDashboard"




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