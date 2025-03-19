// Step 7: Create a test page to verify your setup
// app/test-notifications/page.tsx
"use client";

import { useState } from "react";
import { useFirebaseMessaging } from "./hooks/useFirebaseMessaging";

export default function TestNotificationsPage() {
  const { token, notification, requestPermission, getToken } =
    useFirebaseMessaging();
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Notifications</h1>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Step 1: Request Permission
          </h2>
          <button
            onClick={requestPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Request Notification Permission
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Step 2: Get FCM Token</h2>
          <button
            onClick={getToken}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mb-4"
          >
            Get FCM Token
          </button>

          {token && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Your FCM Token:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={token}
                  readOnly
                  className="flex-1 p-2 border rounded-md dark:bg-black text-white bg-gray-50 text-sm overflow-x-auto"
                />
                <button
                  onClick={handleCopyToken}
                  className="ml-2 px-3 py-2 dark:bg-black text-white border bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  {tokenCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Use this token to send a test notification from the Firebase
                console or your backend.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Step 3: Test from Firebase Console
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to the Firebase Console</li>
            <li>Select your project</li>
            <li>Go to "Messaging" in the sidebar</li>
            <li>Click "Send your first message"</li>
            <li>Choose "Send test message"</li>
            <li>
              Paste your FCM token in the "Add an FCM registration token" field
            </li>
            <li>Fill in the notification details</li>
            <li>Click "Test"</li>
          </ol>
        </div>

        {notification && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">
              Notification Received
            </h2>
            <p className="font-medium">{notification.title}</p>
            <p>{notification.body}</p>
            {notification.image && (
              <img
                src={notification.image}
                alt="Notification"
                className="mt-2 max-w-xs"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
