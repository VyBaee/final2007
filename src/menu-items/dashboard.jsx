// assets
import { DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Tài chính',
    //   type: 'item',
    //   url: '/dashboard/taichinh',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // }, 
    // {
    //   id: 'dashboard',
    //   title: 'Sức khỏe',
    //   type: 'item',
    //   url: '/dashboard/suckhoe',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'dashboard',
      title: 'Người dùng',
      type: 'item',
      url: '/dashboard/nguoidung',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'dashboard',
      title: 'QL tài khoản',
      type: 'item',
      url: '/dashboard/qltaikhoan',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
