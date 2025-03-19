// Step 3: Create a notification component
// components/ui/Notification.tsx

'use client';

import React, { useEffect } from 'react';
import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';

export const Notification: React.FC = () => {
  const { 
    notification, 
    notificationPermission, 
    requestPermission, 
    clearNotification 
  } = useFirebaseMessaging();

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
      <div className="p-4">
        <div className="flex items-start">
          {notification.image && (
            <div className="flex-shrink-0 mr-3">
              <img 
                className="h-10 w-10 rounded-full" 
                src={notification.image} 
                alt="Notification image" 
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {notification.body}
            </p>
          </div>
          <button
            onClick={clearNotification}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 4: Create a notification permission button
// components/ui/NotificationPermissionButton.tsx
export const NotificationPermissionButton: React.FC = () => {
  const { notificationPermission, requestPermission } = useFirebaseMessaging();
  
  const handleRequestPermission = async () => {
    await requestPermission();
  };
  
  if (notificationPermission === 'granted') {
    return null;
  }
  
  return (
    <button 
      onClick={handleRequestPermission}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Enable Notifications
    </button>
  );
};