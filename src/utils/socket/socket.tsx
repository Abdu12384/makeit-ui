import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
let socket: Socket | null = null;

export const initializeSocket = (): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      resolve(socket);
      return;
    }

    if (socket) {
      socket.disconnect();
    }

    socket = io(BACKEND_URL || "http://localhost:3000", {
      withCredentials: true,
      transports: ['websocket', 'polling'], 
      timeout: 10000, 
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket?.id);
      resolve(socket!);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      reject(error);
    });

    // Timeout fallback
    setTimeout(() => {
      if (!socket?.connected) {
        reject(new Error("Socket connection timeout"));
      }
    }, 10000);
  });
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const waitForSocketConnection = (): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      resolve(socket);
      return;
    }

    if (!socket) {
      reject(new Error("Socket not initialized"));
      return;
    }

    const checkConnection = () => {
      if (socket?.connected) {
        resolve(socket);
      } else {
        setTimeout(checkConnection, 100);
      }
    };

    checkConnection();

    // Timeout after 5 seconds
    setTimeout(() => {
      if (!socket?.connected) {
        reject(new Error("Socket connection timeout"));
      }
    }, 5000);
  });
};



// // components/socket/SocketManager.tsx
// import { useEffect, useState } from 'react'
// import socket from '@/hooks/SocketHook'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '../../store/store'
// // import LiveNotification from '../other components/LiveNotification'
// // import { Notification } from '@/types/NotificationType'
// // import { addNotifications, addSingleNotification } from '@/store/slices/notification/notificationSlice'
// // import { NotificationDTO } from '@/types/notificationEntity'


// const SocketManager = () => {
//     const [data, setData] = useState<Notification | null>(null)
//     const [notification, setNotification] = useState<boolean>(false)

//     const location = window.location
//     const path = location.pathname.split('/')[1]
//     const client = useSelector((state: RootState) => state.client.client)
//     const vendor = useSelector((state: RootState) => state.vendor.vendor)
//     const dispatch = useDispatch()
//     // let user = path === 'vendor' ? vendor : client

//     console.log('path - location',path)

//     let user = null
//     if (path == 'vendor') {
//         user = vendor
//     } else {
//         user = client
//     }
//     useEffect(() => {
//         if (!user) return

//         socket.connect()
//         socket.emit('register', { userId: user.userId, name: user.name }, (data: NotificationDTO[]) => {
//             // dispatch(addNotifications(data))
//         })

//         // socket.on('notification', (data) => {
//         //     const notification: Notification = {
//         //         from: data.from,
//         //         message: data.message,
//         //         type: 'info'
//         //     }
//         //     setData(notification)
//         //     dispatch(addSingleNotification(data.notification))
//         //     setNotification(true)
//         // })

//         return () => {
//             socket.disconnect()
//             socket.off('notification')
//         }
//     }, [user])

//     return (
//         <>
//             {/* {notification && (
//                 <LiveNotification
//                     notification={data!}
//                     onClose={() => setNotification(false)}
//                     duration={5000}
//                 />
//             )} */}
//         </>
//     )
// }

// export default SocketManager
