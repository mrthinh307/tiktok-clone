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
import Messages from '~/pages/Messages';

const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.following, component: Following },
  {
    path: config.routes.setting,
    component: Settings,
    layout: HeaderOnly,
    requireAuth: true,
  },
  {
    path: config.routes.upload,
    component: Upload,
    layout: HeaderOnly,
    requireAuth: true,
  },
  { path: config.routes.messages, component: Messages, requireAuth: true },
  { path: config.routes.live, component: Live },
  { path: config.routes.profile, component: Profile },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
