import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const Taichinh = Loadable(lazy(() => import('pages/dashboard/taichinh')));
const Nguoidung = Loadable(lazy(() => import('pages/dashboard/nguoidung')));
const Suckhoe = Loadable(lazy(() => import('pages/dashboard/suckhoe')));
const Qltaikhoan = Loadable(lazy(() => import('pages/dashboard/qltaikhoan')));  
const AccountDetail = Loadable(lazy(() => import('pages/dashboard/AccountDetail')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  // element: <DashboardLayout />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        { path: '', element: <Taichinh /> },
        {
          path: 'dashboard',
          children: [
            { path: 'taichinh', element: <Taichinh /> },
            { path: 'suckhoe', element: <Suckhoe /> },
            { path: 'nguoidung', element: <Nguoidung /> },
            { path: 'qltaikhoan', element: <Qltaikhoan /> }
          ]
        },
        { path: 'typography', element: <Typography /> },
        { path: 'color', element: <Color /> },
        { path: 'shadow', element: <Shadow /> },
        { path: 'sample-page', element: <SamplePage /> }
      ]
    },
    // ✅ route không có DashboardLayout, full màn hình chỉ có form
    { path: 'account/:email', element: <AccountDetail /> }
  ]
};

export default MainRoutes;
