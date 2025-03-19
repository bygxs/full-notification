// Place this file in the public directory (public/firebase-messaging-sw.js)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
// Replace with your actual Firebase config
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icons/notification-icon.png', // Replace with your app icon path
    data: payload.data, // Pass any custom data from the notification
    badge: '/icons/badge-icon.png', // Replace with your badge icon path
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'view',
        title: 'View',
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Get the notification data
  const urlToOpen = event.notification.data?.url || '/';
  
  // This looks to see if the current window is already open and focuses it
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle push events
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.notification?.title || 'New Notification';
    const options = {
      body: data.notification?.body || 'You have a new notification',
      icon: '/icons/notification-icon.png',
      data: data.data,
      badge: '/icons/badge-icon.png',
      vibrate: [100, 50, 100]
    };
    
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});