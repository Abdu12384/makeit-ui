"use client"

import { motion } from "framer-motion"
import { Clock, DollarSign, Calendar, Award, MoreVertical, Edit } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useBlockServiceMutation } from "@/hooks/VendorCustomHooks"
import toast from "react-hot-toast"
import { IService } from "@/types/service"

interface ServiceCardProps {
  service: IService
  onEdit: () => void
  onDelete: () => void
  setService: React.Dispatch<React.SetStateAction<IService[]>>
}

export const ServiceCard = ({ service, onEdit,setService }: ServiceCardProps) => {

  const blockService = useBlockServiceMutation()
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
      },
    },
  }

  const handleBlockService = (serviceId: string) => {
    blockService.mutate(
      serviceId,
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setService((prevService) =>
            prevService.map((service) =>
              service.serviceId === serviceId ? { ...service, status: data.status } : service
            )
          );
        },
        onError: (error) => {
          toast.error(error.message);
        }
      }
    );
  };


  return (
    <motion.div variants={cardVariants} whileHover="hover" layout>
        <div className="relative h-full">
        {!service.status || service.status !== "active" && (
      <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
        <div className="bg-red-600 text-white px-4 py-1 rounded shadow font-semibold">
          Blocked
        </div>
      </div>
    )}

      <Card className="h-full overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 h-2.5 w-full"></div>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1.5 line-clamp-1">{service.serviceTitle}</h3>
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                >
                  {/* {service?.category?.title} */}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 z-20 rounded-full hover:bg-purple-50">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBlockService(service.serviceId!)}
                    className={service.status === "active" ? "text-red-600 hover:bg-red-50 cursor-pointer" : "text-green-600 hover:bg-green-50 cursor-pointer"}
                  >
                   {service.status === "active" ? "Block Service" : "Unblock Service"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-gray-600 mt-3.5 line-clamp-2 text-sm leading-relaxed">{service.serviceDescription}</p>

            <div className="mt-5 space-y-2.5 pt-3 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 mr-3">
                  <Award className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <span className="font-medium">{service.yearsOfExperience} years of experience</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 mr-3">
                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <span className="font-medium">{service.serviceDuration} hours duration</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 mr-3">
                  <DollarSign className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <span className="font-medium">₹{service.servicePrice}/hour</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3.5 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600 w-full">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 mr-3">
              <Calendar className="h-3.5 w-3.5 text-purple-600" />
            </div>
            <span className="font-medium">Schedule a session</span>
          </div>
        </CardFooter>
      </Card>
      </div>
    </motion.div>
  )
}
