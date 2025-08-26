import { useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '~/contexts/AuthContext';

function AuthErrorHandler({ children }) {
  const { authError } = useAuth();

  // Only handle auth errors - no automatic auth state changes
  useEffect(() => {
    if (authError) {
      console.error('Auth Error:', authError);
      toast.error(authError);
    }
  }, [authError]);

  return children;
}

export default AuthErrorHandler;
