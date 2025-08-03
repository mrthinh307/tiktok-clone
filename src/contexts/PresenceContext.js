import React, { createContext, useEffect, useState, useCallback } from 'react';
import supabase from '~/config/supabaseClient';
import { useAuth } from './AuthContext';

const PresenceContext = createContext();

/**
 * PresenceProvider - Simple presence management
 *
 * Logic:
 * - User logs in → Set online (stays online during entire session)
 * - User closes browser/tab → Set offline
 * - No complex cleanup, just basic safety net
 */
export const PresenceProvider = ({ children }) => {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  /**
   * Updates the current user's online status in the database
   */
  const updatePresence = useCallback(
    async (isOnline) => {
      if (!user?.sub) return;

      try {
        const { error } = await supabase.from('user_presence').upsert(
          {
            user_id: user.sub,
            is_online: isOnline,
            last_seen: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          },
        );

        if (error) {
          console.error('Error updating presence:', error);
        }
      } catch (error) {
        console.error('Error in updatePresence:', error);
      }
    },
    [user?.sub],
  );

  /**
   * Set user online when they authenticate
   */
  useEffect(() => {
    if (user?.sub) {
      updatePresence(true);
      console.log('🟢 User logged in - setting online status');
    }
  }, [user?.sub, updatePresence]);

  /**
   * Keep updating last_seen while user is active (heartbeat)
   */
  useEffect(() => {
    if (!user?.sub) return;

    const updateHeartbeat = () => {
      // Only update last_seen, keep online status
      updatePresence(true);
    };

    // Update heartbeat every 30 seconds
    const heartbeatInterval = setInterval(updateHeartbeat, 30 * 1000);

    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [user?.sub, updatePresence]);

  /**
   * Subscribe to real-time presence changes
   */
  useEffect(() => {
    if (!user?.sub) return;

    const channel = supabase
      .channel('presence-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
        },
        (payload) => {
          const { new: newRecord, old: oldRecord, eventType } = payload;

          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            if (newRecord.is_online) {
              setOnlineUsers((prev) => {
                if (prev.has(newRecord.user_id)) return prev;
                return new Set(prev).add(newRecord.user_id);
              });
            } else {
              setOnlineUsers((prev) => {
                if (!prev.has(newRecord.user_id)) return prev;
                const updated = new Set(prev);
                updated.delete(newRecord.user_id);
                return updated;
              });
            }
          } else if (eventType === 'DELETE' && oldRecord) {
            setOnlineUsers((prev) => {
              if (!prev.has(oldRecord.user_id)) return prev;
              const updated = new Set(prev);
              updated.delete(oldRecord.user_id);
              return updated;
            });
          }
        },
      )
      .subscribe();

    // Load initial online users
    const loadOnlineUsers = async () => {
      const { data } = await supabase
        .from('user_presence')
        .select('user_id')
        .eq('is_online', true);

      if (data) {
        setOnlineUsers(new Set(data.map((item) => item.user_id)));
      }
    };

    loadOnlineUsers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.sub]);

  /**
   * Check if a user is online
   */
  const isUserOnline = useCallback(
    (userId) => onlineUsers.has(userId),
    [onlineUsers],
  );

  /**
   * Get total online users count
   */
  const onlineCount = onlineUsers.size;

  return (
    <PresenceContext.Provider
      value={{
        onlineUsers,
        isUserOnline,
        onlineCount,
        updatePresence, // Rarely needed, but available
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};

export default PresenceContext;
