import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleLoginForm = () => {
        setShowLoginForm((prev) => !prev);
        setIsRegistering(false);
    };

    const toggleRegisterMode = () => {
        setIsRegistering((prev) => !prev);
    };

    const login = (username, password) => {
        // Đây là một mock login đơn giản
        // Trong thực tế, bạn sẽ gọi API để xác thực người dùng
        if (username && password) {
            setUser({
                username,
                name: 'TikTok User',
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s',
            });
            setShowLoginForm(false);
            return true;
        }
        return false;
    };

    const register = (username, name, email, password) => {
        // Đây là một mock register đơn giản
        // Trong thực tế, bạn sẽ gọi API để đăng ký người dùng
        if (username && name && email && password) {
            setUser({
                username,
                name,
                email,
                avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJDRALoJakgEuuuGmBvBi-eSbPMe5B9fSdtA&s',
            });
            setShowLoginForm(false);
            setIsRegistering(false);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const value = {
        user,
        showLoginForm,
        isRegistering,
        toggleLoginForm,
        toggleRegisterMode,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
