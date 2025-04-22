import routesConfig from '~/config/routes';

// Layouts
import { HeaderOnly, HeaderSideBar } from '~/components/Layout';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';
import Upload from '~/pages/Upload';

const publicRoutes = [
    { path: routesConfig.home, component: Home },
    { path: routesConfig.following, component: Following },
    { path: routesConfig.profile, component: Profile },
    { path: routesConfig.setting, component: Settings, layout: HeaderOnly },
    { path: routesConfig.upload, component: Upload, layout: HeaderSideBar },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
