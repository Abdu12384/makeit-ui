
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./fireBase";
import { toast } from "sonner";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_NOTIFICATION_KEY;
console.log('VAPID_KEY', VAPID_KEY);

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // First check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Request permission first
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      // Then get the token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
      });

      console.log('token', token);

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.warn(
          "No registration token available. Check your Firebase configuration."
        );
        return null;
      }
    } else {
      console.warn('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token", error);
    return null;
  }
};

export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("📩 Foreground FCM message received:", payload);
    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "You have a new message";
    console.log("title", title);
    console.log("body", body);

    toast(title, {
      description: body,
      duration: 5000,
    });
  });
};