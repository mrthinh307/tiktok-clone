import './styles/tailwind.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from '~/layouts';
import { AutoScrollProvider, AuthProvider, SocialInteractionProvider, VolumeProvider } from './contexts';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import config from '~/config';

// Component để bảo vệ routes
const ProtectedRoute = ({ children, requireAuth = false }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    
    // Nếu đang loading, hiển thị spinner
    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="text-primary text-4xl mb-4"
                    />
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }
    
    // Nếu route yêu cầu đăng nhập nhưng user chưa đăng nhập
    if (requireAuth && !user) {
        console.log(`Redirecting to home because user is not authenticated. Current path: ${location.pathname}`);
        return <Navigate to={config.routes.home} replace />;
    }
    
    // Nếu user chưa đăng nhập và truy cập route khác home (không có requireAuth), vẫn redirect về home
    // if (!user && location.pathname !== config.routes.home && location.pathname !== '/') {
    //     console.log(`Redirecting unauthenticated user to home. Current path: ${location.pathname}`);
    //     return <Navigate to={config.routes.home} replace />;
    // }
    
    return children;
};

// AppContent component to access context inside Router
const AppContent = () => {
    return (
        <div>
            <LoginForm />
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Page = route.component;
                    let Layout = DefaultLayout;

                    // Check if the route has a layout
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }

                    // Xác định xem route có yêu cầu đăng nhập không
                    const requireAuth = route.requireAuth || false;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <ProtectedRoute requireAuth={requireAuth}>
                                    <AutoScrollProvider>
                                        <VolumeProvider>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </VolumeProvider>
                                    </AutoScrollProvider>
                                </ProtectedRoute>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <SocialInteractionProvider>
                <Router>
                    <AppContent />
                </Router>
            </SocialInteractionProvider>
        </AuthProvider>
    );
}

export default App;
