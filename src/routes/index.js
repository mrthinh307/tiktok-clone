// Layouts
import { HeaderOnly, HeaderSideBar } from '~/components/Layout';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';
import Upload from '~/pages/Upload';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
    { path: "/:nickname", component: Profile },
    { path: '/setting', component: Settings, layout: HeaderOnly },
    { path: '/upload', component: Upload, layout: HeaderSideBar },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
