import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"




export const ServiceNF = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Service not found</h2>
      <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
      <Link to="/services">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Back to Services
        </button>
      </Link>
    </div>
  )
}



export const EventNF = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#D3D9D4]/10 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-bold text-[#212A31] mb-4">Event Not Found</h2>
        <p className="text-[#748D92] mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/events")} className="bg-[#124E66] hover:bg-[#124E66]/90">
          Back to Events
        </Button>
      </div>
    </div>
  );
}