import Banner from "@/components/client/homepage/banner"
import Services from "@/components/client/homepage/services"
import Events from "@/components/client/homepage/events"
import Features from "@/components/client/homepage/fetures"
import Footer from "@/components/client/homepage/footer"

export default function ClientHome() {
  return (
    <main className="min-h-screen bg-white">
      <Banner />
      <Services />
      <Events />
      <Features />
      <Footer />
    </main>
  )
}
