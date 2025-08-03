import { useContext } from 'react';
import PresenceContext from '~/contexts/PresenceContext';

/**
 * Hook to access presence context
 * 
 * This hook provides access to:
 * - onlineUsers: Set of currently online user IDs
 * - isUserOnline: Function to check if specific user is online
 * - getOnlineUserCount: Function to get total online users count
 * - updatePresence: Function to manually update presence (rarely needed)
 * 
 * Note: Presence is now managed at the app level via PresenceProvider
 * No need to worry about component unmount/mount affecting online status
 */
const usePresence = () => {
  const context = useContext(PresenceContext);
  
  if (!context) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  
  return context;
};

export default usePresence;