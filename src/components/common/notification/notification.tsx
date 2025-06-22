"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCheck, X, Bell, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGetClientNotificationsMutation, useMarkNotificationAsReadMutation } from "@/hooks/ClientCustomHooks"

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

// Get notification color based on title
const getNotificationColor = (title: string) => {
  switch (title) {
    case "service_booking":
      return "bg-blue-50 border-l-blue-500"
    case "payment_received":
      return "bg-green-50 border-l-green-500"
    case "order_confirmed":
      return "bg-purple-50 border-l-purple-500"
    case "customer_message":
      return "bg-orange-50 border-l-orange-500"
    default:
      return "bg-gray-50 border-l-gray-500"
  }
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const notificationMutation = useGetClientNotificationsMutation()
  const markNotificationAsReadMutation = useMarkNotificationAsReadMutation()

  useEffect(() => {
    notificationMutation.mutate(
      undefined,
      {
        onSuccess: (data) => {
          setNotifications(data.items)
          console.log("Notifications:", data)
        },
        onError: (err: any) => {
          console.error("Failed to fetch notifications:", err)
        }
      }
    )
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

    markNotificationAsReadMutation.mutate(
      undefined,
      {
        onSuccess: (data) => {
          // setNotifications(data.items)
          console.log("Notifications:", data)
        },
        onError: (err: any) => {
          console.error("Failed to fetch notifications:", err)
        }
      }
    )
  }

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full hover:bg-slate-100">
          <Bell className="h-4 w-4 text-slate-600" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 shadow-lg" align="end" sideOffset={6}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-600" />
            <h4 className="font-medium text-sm text-slate-900">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 px-2 text-xs hover:bg-white">
              <CheckCheck className="w-3 h-3 mr-1" />
              Read All
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-72">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No notifications</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification, index) => (
                <div
                  key={`${notification.userId}-${index}`}
                  className={cn(
                    "flex items-start gap-2 p-3 m-1 rounded-md border-l-2 transition-all hover:shadow-sm group",
                    getNotificationColor(notification.title),
                    notification.isRead && "opacity-60",
                  )}
                >
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h5
                        className={cn(
                          "text-sm font-medium truncate",
                          notification.isRead ? "text-slate-600" : "text-slate-900",
                        )}
                      >
                        {formatTitle(notification.title)}
                      </h5>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{notification.userId.split("-")[1]}...</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(index)}
                        className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 bg-slate-50 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs text-slate-600 hover:bg-white"
              onClick={() => setIsOpen(false)}
            >
              View All
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
