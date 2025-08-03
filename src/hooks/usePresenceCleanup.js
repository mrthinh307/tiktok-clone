import { useEffect } from 'react';
import supabase from '~/config/supabaseClient';

/**
 * Simple cleanup hook - for quick response
 * 
 * This runs and cleans up users who:
 * - Have been offline for 1+ minute (quick cleanup)
 * - Helps with crashed browsers or network failures
 * 
 * Runs every 1 minute, responsive
 */
const usePresenceCleanup = () => {
  useEffect(() => {
    const emergencyCleanup = async () => {
      try {
        const { data, error } = await supabase.rpc('cleanup_presence_simple');

        if (error) {
          console.warn('Emergency cleanup failed:', error.message);
        } else if (data > 0) {
          console.log(`🧹 Emergency cleanup: ${data} stuck users marked offline`);
        }
      } catch (error) {
        // Fail silently, this is just emergency cleanup
      }
    };

    // Run cleanup every 1 minute
    const cleanupInterval = setInterval(emergencyCleanup, 1 * 60 * 1000);

    // Run once on start
    emergencyCleanup();

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);
};

export default usePresenceCleanup;
