"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useGetVendorBookedDates } from "@/hooks/VendorCustomHooks"

interface BookedDate {
  date: string // Format: "YYYY-MM-DD"
  bookingCount: number
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isBooked: boolean
  bookingCount: number
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


interface SimpleBookingCalendarProps {
  onClose?: () => void
}

export default function SimpleBookingCalendar({ onClose }: SimpleBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
  const getVendorBookedDatesMutation = useGetVendorBookedDates()

  // Generate calendar days
  useEffect(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days: CalendarDay[] = []
    const today = new Date()

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const dateString = date.toLocaleDateString("en-CA")
      const bookedDate = bookedDates.find((bd) => bd.date === dateString)
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isBooked: !!bookedDate,
        bookingCount: bookedDate?.bookingCount || 0,
      })
    }

    setCalendarDays(days)
  }, [currentDate, bookedDates])

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }


  const getVendorBookedDates = () => {
    getVendorBookedDatesMutation.mutate(
     undefined,
     {
      onSuccess: (data) => {
        console.log('dates',data)
        setBookedDates(data.booking.dates.map((date:{date:string; count:number})=>({
          date: date.date,
          bookingCount: date.count
        })))
      },
      onError: (error) => {
        console.log(error)
      }
     }
    )
  }

  useEffect(() => {
    getVendorBookedDates()
  }, [])
 

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="border-0 shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">View your booked appointments</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="h-10 w-10 p-0 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="px-4 h-10 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/20 bg-transparent"
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="h-10 w-10 p-0 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 ml-2 border-red-200 text-red-600 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:text-red-300 bg-transparent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-lg font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={cn(
                  "relative p-4 h-24 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col items-center justify-center",
                  // Base styling
                  day.isCurrentMonth
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-50",
                  // Today styling
                  day.isToday &&
                    "ring-4 ring-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-600",
                  // Booked date styling
                  day.isBooked &&
                    day.isCurrentMonth &&
                    "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-600 shadow-md",
                  // Hover effects
                  day.isCurrentMonth && "hover:scale-105 hover:shadow-xl",
                )}
              >
                {/* Date number */}
                <div
                  className={cn(
                    "text-xl font-bold mb-1",
                    day.isCurrentMonth
                      ? day.isBooked
                        ? "text-green-700 dark:text-green-300"
                        : "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600",
                    day.isToday && "text-blue-600 dark:text-blue-400",
                  )}
                >
                  {day.date.getDate()}
                </div>

                {/* Booked indicator */}
                {day.isBooked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.01 }}
                    className="flex flex-col items-center"
                  >
                    {/* Booking count badge */}
                    <div className="h-6 w-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-white">{day.bookingCount}</span>
                    </div>

                    {/* Booked text */}
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">Booked</span>
                  </motion.div>
                )}

                {/* Today indicator */}
                {day.isToday && !day.isBooked && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Booked Dates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
