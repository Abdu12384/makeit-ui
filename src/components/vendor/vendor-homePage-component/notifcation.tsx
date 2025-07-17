"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCheck, X, Bell, Calendar, User, Sparkles, MessageSquare, CreditCard, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetVendorNotificationsMutation, useMarkVendorNotificationAsReadMutation } from "@/hooks/VendorCustomHooks"

interface Notification {
  _id?: string
  userId: string
  title: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

// Format title to readable text
const formatTitle = (title: string) => {
  return title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Get notification icon based on title
const getNotificationIcon = (title: string) => {
  switch (title) {
    case "service_booking":
      return <Calendar className="w-4 h-4" />
    case "payment_received":
      return <CreditCard className="w-4 h-4" />
    case "order_confirmed":
      return <ShoppingBag className="w-4 h-4" />
    case "customer_message":
      return <MessageSquare className="w-4 h-4" />
    default:
      return <Bell className="w-4 h-4" />
  }
}

// Get notification color based on title
const getNotificationColor = (title: string) => {
  switch (title) {
    case "service_booking":
      return {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
        border: "border-l-blue-500",
        icon: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
        accent: "text-blue-700 dark:text-blue-300",
      }
    case "payment_received":
      return {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
        border: "border-l-green-500",
        icon: "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
        accent: "text-green-700 dark:text-green-300",
      }
    case "order_confirmed":
      return {
        bg: "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20",
        border: "border-l-purple-500",
        icon: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
        accent: "text-purple-700 dark:text-purple-300",
      }
    case "customer_message":
      return {
        bg: "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
        border: "border-l-orange-500",
        icon: "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
        accent: "text-orange-700 dark:text-orange-300",
      }
    default:
      return {
        bg: "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20",
        border: "border-l-gray-500",
        icon: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30",
        accent: "text-gray-700 dark:text-gray-300",
      }
  }
}

export default function VendorNotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const notificationMutation = useGetVendorNotificationsMutation()
  const markNotificationAsReadMutation = useMarkVendorNotificationAsReadMutation()

  useEffect(() => {
    notificationMutation.mutate(undefined, {
      onSuccess: (data) => {
        setNotifications(data.items)
      },
      onError: (err) => {
        console.error("Failed to fetch notifications:", err)
      },
    })
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (index: number) => {
    setNotifications((prev) =>
      prev.map((notification, i) =>
        i === index ? { ...notification, isRead: true, updatedAt: new Date().toISOString() } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    const now = new Date().toISOString()

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
        updatedAt: now,
      })),
    )

    markNotificationAsReadMutation.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Notifications:", data)
      },
      onError: (err) => {
        console.error("Failed to mark notifications as read:", err)
      },
    })
  }

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 dark:from-slate-800 dark:to-slate-900 dark:hover:from-slate-700 dark:hover:to-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold animate-pulse bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white dark:border-slate-800 shadow-lg"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 shadow-2xl border-0 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Stay updated with your business</p>
            </div>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 border-0 font-medium"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 px-3 text-xs hover:bg-white dark:hover:bg-slate-800 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
            >
              <CheckCheck className="w-3 h-3 mr-1.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mb-4">
                <Sparkles className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">All caught up!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">No new notifications to show</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {notifications.map((notification, index) => {
                const colors = getNotificationColor(notification.title)
                return (
                  <div
                    key={`${notification.userId}-${index}`}
                    className={cn(
                      "flex items-start gap-3 p-4 mx-1 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group cursor-pointer",
                      colors.bg,
                      colors.border,
                      notification.isRead && "opacity-70 hover:opacity-90",
                      !notification.isRead && "shadow-sm",
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 shadow-sm",
                        colors.icon,
                      )}
                    >
                      {getNotificationIcon(notification.title)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h5
                          className={cn(
                            "text-sm font-semibold leading-tight",
                            notification.isRead
                              ? "text-slate-600 dark:text-slate-400"
                              : "text-slate-900 dark:text-slate-100",
                          )}
                        >
                          {formatTitle(notification.title)}
                        </h5>
                        {!notification.isRead && (
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 animate-pulse shadow-sm" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate font-medium">{notification.userId.split("-")[1]}...</span>
                        </div>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-medium">{formatTimeAgo(notification.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(index)
                            }}
                            className="h-7 px-2 text-xs hover:bg-green-100 hover:text-green-700 dark:hover:bg-green-900/30 dark:hover:text-green-400 rounded-lg font-medium transition-all duration-200"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(index)
                          }}
                          className="h-7 px-2 text-xs hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg font-medium transition-all duration-200"
                          title="Remove notification"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-9 text-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg font-medium hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
