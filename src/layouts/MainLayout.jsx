import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Avatar, Breadcrumb, Badge, theme } from 'antd';
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
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userName = useSelector((state) => state.auth.user?.name || 'Admin');

 
  const breadcrumbNameMap = {
    '/dashboard': 'Tổng quan',
    '/inventory': 'Quản lý Kho',
    '/flocks': 'Danh sách đàn',
    '/finance': 'Tài chính',
    '/master-data': 'Cấu hình hệ thống',
  };

  const menuItems = [
    { key: '/dashboard', label: 'Tổng quan', icon: <DashboardOutlined /> },
    { key: '/inventory', label: 'Quản lý Kho', icon: <ShoppingCartOutlined /> },
    { key: '/flocks', label: 'Danh sách đàn', icon: <RiseOutlined /> },
    { key: '/finance', label: 'Tài chính', icon: <CreditCardOutlined /> },
    { key: '/master-data', label: 'Danh mục', icon: <SettingOutlined /> },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: (
          <div style={{ padding: '4px 0' }}>
            <strong>{userName}</strong>
            <div style={{ fontSize: '12px', color: '#888' }}>Quản trị viên</div>
          </div>
        ),
        icon: <UserOutlined />,
      },
      { type: 'divider' },
      { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, onClick: handleLogout, danger: true },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider
        trigger={null} // Tắt nút trigger mặc định ở dưới
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
        width={220}
      >
        {/* Logo Area */}
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            color: '#fff', 
            fontSize: collapsed ? '24px' : '20px', 
            fontWeight: 'bold',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            
            {!collapsed && <span style={{ color: '#4ade80' }}>FarmApp</span>}
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 16, borderRight: 0 }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout 
        style={{ 
          marginLeft: collapsed ? 80 : 220, 
          transition: 'all 0.2s',
          background: '#f0f2f5' 
        }}
      >
        {/* Header */}
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            position: 'sticky',
            top: 0,
            zIndex: 99,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)'
          }}
        >
          {/* Left: Toggle Button & Breadcrumb */}
          <Space size={24}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 48, height: 48 }}
            />
            
            <Breadcrumb
              items={[
                { href: '', title: <HomeOutlined /> },
                { title: breadcrumbNameMap[location.pathname] || 'Trang chủ' },
              ]}
            />
          </Space>

          {/* Right: Notification & User Profile */}
          <Space size={24}>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: 20 }} />} />
            </Badge>

            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }} className="user-dropdown">
                <Avatar 
                  style={{ backgroundColor: '#1677ff', verticalAlign: 'middle' }} 
                  icon={<UserOutlined />} 
                >
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ fontWeight: 500, color: '#333' }}>{userName}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center', color: '#888' }}>
          Chicken Farm Management ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
}