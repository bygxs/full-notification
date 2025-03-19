'use client';

import { useState, useEffect } from 'react';
import { NotificationPermissionButton, NotificationDisplay, useNotification } from './components/Notification';

export default function Home() {
  const { token } = useNotification();
  const [tokenDisplay, setTokenDisplay] = useState('No token yet');
  
  useEffect(() => {
    if (token) {
      setTokenDisplay(token.substring(0, 12) + '...' + token.substring(token.length - 12));
    }
  }, [token]);

  const testBackgroundNotification = async () => {
    try {
      // This would typically be done from your backend
      // This is just for testing purposes
      if (!token) {
        alert('No notification token available. Please enable notifications first.');
        return;
      }

      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `key=${process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY}`
        },
        body: JSON.stringify({
          to: token,
          notification: {
            title: 'Background Test',
            body: 'This is a test background notification',
            icon: '/icons/notification-icon.png'
          },
          data: {
            url: '/details',
            someData: 'Additional data here'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      alert('Test notification sent! Close the app to see the background notification.');
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Error sending test notification. Check console for details.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center justify-center w-full space-y-8">
          <h1 className="text-4xl font-bold">Firebase Notifications</h1>
          
          <div className="flex flex-col items-center space-y-4">
            <NotificationPermissionButton />
            <NotificationDisplay />
          </div>
          
          {token && (
            <div className="mt-8 text-center">
              <p className="mb-2">Your FCM Token:</p>
              <code className="bg-gray-100 p-2 rounded text-xs break-all max-w-md">
                {tokenDisplay}
              </code>
              <p className="mt-2 text-sm text-gray-500">
                Use this token to send notifications to this device
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <button
              onClick={testBackgroundNotification}
              disabled={!token}
              className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-300"
            >
              Test Background Notification
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Note: This button will only work if you have a server key set up in your environment variables
            </p>
          </div>
          
          <div className="mt-12 p-4 bg-yellow-50 rounded-lg max-w-2xl text-sm">
            <h3 className="font-bold text-yellow-800 mb-2">Important Notes:</h3>
            <ul className="list-disc pl-5 space-y-2 text-yellow-700">
              <li>Background notifications require a service worker to be installed.</li>
              <li>For production use, send notifications from your server, not from client-side.</li>
              <li>Your browser may throttle notifications if too many are sent.</li>
              <li>Make sure to have both notification and data payloads in your FCM messages.</li>
              <li>Test background notifications by closing this tab or browser after clicking the test button.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}