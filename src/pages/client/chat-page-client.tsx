

"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ChatComponent from "@/components/common/chat/chatComponent";
import { getSocket, initializeSocket, waitForSocketConnection } from "@/utils/socket/socket";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

const ClientChatPage: React.FC = () => {
  const { receiverId } = useParams();
  const userId = useSelector((state: RootState) => state.client.client?.userId);
  const userModel = useSelector((state: RootState) => state.client.client?.role);
  const [socketReady, setSocketReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedSocket = useRef(false);


  useEffect(() => {
    const setupSocket = async () => {
      try {
        let currentSocket = getSocket();

        // If no socket exists or it's not connected, initialize it
        if (!currentSocket || !currentSocket.connected) {
          console.log("Initializing socket in ClientChatPage");
          currentSocket = await initializeSocket();
        } else {
          // Wait for existing socket to be ready
          currentSocket = await waitForSocketConnection();
        }

        setSocketReady(true);
      } catch (error) {
        console.error("Socket setup failed:", error);
        setError("Failed to connect to chat service");
        setSocketReady(false);
      }
    };

    if (userId && userModel && !hasInitializedSocket.current) {
      hasInitializedSocket.current = true;
      setupSocket();
    }
  }, [userId, userModel]);

  if (!userId || !userModel) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 text-purple-600"
          >
            <MessageSquare size={64} className="animate-pulse" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">Loading user information...</h2>
          <p className="text-gray-500 mt-2">Please wait while we set up your chat</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Connection Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Retry Connection
          </button>
        </motion.div>
      </motion.div>
    );
  }

  if (!socketReady) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white p-8 rounded-xl shadow-lg text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 bg-purple-200 rounded-full"
            ></motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <MessageSquare size={32} className="text-purple-600" />
            </motion.div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Loading chat system...</h2>
          <p className="text-gray-500 mt-2">Connecting to messaging service</p>
        </motion.div>
      </motion.div>
    );
  }

  const socket = getSocket()!; // We know it exists because socketReady is true

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 w-full h-full"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full h-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-600 p-2 rounded-lg">
            <MessageSquare size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        </div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <ChatComponent
            userId={userId}
            userModel={userModel as "client" | "vendor"}
            socket={socket}
            receiverId={receiverId || ""}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ClientChatPage;




