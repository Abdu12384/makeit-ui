// import React, { useState } from "react";
// import { Socket } from "socket.io-client";
// import ChatList from "./ChatList";
// import ChatWindow from "./ChatWindow";

// interface ChatComponentProps {
//   userId: string;
//   userModel: "client" | "vendors";
//   socket: Socket;
//   receiverId: string;
// }

// const ChatComponent: React.FC<ChatComponentProps> = ({ userId, userModel, socket, receiverId }) => {
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

//   return (
//     <div className="flex h-screen font-sans bg-gray-100">
//       <div className="w-1/3 border-r border-gray-200 p-4 bg-white shadow-sm">
//         <ChatList
//           userId={userId}
//           userModel={userModel}
//           onSelectChat={setSelectedChatId}
//           socket={socket}
//           receiverId={receiverId}
//         />
//       </div>
//       <div className="w-2/3 p-4 flex flex-col">
//         {selectedChatId ? (
//           <ChatWindow
//             chatId={selectedChatId}
//             userId={userId}
//             userModel={userModel}
//             socket={socket}
//             // receiverId={receiverId}
//           />
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             <p>Select a chat to start messaging</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;





"use client"

import type React from "react"
import { useState } from "react"
import type { Socket } from "socket.io-client"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { motion } from "framer-motion"

interface ChatComponentProps {
  userId: string
  userModel: "client" | "vendors"
  socket: Socket
  receiverId: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ userId, userModel, socket, receiverId }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isMobileListVisible, setIsMobileListVisible] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-[calc(100vh-120px)]  rounded-xl overflow-hidden shadow-xl bg-white"
    >
      {/* Mobile View Toggle - Only show when chat is selected on mobile */}
      {selectedChatId && (
        <div className="md:hidden fixed bottom-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileListVisible(!isMobileListVisible)}
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
          >
            {isMobileListVisible ? (
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
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
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
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </motion.button>
        </div>
      )}

      {/* Chat List Sidebar - Always visible on desktop */}
      <div
        className={`
          w-full md:w-1/3 border-r border-gray-100 bg-gray-50 flex-shrink-0
          ${selectedChatId ? "hidden md:flex" : "flex"}
          ${selectedChatId && isMobileListVisible ? "flex md:flex" : ""}
        `}
      >
        <ChatList
          userId={userId}
          userModel={userModel}
          onSelectChat={(chatId) => {
            setSelectedChatId(chatId)
            // On mobile, hide the list when a chat is selected
            if (window.innerWidth < 768) {
              setIsMobileListVisible(false)
            }
          }}
          socket={socket}
          receiverId={receiverId}
        />
      </div>

      {/* Chat Window - Always visible on desktop when chat selected */}
      <div
        className={`
          flex-1 flex flex-col
          ${!selectedChatId ? "hidden md:flex" : "flex"}
          ${selectedChatId && isMobileListVisible ? "hidden md:flex" : ""}
        `}
      >
        {selectedChatId ? (
          <ChatWindow
            chatId={selectedChatId}
            userId={userId}
            userModel={userModel}
            socket={socket}
            onBackClick={() => {
              // On mobile, show the chat list when back is clicked
              if (window.innerWidth < 768) {
                setIsMobileListVisible(true)
              }
            }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-500"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 10h.01" />
                <path d="M12 10h.01" />
                <path d="M16 10h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a conversation</h3>
            <p className="text-gray-500 max-w-sm">Choose a chat from the list to start messaging</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ChatComponent