import { lazy } from 'react';
import { Navigate } from 'react-router-dom'; // ✅ THÊM DÒNG NÀY

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - pages under Dashboard
const Nguoidung = Loadable(lazy(() => import('pages/dashboard/nguoidung')));
const Qltaikhoan = Loadable(lazy(() => import('pages/dashboard/qltaikhoan')));
const AccountDetail = Loadable(lazy(() => import('pages/dashboard/AccountDetail')));

// render - components overview
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - extra pages
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      element: <DashboardLayout />,
      children: [
        // ✅ Nếu vào '/', sẽ redirect tới '/dashboard/nguoidung'
        { index: true, element: <Navigate to="/dashboard/nguoidung" /> },

        {
          path: 'dashboard',
          children: [
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

    // ✅ Full-screen route without Dashboard layout
    { path: 'account/:email', element: <AccountDetail /> }
  ]
};

export default MainRoutes;
