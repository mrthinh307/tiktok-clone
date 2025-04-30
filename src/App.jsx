import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from '~/layouts';
import { AutoScrollProvider } from './contexts/AutoScrollContext';

function App() {
    return (
        <Router>
            <div>
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
    );
}

export default App;
