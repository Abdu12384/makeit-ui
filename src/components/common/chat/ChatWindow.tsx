
"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import type { Socket } from "socket.io-client"
import type { Message } from "@/types/chat"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Smile, Paperclip, Mic, ImageIcon, MoreVertical, ArrowLeft, CheckCheck, Check } from "lucide-react"

interface ChatWindowProps {
  chatId: string
  userId: string
  userModel: "client" | "vendor"
  socket: Socket
  onBackClick?: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, userId, userModel, socket, onBackClick }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatInfo, setChatInfo] = useState<{ name: string; avatar?: string; status?: string }>({
    name: "Chat",
    status: "Online",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAttachMenu, setShowAttachMenu] = useState(false)

  console.log('chatInfo', chatInfo)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    socket.emit("join-room", { roomId: chatId, userId }, (response: any) => {
      if (response.status !== "success") {
        setError(response.message)
      }

      socket.emit("get-chats", { userId }, (response: any) => {
        if (response.status === "success") {
          const chat = response.data.find((c: any) => c.chatId === chatId);
          if (chat) {
            const receiverId = chat.senderId === userId ? chat.receiverId : chat.senderId;
            setChatInfo({
              name: chat.receiverName || receiverId,
              avatar: chat.receiverProfileImage || undefined,
              status: "Offline",
            });
          } else {
            setError("Chat not found");
          }
        } else {
          setError(response.message);
        }
      });
    })

    setLoading(true)
    socket.emit("get-messages", { chatId }, (response: any) => {
      setLoading(false)
      if (response.status === "success") {
        console.log("Messages fetched:", response.data)
        setMessages(response.data)

        // Get chat info (this is a placeholder - you would need to implement this)
        if (response.data.length > 0) {
          const otherUser =
            response.data[0].senderId === userId ? response.data[0].receiverId : response.data[0].senderId
          setChatInfo({
            name: otherUser,
            status: "Online",
          })
        }
      } else {
        setError(response.message)
      }
    })


  

    socket.on("receive-message", (data: Message) => {
      setMessages((prev) => [...prev, data])
      scrollToBottom()
    })

    socket.on("typing", ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
      setIsTyping(isTyping && senderId !== userId)
    })

    socket.on("user-joined", () => {
      socket.emit("get-messages", { chatId }, (response: any) => {
        if (response.status === "success") {
          setMessages(response.data)
          scrollToBottom()
        }
      })
    })

    scrollToBottom()

    return () => {
      socket.off("receive-message")
      socket.off("typing")
      socket.off("user-joined")
    }
  }, [chatId, userId, socket])

  const sendMessage = () => {
    if (!message.trim()) return

    socket.emit("send-message", { chatId, message, senderId: userId, senderModel: userModel }, (response: any) => {
      if (response.status === "success") {
        setMessage("")
        messageInputRef.current?.focus()
      } else {
        setError(response.message)
      }
    })
  }

  const handleTyping = (isTyping: boolean) => {
    socket.emit("typing", { chatId, senderId: userId, isTyping })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const date = getMessageDate(msg.sendedTime)
    const lastGroup = groupedMessages[groupedMessages.length - 1]

    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg)
    } else {
      groupedMessages.push({ date, messages: [msg] })
    }
  })

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="md:hidden">
            <button
              onClick={() => {
                if (onBackClick) {
                  onBackClick()
                } else {
                  window.history.back()
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium">
            {chatInfo?.avatar ? (
              <img
                src={chatInfo.avatar}
                alt={chatInfo.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium">
                {chatInfo?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{chatInfo?.name}</h3>
            <div className="flex items-center gap-1">
              {/* <span className="w-2 h-2 rounded-full bg-green-500"></span> */}
              {/* <span className="text-xs text-gray-500">{chatInfo?.status}</span> */}
            </div>
          </div>
        </div>
        <div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f5f5f5] bg-opacity-50 chat-bg bg-repeat">
        {loading ? (
          <div className="flex justify-center py-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
            ></motion.div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date} className="mb-6">
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">{group.date}</span>
              </div>
              {group.messages.map((msg, index) => {
                const isMine = msg.senderId === userId
                const showAvatar = index === 0 || group.messages[index - 1]?.senderId !== msg.senderId

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex ${isMine ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}>
                      {!isMine && showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center text-xs text-white">
                          {msg.senderId.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl ${
                          isMine
                            ? "bg-purple-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.messageContent}</p>
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-xs ${isMine ? "text-purple-200" : "text-gray-500"}`}
                        >
                          <span>{formatTime(msg.sendedTime)}</span>
                          {isMine &&
                            (msg.seen ? <CheckCheck size={12} className="text-blue-400" /> : <Check size={12} />)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 text-gray-500 text-sm bg-white"
          >
            <div className="flex items-center gap-2">
                <span>typing</span>
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.15 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                ></motion.div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.3 }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 bg-white border-t border-gray-100"
      >
        <div className="relative flex items-center gap-2">
          <div className="flex">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Smile size={22} className="text-gray-500" />
            </motion.button>
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Paperclip size={22} className="text-gray-500" />
              </motion.button>
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-purple-100 rounded-full"
                    >
                      <ImageIcon size={18} className="text-purple-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-green-100 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <input
            ref={messageInputRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              handleTyping(true)
            }}
            onBlur={() => handleTyping(false)}
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage()
            }}
            placeholder="Type a message..."
            className="flex-1 py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
          {message.trim() ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={sendMessage}
              className="p-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors"
            >
              <Send size={18} />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors"
            >
              <Mic size={18} />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ChatWindow
