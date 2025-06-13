"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  Star,
  ChevronRight,
  Search,
  Filter,
  IndianRupee,
  AlertCircle,
  Briefcase,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClientGetAllServicesMutation } from "@/hooks/ClientCustomHooks"
import Navbar from "@/components/common/NavBar"
import { Pagination1 } from "@/components/common/paginations/Pagination"
import { containerVariants, itemVariants } from "@/animations/variants"

interface Service {
  _id: string
  serviceTitle: string
  serviceDescription: string
  servicePrice: number
  serviceDuration: string
  yearsOfExperience: number
  additionalHourFee: number
  cancellationPolicy: string
  termsAndCondition: string
  imageUrl: string
  rating: number
  reviewCount: number
  serviceId: string
  category: {
    _id: string
    title: string
    image: string
  }
}

export const ServiceListings = () => {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 6
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [totalPages, setTotalPages] = useState(0)

  const clientGetAllServicesMutationn = useClientGetAllServicesMutation()
  useEffect(() => {
      clientGetAllServicesMutationn.mutate(
        {
          page: currentPage,
          limit,
          search: searchTerm,
        },
        {
          onSuccess: (response) => {
            setServices(response.services.services)
            setCategories(response.services.services.map((service: any) => service.category.title))
            setTotalPages(response.services.total)
            setIsLoading(false)
          },
          onError: (error) => {
            console.log(error)
            setIsLoading(false)
          },
        },
      )
  }, [currentPage, limit])


  useEffect(() => {
    let filtered = [...services]

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.serviceTitle.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          service.serviceDescription.toLowerCase().startsWith(searchTerm.toLowerCase()),
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((service) => service.category.title === selectedCategory)
    }

    setFilteredServices(filtered)
  }, [searchTerm, selectedCategory, services])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("All")
  }

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-4 py-12 mt-[80px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Professional Services</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Browse through our curated selection of top-rated professional services tailored to meet your needs.
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Desktop Filter Dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={18} />
                    Filter by Category
                    <ChevronDown size={16} className="ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        className={selectedCategory === category ? "bg-blue-50 text-blue-600" : ""}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                        {selectedCategory === category && (
                          <span className="ml-auto">
                            <Sparkles size={16} className="text-blue-500" />
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} className="ml-1" />
            </Button>

            {/* Active Filter Display */}
            {selectedCategory !== "All" && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100">
                {selectedCategory}
                <X size={14} className="ml-1 cursor-pointer" onClick={() => setSelectedCategory("All")} />
              </Badge>
            )}

            {/* Clear Filters Button (only show when filters are active) */}
            {(searchTerm || selectedCategory !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white mt-2 rounded-xl shadow-md border border-gray-100"
            >
              <div className="p-4">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowMobileFilters(false)
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Service Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-lg">
              <Skeleton className="h-48 w-full rounded-t-xl" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between">
                  <Skeleton className="h-10 w-1/3" />
                  <Skeleton className="h-10 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.length > 0 ? (
            filteredServices?.map((service) => (
              <motion.div
                key={service?._id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                  <img
                      src={service.category.image}
                      alt={service.category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-500 hover:bg-blue-600">{service.category.title}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-semibold">{service.rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({service.reviewCount})</span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {service?.serviceTitle}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service?.serviceDescription}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm">{service?.serviceDuration}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm">{service?.yearsOfExperience} yrs exp</span>
                      </div>
                    </div>

                    <div className="flex items-start text-gray-600 mb-2">
                      <AlertCircle className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs line-clamp-1">{service.cancellationPolicy}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <IndianRupee className="h-5 w-5 text-blue-600" />
                        <span className="text-xl font-bold text-blue-600">
                          ₹{service?.servicePrice.toLocaleString()}
                        </span>
                      </div>
                      <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
                        <Link to={`/services/details/${service?.serviceId}`} className="flex items-center">
                          Book Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-16">
              <div className="text-gray-500 text-lg">No services found matching your criteria</div>
              <Button onClick={handleClearFilters} className="mt-4">
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
      <Pagination1
        totalPages={totalPages}
        currentPage={currentPage}
        onPagePrev={() => setCurrentPage(currentPage - 1)}
        onPageNext={() => setCurrentPage(currentPage + 1)}
      />
    </div>
    </>
  )
}
export default ServiceListings