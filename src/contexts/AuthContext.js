import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import * as authService from '~/services/apiServices/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Auth State Change Listener
  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, session?.user?.id);
      
      setAuthError(null); // Clear any previous errors
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user.user_metadata || session.user);
            console.log('✅ User signed in:', session.user.id);
          }
          break;
          
        case 'SIGNED_OUT':
          setUser(null);
          console.log('👋 User signed out');
          break;
          
        case 'TOKEN_REFRESHED':
          console.log('🔄 Token refreshed automatically');
          // User state remains the same, just token was refreshed
          break;
          
        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user.user_metadata || session.user);
            console.log('📝 User data updated');
          }
          break;
          
        default:
          console.log('📢 Auth event:', event);
      }
      
      setIsLoading(false);
    });

    // Initial session check
    const checkInitialSession = async () => {
      try {
        const session = await authService.getSession();
        if (session?.user) {
          setUser(session.user.user_metadata || session.user);
          console.log('🎯 Initial session found:', session.user.id);
        } else {
          console.log('❌ No initial session found');
        }
      } catch (error) {
        console.error('❌ Initial session check failed:', error);
        setAuthError('Failed to check authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialSession();

    // Cleanup subscription
    return () => {
      console.log('🧹 Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const toggleLoginForm = () => {
    setShowLoginForm((prev) => !prev);
    setIsRegistering(false);
  };

  const toggleRegisterMode = () => {
    setIsRegistering((prev) => !prev);
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await authService.login(email, password);

      if (result.success) {
        // Show manual toast for login success
        toast.success('Login successful!');
        return { success: true };
      }
      
      setAuthError(result.message);
      return { success: false, message: result.message };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'An unexpected error occurred during login';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const result = await authService.register(
        firstName,
        lastName,
        email,
        password,
      );

      if (result.success) {
        // Show manual toast for registration success
        toast.success('Registration successful!');
        setIsRegistering(false);
        return { success: true };
      }
      
      const errorMessage = result.message || 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'An error occurred during registration';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const result = await authService.logout();
      
      if (result.success) {
        // Show manual toast for logout
        toast.info('Logout successful!');
        window.location.href = '/'; // Redirect to home
      } else {
        console.error('Logout failed:', result.message);
        setAuthError('Failed to logout properly');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError('An error occurred during logout');
    } finally {
      setIsLoading(false);
    }
  };

  // Password Reset Functions
  const sendPasswordReset = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.sendPasswordResetEmail(email);
      
      if (!result.success) {
        setAuthError(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = 'Failed to send password reset email';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setAuthError(null);
      const result = await authService.updatePassword(newPassword);
      
      if (!result.success) {
        setAuthError(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = 'Failed to update password';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Email Verification
  const resendEmailVerification = async () => {
    try {
      setAuthError(null);
      const result = await authService.resendEmailVerification();
      
      if (!result.success) {
        setAuthError(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage = 'Failed to resend verification email';
      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    showLoginForm,
    isRegistering,
    isLoading,
    authError,
    toggleLoginForm,
    toggleRegisterMode,
    login,
    register,
    logout,
    sendPasswordReset,
    updatePassword,
    resendEmailVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
