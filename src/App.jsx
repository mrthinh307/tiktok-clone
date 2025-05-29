import './styles/tailwind.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from '~/layouts';
import { AutoScrollProvider, AuthProvider, SocialInteractionProvider, VolumeProvider } from './contexts';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// AppContent component to access context inside Router
const AppContent = () => {
    const { isLoading } = useAuth();

    // Show loading indicator while checking authentication
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

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <AutoScrollProvider>
                                    <VolumeProvider>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </VolumeProvider>
                                </AutoScrollProvider>
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
