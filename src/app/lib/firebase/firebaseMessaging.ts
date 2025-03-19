// Step 1: Create a Firebase messaging utility
// lib/firebase/firebaseMessaging.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

let firebaseApp: FirebaseApp | undefined;
let messaging: Messaging | undefined;

// Initialize Firebase if it hasn't been already
const initializeFirebase = () => {
  if (!getApps().length) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
};

// Get FCM token
export const getFCMToken = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    initializeFirebase();
    
    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }
    
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }
    
    // Get token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Listen for messages
export const onMessageListener = (callback: (payload: any) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  try {
    initializeFirebase();
    
    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }
    
    return onMessage(messaging, callback);
  } catch (error) {
    console.error('Error setting up message listener:', error);
    return () => {};
  }
};