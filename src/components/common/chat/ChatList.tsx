
// import React, { useEffect, useState } from "react";
// import { Socket } from "socket.io-client";
// import { Chat } from "@/types/chat";

// interface ChatListProps {
//   userId: string;
//   userModel: "client" | "vendor";
//   onSelectChat: (chatId: string) => void;
//   socket: Socket;
//   receiverId: string;
// }

// const ChatList: React.FC<ChatListProps> = ({ userId, userModel, onSelectChat, socket, receiverId }) => {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const receiverModel = userModel === "client" ? "vendor" : "client";
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch chats
//     setLoading(true);
//     socket.emit("get-chats", { userId }, (response: { status: string; data: Chat[] }) => {
//       setLoading(false);
//       if (response.status === "success") {
//         // Sort chats by lastMessageAt (most recent first)
//         const sortedChats = response.data.sort((a, b) => {
//           const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
//           const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
//           return timeB - timeA;
//         });
//         setChats(sortedChats);

//         // Check if a chat with the receiver already exists
//         const existingChat = sortedChats.find(
//           (chat) => chat.senderId === receiverId || chat.receiverId === receiverId
//         );

//         if (existingChat) {
//           // If chat exists, select it
//           onSelectChat(existingChat.chatId);
//           setError(null);
//         } else if (receiverId) {
//           // If no chat exists, create a new one
//           socket.emit(
//             "start-chat",
//             { senderId: userId, senderModel: userModel, receiverId, receiverModel },
//             (startResponse: { status: string; chatId?: string; message?: string }) => {
//               if (startResponse.status === "success" && startResponse.chatId) {
//                 onSelectChat(startResponse.chatId);
//                 socket.emit("get-chats", { userId }, (chatResponse: { status: string; data: Chat[] }) => {
//                   if (chatResponse.status === "success") {
//                     const sortedChatResponse = chatResponse.data.sort((a, b) => {
//                       const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
//                       const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
//                       return timeB - timeA;
//                     });
//                     setChats(sortedChatResponse);
//                   }
//                 });
//                 setError(null);
//               } else {
//                 setError(startResponse.message || "Failed to start chat");
//               }
//             }
//           );
//         }
//       } else {
//         setError(response.message);
//       }
//     });

//     socket.on("notification", () => {
//       socket.emit("get-chats", { userId }, (response: { status: string; data: Chat[] }) => {
//         if (response.status === "success") {
//           // Sort chats by lastMessageAt (most recent first)
//           const sortedChats = response.data.sort((a, b) => {
//             const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
//             const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
//             return timeB - timeA;
//           });
//           setChats(sortedChats);
//         }
//       });
//     });

//     return () => {
//       socket.off("notification");
//     };
//   }, [userId, receiverId, socket, userModel, receiverModel, onSelectChat]);

//   console.log('chat--------------------------------------', chats);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">Your Chats</h2>
//       {loading && <p className="text-gray-500">Loading chats...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       <ul className="space-y-2">
//         {chats.map((chat) => {
//           const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId;
//           const otherUserName = chat.receiverName || otherUserId; // Always use receiverName, fallback to otherUserId
//           const otherUserProfilePicture = chat.receiverProfileImage || undefined; // Always use receiverProfilePicture

//           console.log('chat--------------------------------------', chat.receiverName, otherUserName, chat.receiverProfilePicture);
          
//           return (
//             <li
//               key={chat._id}
//               onClick={() => onSelectChat(chat.chatId)}
//               className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer flex items-center space-x-3 shadow-sm"
//             >
//               {otherUserProfilePicture ? (
//                 <img
//                   src={otherUserProfilePicture}
//                   alt={otherUserName}
//                   className="w-10 h-10 rounded-full"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
//                   <span className="text-gray-600">{otherUserName.charAt(0)}</span>
//                 </div>
//               )}
//               <div className="flex-1">
//                 <span className="text-gray-800">{otherUserName}</span>
//                 <p className="text-gray-500 text-sm">
//                   {chat.lastMessage || "No messages"}
//                 </p>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default ChatList;
import type React from "react"
import { useEffect, useState, useRef } from "react"
import type { Socket } from "socket.io-client"
import type { Chat } from "@/types/chat"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MessageSquare, X } from "lucide-react"

interface ChatListProps {
  userId: string
  userModel: "client" | "vendor"
  onSelectChat: (chatId: string) => void
  socket: Socket
  receiverId: string
}

