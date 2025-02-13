import { ENotificationType } from '@/common/CommonTypes';
import { NotificationCard } from '../components/Notifications/ManNotificationCard';
import { createRoot } from "react-dom/client";

export const showMainNotification = (message: string, type: ENotificationType) => {
      const mainNotificationContainer = document.getElementById('main-notification-container');

      if (!mainNotificationContainer) {
      console.error('Notification container not found');
      return;
      }

   // Create a new div for each notification to allow stacking
      const notificationDiv = document.createElement('div');
      mainNotificationContainer.appendChild(notificationDiv);

      const notificationRoot = createRoot(notificationDiv);
      notificationRoot.render(<NotificationCard type={type} message={message} />);

   // Remove the notification after 10 seconds
      setTimeout(() => {
            notificationRoot.unmount();
            notificationDiv.remove(); // Remove the div after unmounting the component
   }, 3000); // 3 seconds
};
