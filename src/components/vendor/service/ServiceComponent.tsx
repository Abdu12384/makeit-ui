import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServiceAddForm } from "./ServiceForm"
import { ServiceCard } from "./ServiceCards"
import { useGetAllServicesByVendorIdMutation } from "@/hooks/VendorCustomHooks"
import { Pagination1 } from "@/components/common/paginations/Pagination"

export const ServiceListingPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"serviceTitle" | "servicePrice" | "serviceCategory" | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [allServices, setAllServices] = useState<any>([])
  const [serviceToEdit, setServiceToEdit] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEdit, setIsEdit] = useState(false);
  const [totalPages, setTotalPages] = useState(1)
  const [limit, setLimit] = useState(6)


  const getAllServicesByVendorId = useGetAllServicesByVendorIdMutation()

 
  const getAllServices = () =>   getAllServicesByVendorId.mutate(  
      {
        page: currentPage,
        limit,
        search: searchQuery,
        sortOrder: sortOrder
      },
      {
        onSuccess: (response) => {
          console.log("Fetched services:", response.services);
          setAllServices(response.services.services)
          setTotalPages(response.services.total||1)
        },
        onError: (error) => {
          console.log("Error fetching services:", error);
        },
      }
    );

    useEffect(() => {
      getAllServices()
   }, [currentPage]);


  const handleAddService = (newService: any) => {
    setAllServices([...allServices, { ...newService, id: (allServices.length + 1).toString() }])
    setIsFormOpen(false)
  }

  const handleDeleteService = (id: string) => {
    setAllServices(allServices.filter((service:any) => service._id !== id))
  }

  const handleEditService = (id: string) => {
    const service = allServices.find((service:any) => service._id === id)
    setServiceToEdit(service) 
    setIsEdit(true)
    setIsFormOpen(true) 
  }


  const handleFormClose = () => {
    setIsFormOpen(false)
    setServiceToEdit(null)
    setIsEdit(false)
  }

  const toggleSort = (field: "serviceTitle" | "servicePrice" | "serviceCategory") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const filteredServices = allServices.filter(
    (service:any) =>
      service.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (!sortBy) return 0

    if (sortBy === "serviceTitle") {
      return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    }

    if (sortBy === "servicePrice") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price
    }

    if (sortBy === "serviceCategory") {
      return sortOrder === "asc" ? a.experience - b.experience : b.experience - a.experience
    }

    return 0
  })

  console.log("sortedServices", sortedServices)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">Browse and manage your service offerings</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Service
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 mb-6"
      >
        
      
      </motion.div>

      {sortedServices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No services found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
          <Button onClick={() => setIsFormOpen(true)}>Add Your First Service</Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={() => handleEditService(service._id)}
              onDelete={() => handleDeleteService(service._id)}
            />
          ))}
        
        </motion.div>
      )}

      <AnimatePresence>
        {isFormOpen && <ServiceAddForm onClose={() => setIsFormOpen(false)} onSubmit={handleAddService} />}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <ServiceAddForm 
            onClose={handleFormClose} 
            // onSubmit={handleEditService} 
            initialData={serviceToEdit} 
            refetchServices={() => getAllServices()}
            isEdit={isEdit}
          />
        )}
      </AnimatePresence>
      <Pagination1
            currentPage={currentPage}
            totalPages={totalPages}
            onPageNext={() => setCurrentPage(currentPage + 1)}
						onPagePrev={() => setCurrentPage(currentPage - 1)}
          />
    </div>
  )
}
