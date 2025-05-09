import './styles/tailwind.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from '~/layouts';
import { AutoScrollProvider } from './contexts/AutoScrollContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';

function App() {
    return (
        <AuthProvider>
            <Router>
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
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </AutoScrollProvider>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
