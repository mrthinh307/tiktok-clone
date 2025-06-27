import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Profile from '~/pages/Profile';
import Settings from '~/pages/Settings';
import Upload from '~/pages/Upload';
import Live from '~/pages/Live';

const publicRoutes = [
    { path: config.routes.home, component: Home }, // Home không yêu cầu đăng nhập
    { path: config.routes.following, component: Following }, // Following yêu cầu đăng nhập
    { path: config.routes.setting, component: Settings, layout: HeaderOnly, requireAuth: true }, // Settings yêu cầu đăng nhập
    { path: config.routes.upload, component: Upload, layout: HeaderOnly, requireAuth: true }, // Upload yêu cầu đăng nhập
    { path: config.routes.live, component: Live },
    { path: config.routes.profile, component: Profile } // Profile yêu cầu đăng nhập
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
