// components/ui/Notification.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import useFirebaseMessaging from "../hooks/useFirebaseMessaging";

interface NotificationContextType {
  token: string | null;
  requestPermission: () => Promise<boolean>;
  notificationMessage: any;
  isTokenLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  token: null,
  requestPermission: async () => false,
  notificationMessage: null,
  isTokenLoading: false,
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, notificationMessage, requestPermission, isTokenLoading } =
    useFirebaseMessaging();
  const [hasPermission, setHasPermission] = useState(false);

  // Check notification permission on component mount
  useEffect(() => {
    const checkPermission = async () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = Notification.permission;
        setHasPermission(permission === "granted");
      }
    };

    checkPermission();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ token, requestPermission, notificationMessage, isTokenLoading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationPermissionButton: React.FC = () => {
  const { requestPermission, token, isTokenLoading } = useNotification();
  const [permissionStatus, setPermissionStatus] = useState<string>("");

  useEffect(() => {
    // Check permission status on component mount
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    }
  }, [token]);

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setPermissionStatus("granted");
    } else {
      setPermissionStatus(Notification.permission);
    }
  };

  return (
    <div className="notification-permission">
      <button
        onClick={handleRequestPermission}
        disabled={permissionStatus === "granted" || isTokenLoading}
        className={`px-4 py-2 rounded ${
          permissionStatus === "granted"
            ? "bg-green-500 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isTokenLoading
          ? "Loading..."
          : permissionStatus === "granted"
          ? "Notifications Enabled"
          : "Enable Notifications"}
      </button>

      {token && (
        <div className="mt-2 text-sm text-gray-500">
          <p>Notification token obtained!</p>
        </div>
      )}

      {permissionStatus === "denied" && (
        <div className="mt-2 text-sm text-red-500">
          <p>
            Notification permission denied. Please enable notifications in your
            browser settings.
          </p>
        </div>
      )}
    </div>
  );
};

export const NotificationDisplay: React.FC = () => {
  const { notificationMessage } = useNotification();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notificationMessage) {
      setVisible(true);
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notificationMessage]);

  if (!notificationMessage || !visible) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 w-80 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 z-50">
      <div className="flex justify-between">
        <h3 className="font-bold text-gray-800">
          {notificationMessage.title || "New Notification"}
        </h3>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      <p className="text-gray-600 mt-2">
        {notificationMessage.body || "You have a new notification"}
      </p>
      {notificationMessage.image && (
        <img
          src={notificationMessage.image}
          alt="Notification"
          className="mt-2 w-full rounded"
        />
      )}
    </div>
  );
};
