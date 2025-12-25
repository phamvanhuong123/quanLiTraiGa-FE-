import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Space } from 'antd';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  SettingOutlined,
  CreditCardOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

export default function MainLayout(){
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.user?.name || 'User');

  // Menu items
  const menuItems = [
    {
      key: '/dashboard',
      label: 'Tổng quan',
      icon: <DashboardOutlined />,
      onClick: () => navigate('/dashboard')
    },
    {
      key: '/inventory',
      label: 'Quản lý Kho',
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate('/inventory')
    },
    {
      key: '/flocks',
      label: 'Danh sách đàn',
      icon: <RiseOutlined />,
      onClick: () => navigate('/flocks')
    },
    {
      key: '/finance',
      label: 'Tài chính',
      icon: <CreditCardOutlined />,
      onClick: () => navigate('/finance')
    },
    {
      key: '/master-data',
      label: 'Danh mục',
      icon: <SettingOutlined />,
      onClick: () => navigate('/master-data')
    }
  ];

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  // User menu dropdown
  const userMenu = {
    items: [
      {
        key: 'profile',
        label: 'Hồ sơ',
        icon: <UserOutlined />
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: 'Đăng xuất',
        icon: <LogoutOutlined />,
        onClick: handleLogout
      }
    ]
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
        style={{ overflow: 'auto', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div style={{ padding: '16px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ marginBottom: 0 }}>🐔 Farm</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div></div>
          <Space>
            <span>👋 {userName}</span>
            <Dropdown menu={userMenu} trigger={['click']}>
              <Button type="text" icon={<UserOutlined />}>
                {userName}
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ padding: '24px', background: '#fafafa' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
