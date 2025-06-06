import { useState, useEffect } from "react"
import { Header } from "@/components/vendor/vendor-homePage-component/header"
import { BannerCarousel } from "@/components/vendor/vendor-homePage-component/banner"
import { Sidebar } from "@/components/vendor/vendor-homePage-component/sidebar"
import { Footer } from "@/components/vendor/vendor-homePage-component/footer"
import image1 from "@/assets/images/event.avif"
import image2 from "@/assets/images/vendorhomebanner.avif"
import image3 from "@/assets/images/grow bussiness.webp"
import { VendorDashboard } from "@/components/vendor/vendor-dashboard/VendorDashboard"

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




// const notifications = [
//   { id: 1, message: "New booking request for Corporate Summit", time: "2 hours ago", isNew: true },
//   { id: 2, message: "Payment received for Wedding Expo", time: "Yesterday", isNew: true },
//   { id: 3, message: "Client message: Need to discuss catering options", time: "2 days ago", isNew: false },
//   { id: 4, message: "Reminder: Update your availability calendar", time: "3 days ago", isNew: false },
// ]

const VendorHomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  // const [activeNotifications, setActiveNotifications] = useState(2)
  const [isLiveIndicatorVisible, setIsLiveIndicatorVisible] = useState(true)

  // Update time every minute to simulate real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Simulate real-time notifications
    const notificationTimer = setInterval(() => {
      // Randomly toggle the live indicator to simulate activity
      setIsLiveIndicatorVisible((prev) => !prev)
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(notificationTimer)
    }
  }, [])

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
