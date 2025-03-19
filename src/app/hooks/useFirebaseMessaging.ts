// hooks/useFirebaseMessaging.ts
import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../lib/firebase/firebaseMessaging';
import { registerServiceWorker } from '../lib/firebase/serviceWorkerRegistration';

interface NotificationMessage {
  title?: string;
  body?: string;
  image?: string;
  data?: any;
}

interface UseFirebaseMessagingReturn {
  token: string | null;
  notificationMessage: NotificationMessage | null;
  requestPermission: () => Promise<boolean>;
  error: Error | null;
  isTokenLoading: boolean;
}

const useFirebaseMessaging = (): UseFirebaseMessagingReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<NotificationMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(false);

  // Request notification permission and get FCM token
  const requestPermission = async (): Promise<boolean> => {
    setIsTokenLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Register service worker for background notifications
        await registerServiceWorker();
        
        // Get FCM token
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
          console.log('FCM Token:', currentToken);
          
          // Here you would typically send this token to your server
          // await sendTokenToServer(currentToken);
          
          setIsTokenLoading(false);
          return true;
        } else {
          console.log('No registration token available. Request permission to generate one.');
          setIsTokenLoading(false);
          return false;
        }
      } else {
        console.log('Notification permission denied.');
        setIsTokenLoading(false);
        return false;
      }
    } catch (err) {
      console.error('An error occurred while requesting permission:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsTokenLoading(false);
      return false;
    }
  };

  useEffect(() => {
    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      setNotificationMessage({
        title: payload.notification?.title,
        body: payload.notification?.body,
        image: payload.notification?.image,
        data: payload.data,
      });
      
      // Optionally, you can also show a notification even in foreground
      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'New Notification', {
          body: payload.notification?.body,
          icon: '/icons/notification-icon.png',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    token,
    notificationMessage,
    requestPermission,
    error,
    isTokenLoading,
  };
};

export default useFirebaseMessaging;