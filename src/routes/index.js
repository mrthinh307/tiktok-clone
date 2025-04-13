// Layouts
import { HeaderOnly } from '~/components/Layout';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: '/profile', component: Profile },
    { path: '/setting', component: Settings, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
