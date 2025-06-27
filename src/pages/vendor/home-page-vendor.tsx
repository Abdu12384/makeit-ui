import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/vendor/vendor-homePage-component/header"
import { BannerCarousel } from "@/components/vendor/vendor-homePage-component/banner"
import { Sidebar } from "@/components/vendor/vendor-homePage-component/sidebar"
import { Footer } from "@/components/vendor/vendor-homePage-component/footer"
import image1 from "@/assets/images/event.avif"
import image2 from "@/assets/images/vendorhomebanner.avif"
import image3 from "@/assets/images/grow bussiness.webp"
import VendorDashboard from "@/components/vendor/vendor-dashboard/VendorDashboard"
import { useSaveVendorFCMTokenMutation } from "@/hooks/VendorCustomHooks"
import { listenForForegroundMessages, requestNotificationPermission } from "@/services/firebase/messaging"

// Import components

// Sample data
const bannerImages = [
  {
    id: 1,
    url: image2,
    title: "Premium Event Services",
    subtitle: "Create unforgettable experiences",
  },
  {
    id: 2,
    url: image1,
    title: "Seamless Event Management",
    subtitle: "From planning to execution",
  },
  {
    id: 3,
    url: image3,
    title: "Grow Your Business",
    subtitle: "Connect with more clients",
  },
]






const VendorHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, _setCurrentTime] = useState(new Date())
  const [isLiveIndicatorVisible, _setIsLiveIndicatorVisible] = useState(true)

  const {mutate:saveVendorFCMToken} = useSaveVendorFCMTokenMutation()
 

    const setupFCM = useCallback(async () => {
      try {
        if (Notification.permission === 'denied') {
          console.log('Notifications are blocked by user');
          return;
        }
    
        const cachedToken = localStorage.getItem("fcmToken");
        const token = await requestNotificationPermission();
    
        if (token && token !== cachedToken) {
          saveVendorFCMToken(token, {
            onSuccess: () => {
              localStorage.setItem("fcmToken", token);
            },
            onError: (err: any) => {
              console.error("Failed to save token:", err);
            },
          });
        }
        listenForForegroundMessages();
      } catch (error) {
        console.error('FCM setup error:', error);
      }
    }, [saveVendorFCMToken]);
    
    useEffect(() => {
      setupFCM();
    }, [setupFCM]);





  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 relative overflow-x-hidden">
      <Header
        currentTime={currentTime}
        isLiveIndicatorVisible={isLiveIndicatorVisible}
        // activeNotifications={activeNotifications}
        openSidebar={() => setIsSidebarOpen(true)}
      />

      <main className="container mx-auto px-4 py-8">
        <BannerCarousel images={bannerImages} />

        {/* <ServicesSection services={services} /> */}


        <VendorDashboard/>


        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CalendarSection />
          <NotificationsSection notifications={notifications} />
        </div> */}
      </main>

      <Footer />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}

export default VendorHomePage
