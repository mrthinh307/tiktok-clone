import supabase from '../../config/supabaseClient'; // Import Supabase client

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      return { success: false, message: error.message };
    }

    console.log('Supabase login successful, session:', data.session);
    return { success: true, session: data.session, user: data.user };
  } catch (error) {
    console.error('Failed to login:', error.message);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const register = async (firstName, lastName, email, password) => {
  try {
    // Step 1: Sign up the user with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            fullName: `${firstName} ${lastName}`,
            nickname: email.split('@')[0],
            avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
            tick: true,
          },
        },
      },
    );

    if (signUpError) {
      console.error('Supabase signup error:', signUpError.message);
      return { success: false, message: signUpError.message };
    }

    // ✅ Bước 2: Lưu vào bảng "user"
    const { id, email: userEmail } = signUpData.user;

    const userData = {
      id, // thường là user.id (UUID)
      email: userEmail,
      nickname: email.split('@')[0],
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
      bio: '',
      tick: true,
      followings_count: 0,
      followers_count: 0,
      likes_count: 0,
    };

    const { error: insertError } = await supabase
      .from('user')
      .insert([userData]);

    if (insertError) {
      console.error('Lỗi khi lưu user vào bảng user:', insertError.message);
    } else {
      console.log('User đã được lưu vào database thành công.');
    }

    return { success: true, user: signUpData.user };
  } catch (error) {
    console.error('Failed to register:');
    return { success: false };
  }
};

export const checkAuth = async () => {
  try {
    // Use Supabase session instead of manual token parsing
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.log('No valid session found');
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('No user found');
      return null;
    }

    return user;
  } catch (error) {
    console.error('Failed to authenticate token:', error.message);
    // Clear invalid session
    await supabase.auth.signOut();
    return null;
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error during sign out:', error.message);
      return { success: false, message: error.message };
    }

    console.log('User successfully signed out');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error during sign out:', err);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const checkEmailExists = async (email) => {
  try {
    const { data, error } = await supabase
      .from('user') // Assuming your table is named 'user'
      .select('email')
      .eq('email', email)
      .maybeSingle(); // Returns a single record or null, doesn't error if no rows

    if (error) {
      // Log the error but still treat it as email not found or unconfirmed
      console.error('Supabase error checking email:', error.message);
      return false; // Or handle specific errors differently if needed
    }

    return !!data; // If data is not null, email exists
  } catch (error) {
    console.error('Failed to check email existence:', error.message);
    return false; // Or throw error to be handled by caller
  }
};

// Password Reset Functions
export const sendPasswordResetEmail = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset email error:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Failed to send password reset email:', error.message);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update error:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Failed to update password:', error.message);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Session Management
export const getSession = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  } catch (error) {
    console.error('Failed to get session:', error.message);
    return null;
  }
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Session refresh error:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, session: data.session };
  } catch (error) {
    console.error('Failed to refresh session:', error.message);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Email Verification
export const resendEmailVerification = async () => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: '', // Will use the current user's email
    });

    if (error) {
      console.error('Email verification resend error:', error.message);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Failed to resend verification email:', error.message);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Auth State Change Handler
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};
