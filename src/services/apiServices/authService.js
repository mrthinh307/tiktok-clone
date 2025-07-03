import supabase from '../../config/supabaseClient'; // Import Supabase client

export const login = async (email, password) => {
    try {
        // Consider using Supabase client for login as well for consistency
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase login error:', error.message);
            return false;
        }

        // Supabase client handles session/token storage automatically
        console.log('Supabase login successful, session:', data.session);
        return true;
    } catch (error) {
        console.error(
            'Failed to login:',
            error.response?.data || error.message,
        );
        return false;
    }
};

export const register = async (firstName, lastName, email, password) => {
    try {
        // Step 1: Sign up the user with Supabase Auth
        const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        firstName, // This will be in raw_user_meta_data
                        lastName, // This will be in raw_user_meta_data
                        fullName: `${firstName} ${lastName}`,
                        nickname: email.split('@')[0],
                        avatar_url: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
                        tick: true,
                        followings_count: 0,
                        followers_count: 0,
                        likes_count: 0,
                    },
                },
            });

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
            console.error(
                'Lỗi khi lưu user vào bảng user:',
                insertError.message,
            );
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
        const projectId = process.env.REACT_APP_SUPABASE_PROJECT_ID;
        const tokens = localStorage.getItem(`sb-${projectId}-auth-token`);

        if (!tokens) {
            console.log('No token found');
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

        // Call API to validate token and get user info
        // const response = await request.get('auth/me', {
        // });

        // if (response && response.data) {
        //     console.log('Token valid, user authenticated');
        //     return response.data;
        // } else {
        //     console.log('Invalid response from auth/me');
        //     localStorage.removeItem('token');
        //     return null;
        // }
    } catch (error) {
        console.error(
            'Failed to authenticate token:',
            error.response?.data || error.message,
        );
        // Clear invalid token
        localStorage.removeItem('token');
        return null;
    }
};

export const logout = () => {
    const projectId = process.env.REACT_APP_SUPABASE_PROJECT_ID;
    localStorage.removeItem(`sb-${projectId}-auth-token`);
    return true;
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
