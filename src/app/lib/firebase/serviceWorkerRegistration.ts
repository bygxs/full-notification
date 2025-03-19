// lib/firebase/serviceWorkerRegistration.ts

/**
 * Registers the Firebase messaging service worker
 * Should be called from your app initialization
 */
export const registerServiceWorker = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      try {
        // Check if we're in production or if service workers should be enabled
        const isProd = process.env.NODE_ENV === 'production';
        
        if (isProd || process.env.NEXT_PUBLIC_ENABLE_SW === 'true') {
          // Register the service worker
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Firebase service worker registered:', registration);
          
          return registration;
        } else {
          console.log('Service workers disabled in development mode');
        }
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    } else {
      console.log('Service workers are not supported in this environment');
    }
    
    return null;
  };
  
  /**
   * Unregisters all service workers and reloads the page
   * Useful during development or for troubleshooting
   */
  export const unregisterServiceWorkers = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service workers unregistered');
      // Optional: reload the page to ensure clean state
      window.location.reload();
    }
  };