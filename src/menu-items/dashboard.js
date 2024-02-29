// assets
import { UserOutlined, FileImageOutlined } from '@ant-design/icons';

// icons
const icons = { UserOutlined, FileImageOutlined };

// ==============================|| MENU ITEMS - <FireFilled />> DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'History',
  type: 'group',
  children: [
    {
      id: 'userHistory',
      title: 'User',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.UserOutlined,
      breadcrumbs: false
    },
    {
      id: 'kycHistory',
      title: 'Kyc',
      type: 'item',
      url: '/dashboard/kyc',
      icon: icons.FileImageOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
