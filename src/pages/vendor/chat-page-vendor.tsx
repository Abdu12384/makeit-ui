import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ChatComponent from "@/components/common/chat/chatComponent";
import { getSocket, initializeSocket, waitForSocketConnection } from "@/utils/socket/socket";
import { useParams } from "react-router-dom";
import { Chat } from "@/types/chat";

const VendorChatPage: React.FC = () => {
  const {receiverId} = useParams()
  const userId = useSelector((state: RootState) => state.vendor.vendor?.userId);
  const userModel = useSelector((state: RootState) => state.vendor.vendor?.role);
  const [hasChats, setHasChats] = useState<boolean | null>(null);
  const [socketReady, setSocketReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        let currentSocket = getSocket();
        
        if (!currentSocket || !currentSocket.connected) {
          currentSocket = await initializeSocket();
        } else {
          currentSocket = await waitForSocketConnection();
        }

        setSocketReady(true);
        if (userId) {
          currentSocket.emit("get-chats", { userId }, (response: { status: string; data: Chat[]; message?: string }) => {
            if (response.status === "success") {
              setHasChats(response.data.length > 0);
            } else {
              console.error("Failed to fetch chat history:", response.message);
              setHasChats(false);
            }
          });
        }
      } catch (error) {
        console.error("Socket setup failed:", error);
        setError("Failed to connect to chat service");
        setSocketReady(false);
      }
    };

    if (userId && userModel) {
      setupSocket();
    }
  }, [userId, userModel]);

  if (!userId || !userModel) {
    return <div>Loading user information...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Connection Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!socketReady || hasChats === null) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div>Loading chat system...</div>
        </div>
      </div>
    );
  }

  const socket = getSocket()!;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Client Chat</h1>
        {hasChats ? (
          <ChatComponent userId={userId} userModel={userModel as "client" | "vendor"} socket={socket} receiverId={receiverId!} />
        ) : (
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No Chatting Has Happened Yet</h2>
            <p className="text-gray-600">Start a new chat to connect with vendors.</p>
          
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorChatPage;

