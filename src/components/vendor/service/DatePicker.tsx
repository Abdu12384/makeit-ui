"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DatePickerProps {
  selectedDates: string[]
  onDateSelect: (date: string) => void
}

export const DatePicker = ({ selectedDates, onDateSelect }: DatePickerProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isDateSelected = (dateString: string) => {
    return selectedDates.includes(dateString)
  }

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(year, month, day)
    return date < today
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthNames = [
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDateClick = (day: number) => {
    const dateString = formatDateString(year, month, day)
    onDateSelect(dateString)
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDateString(year, month, day)
    const isSelected = isDateSelected(dateString)
    const isTodayDate = isToday(year, month, day)
    const isPast = isPastDate(year, month, day)

    calendarDays.push(
      <button
        key={day}
        type="button"
        disabled={isPast}
        onClick={() => handleDateClick(day)}
        className={`
          h-8 w-8 rounded-full flex items-center justify-center text-sm
          ${isSelected ? "bg-indigo-600 text-white" : ""}
          ${isTodayDate && !isSelected ? "border border-indigo-600 text-indigo-600" : ""}
          ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-200"}
        `}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button type="button" variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {monthNames[month]} {year}
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{calendarDays}</div>
    </div>
  )
}
