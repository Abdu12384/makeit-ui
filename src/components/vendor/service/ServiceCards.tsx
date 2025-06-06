// import { motion } from "framer-motion"
// import { Clock, DollarSign, Calendar, Award, MoreVertical, Edit, Trash2 } from "lucide-react"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// interface ServiceCardProps {
//   service: {
//     _id: string
//     serviceTitle: string
//     serviceCategory: string
//     yearsOfExperience: number
//     servicePrice: number
//     serviceDuration: number
//     serviceDescription: string
//   }
//   onEdit: () => void
//   onDelete: () => void
// }

// export const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.5,
//       },
//     },
//     hover: {
//       y: -5,
//       boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//       transition: {
//         duration: 0.3,
//       },
//     },
//   }

//   return (
//     <motion.div variants={cardVariants} whileHover="hover" layout>
//       <Card className="h-full overflow-hidden border-gray-200">
//         <CardContent className="p-0">
//           <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3"></div>
//           <div className="p-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h3 className="font-bold text-lg text-gray-900 mb-1">{service.serviceTitle}</h3>
//                 <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
//                   {service.serviceCategory}
//                 </Badge>
//               </div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="h-8 w-8">
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
//                     <Edit className="mr-2 h-4 w-4" /> Edit
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600">
//                     <Trash2 className="mr-2 h-4 w-4" /> Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>

//             <p className="text-gray-600 mt-3 line-clamp-2">{service.serviceDescription}</p>

//             <div className="mt-4 space-y-2">
//               <div className="flex items-center text-sm text-gray-600">
//                 <Award className="h-4 w-4 mr-2 text-indigo-500" />
//                 <span>{service.yearsOfExperience} years of experience</span>
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Clock className="h-4 w-4 mr-2 text-indigo-500" />
//                 <span>{service.serviceDuration} hours duration</span>
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <DollarSign className="h-4 w-4 mr-2 text-indigo-500" />
//                 <span>₹{service.servicePrice}/hour</span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200">
//           <div className="flex items-center text-sm text-gray-600 w-full">
//             <Calendar className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
//             {/* <span className="truncate">
//               {service.availableDates.length > 0
//                 ? `Available: ${new Date(service.availableDates[0]).toLocaleDateString()}`
//                 : "No available dates"}
//             </span> */}
//           </div>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   )
// }






"use client"

import { motion } from "framer-motion"
import { Clock, DollarSign, Calendar, Award, MoreVertical, Edit } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ServiceCardProps {
  service: {
    _id: string
    serviceTitle: string
    serviceCategory: string
    yearsOfExperience: number
    servicePrice: number
    serviceDuration: number
    serviceDescription: string
  }
  onEdit: () => void
  onDelete: () => void
}

export const ServiceCard = ({ service, onEdit }: ServiceCardProps) => {
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

  return (
    <motion.div variants={cardVariants} whileHover="hover" layout>
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
                  {service.serviceCategory}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-purple-50">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4 text-purple-500" /> Edit
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
    </motion.div>
  )
}
