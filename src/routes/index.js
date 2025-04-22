import config from '~/config';

// Layouts
import { HeaderOnly, HeaderSideBar } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';
import Upload from '~/pages/Upload';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.following, component: Following },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.setting, component: Settings, layout: HeaderOnly },
    { path: config.routes.upload, component: Upload, layout: HeaderSideBar },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