const ChatList: React.FC<ChatListProps> = ({ userId, userModel, onSelectChat, socket, receiverId }) => {
  const [chats, setChats] = useState<Chat[]>([])
  const receiverModel = userModel === "client" ? "vendor" : "client"
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  
  // Use refs to track chat creation to prevent duplicate requests
  const chatCreationAttempted = useRef<Set<string>>(new Set())
  const initialLoadCompleted = useRef(false)

  const fetchChats = () => {
    setLoading(true)
    socket.emit("get-chats", { userId }, (response: { status: string; data: Chat[]; message?: string }) => {
      setLoading(false)
      if (response.status === "success") {

        const sortedChats = response.data.sort((a, b) => {
          const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
          const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
          return timeB - timeA
        })
        setChats(sortedChats)

        if (!initialLoadCompleted.current && receiverId) {
          initialLoadCompleted.current = true
          
          const existingChat = sortedChats.find((chat) => 
            chat.senderId === receiverId || chat.receiverId === receiverId
          )

          if (existingChat) {
            onSelectChat(existingChat.chatId)
            setSelectedChatId(existingChat.chatId)
            setError(null)
          } else {
            const chatKey = `${userId}-${receiverId}`
            if (!chatCreationAttempted.current.has(chatKey) && !isCreatingChat) {
              chatCreationAttempted.current.add(chatKey)
              createNewChat(receiverId)
            }
          }
        }
      } else {
        setError(response.message || "Failed to fetch chats")
      }
    })
  }

  const createNewChat = (targetReceiverId: string) => {
    if (isCreatingChat) return 
    
    setIsCreatingChat(true)
    setError(null)
    
    socket.emit(
      "start-chat",
      { senderId: userId, senderModel: userModel, receiverId: targetReceiverId, receiverModel },
      (startResponse: { status: string; chatId?: string; message?: string }) => {
        if (startResponse.status === "success" && startResponse.chatId) {
          onSelectChat(startResponse.chatId)
          setSelectedChatId(startResponse.chatId)
          

          socket.emit("get-chats", { userId }, (chatResponse: { status: string; data: Chat[] }) => {
            if (chatResponse.status === "success") {
              const sortedChatResponse = chatResponse.data.sort((a, b) => {
                const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
                const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
                return timeB - timeA
              })
              setChats(sortedChatResponse)
            }
            setIsCreatingChat(false)
          })
        } else {
          setError(startResponse.message || "Failed to start chat")
          setIsCreatingChat(false)
          const chatKey = `${userId}-${targetReceiverId}`
          chatCreationAttempted.current.delete(chatKey)
        }
      }
    )
  }

  useEffect(() => {
    chatCreationAttempted.current.clear()
    initialLoadCompleted.current = false
    
    fetchChats()

    const handleNotification = () => {
      socket.emit("get-chats", { userId }, (response: { status: string; data: Chat[] }) => {
        if (response.status === "success") {
          const sortedChats = response.data.sort((a, b) => {
            const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0
            const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0
            return timeB - timeA
          })
          setChats(sortedChats)
        }
      })
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
    }
  }, [userId, receiverId, socket, userModel, receiverModel, onSelectChat])

  const startChat = (targetReceiverId: string) => {
    if (!targetReceiverId) {
      setError("Receiver ID is required")
      return
    }

    const existingChat = chats.find((chat) => 
      chat.senderId === targetReceiverId || chat.receiverId === targetReceiverId
    )
    
    if (existingChat) {
      onSelectChat(existingChat.chatId)
      setSelectedChatId(existingChat.chatId)
      setShowNewChatModal(false)
      return
    }

    const chatKey = `${userId}-${targetReceiverId}`
    if (chatCreationAttempted.current.has(chatKey) || isCreatingChat) {
      return
    }

    chatCreationAttempted.current.add(chatKey)
    createNewChat(targetReceiverId)
    setShowNewChatModal(false)
  }

  const filteredChats = chats.filter((chat) => {
    const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId
    const otherUserName = chat.receiverName || otherUserId
    return otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const formatTime = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            ></motion.div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">{error}</div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              {isCreatingChat ? "Creating conversation..." : "No conversations yet"}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {isCreatingChat 
                ? "Please wait while we set up your chat" 
                : "Start chatting with vendors to discuss your requirements"
              }
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredChats.map((chat) => {
              const otherUserId = chat.senderId === userId ? chat.receiverId : chat.senderId
              const otherUserName = chat.receiverName || otherUserId
              const otherUserProfilePicture = chat.receiverProfileImage || undefined
              const isSelected = chat.chatId === selectedChatId
              const hasUnread = !chat.seen 

              return (
                <motion.li
                  key={chat._id}
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
                  onClick={() => {
                    onSelectChat(chat.chatId)
                    setSelectedChatId(chat.chatId)
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? "bg-purple-50" : ""
                  } ${hasUnread ? "bg-purple-50/50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {otherUserProfilePicture ? (
                        <img
                          src={otherUserProfilePicture || "/placeholder.svg"}
                          alt={otherUserName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center text-white font-medium">
                          {otherUserName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span> */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900 truncate">{otherUserName}</h3>
                        <span className="text-xs text-gray-500">{formatTime(chat.lastMessageAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">
                          {chat.lastMessage || "No messages yet"}
                        </p>
                        {/* {hasUnread && (
                          <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                            1
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </ul>
        )}
      </div>

    </div>
  )
}

export default ChatList