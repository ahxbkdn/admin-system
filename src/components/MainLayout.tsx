import React, {  useState } from 'react';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import {
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  TeamOutlined as DepartmentOutlined,
  SolutionOutlined,
  BookOutlined,
  ToolOutlined,
  BellOutlined,
  FileTextOutlined,
  MonitorOutlined,
  CarouselOutlined,
  QuestionCircleOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { usePermission } from '../hooks/usePermission';

const { Header, Content, Footer, Sider } = Layout;

const items: any[] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "首页",
    permission: "admin"
  },
  {
    key: "/ai",
    icon: <MessageOutlined />,
    label: "AI对话",
    permission: "admin"
  },
  {
    key: "system",
    icon: <SettingOutlined />,
    label: "系统管理",
    permission: "admin",
    children: [
        {
          label: "课程管理",
          key: "/courses",
        },
        {
          label: "轮播图管理",
          key: "/banners",
        }
      ]
  },
  {
    key: "/users",
    icon: <UserOutlined />,
    label: "用户管理",
    permission: "admin"
  },
  {
    key: "/roles",
    icon: <TeamOutlined />,
    label: "角色管理",
    permission: "admin"
  },
  {
    key: "/menus",
    icon: <AppstoreOutlined />,
    label: "菜单管理",
    permission: "admin"
  },
  {
    key: "/departments",
    icon: <DepartmentOutlined />,
    label: "部门管理",
    permission: "admin"
  },
  {
    key: "/positions",
    icon: <SolutionOutlined />,
    label: "岗位管理",
    permission: "admin"
  },
  {
    key: "/dictionary",
    icon: <BookOutlined />,
    label: "字典管理",
    permission: "admin"
  },
  {
    key: "/params",
    icon: <ToolOutlined />,
    label: "参数设置",
    permission: "admin"
  },
  {
    key: "/notifications",
    icon: <BellOutlined />,
    label: "通知公告",
    permission: "admin"
  },
  {
    key: "logs",
    icon: <FileTextOutlined />,
    label: "日志管理",
    permission: "admin",
    children: [
      {
        label: "操作日志",
        key: "logs/operation",
      },
      {
        label: "登录日志",
        key: "logs/login",
      }
    ]
  },
  {
    key: "monitor",
    icon: <MonitorOutlined />,
    label: "系统监控",
    permission: "admin",
    children: [
      {
        label: "在线用户",
        key: "monitor/online",
      },
      {
        label: "服务器监控",
        key: "monitor/server",
      }
    ]
  },
  {
    key: "interview",
    icon: <QuestionCircleOutlined />,
    label: "面试题管理",
    permission: "admin",
    children: [
      {
        label: "面试题分类管理",
        key: "/interview/categories",
      },
      {
        label: "面试题管理",
        key: "/interview/questions",
      }
    ]
  }
];

// 过滤用户拥有的菜单


const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key);
    }
  };



  //2. 从所有菜单中过滤出当前用户能看到的
  const { filterMenu } = usePermission()
  const visibleMenus = filterMenu(items);



  // 获取选中的菜单键
  const getSelectedKeys = () => {
    const path = location.pathname;
    // 对于嵌套路径，返回完整路径作为选中键
    return [path];
  };

  // 生成面包屑
  const generateBreadcrumb = () => {
    const path = location.pathname;
    const breadcrumbItems = [];
    
    const menuMap: Record<string, string> = {
      '/': '首页',
      '/users': '用户管理',
      '/roles': '角色管理',
      '/menus': '菜单管理',
      '/departments': '部门管理',
      '/positions': '岗位管理',
      '/dictionary': '字典管理',
      '/params': '参数设置',
      '/notifications': '通知公告',
      '/logs': '日志管理',
      '/logs/operation': '操作日志',
      '/logs/login': '登录日志',
      '/monitor': '系统监控',
      '/monitor/online': '在线用户',
      '/monitor/server': '服务器监控',
      '/ai': 'AI对话',
      '/courses': '课程管理',
      '/banners': '轮播图管理',
      '/interview': '面试题管理',
      '/interview/categories': '面试题分类管理',
      '/interview/questions': '面试题管理',
    };
    
    if (path === '/') {
      breadcrumbItems.push({ title: '首页' });
    } else {
      const parts = path.split('/').filter(Boolean);
      let currentPath = '';
      
      breadcrumbItems.push({ title: <a href="/">首页</a> });
      
      parts.forEach((part, index) => {
        currentPath += `/${part}`;
        const displayName = menuMap[currentPath] || part;
        if (index === parts.length - 1) {
          breadcrumbItems.push({ title: displayName });
        } else {
          breadcrumbItems.push({ title: <a href={currentPath}>{displayName}</a> });
        }
      });
    }
    
    return breadcrumbItems;
  };

  return (
    <Layout
      style={{
        minWidth: "100vw",
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={['/']}
          selectedKeys={getSelectedKeys()}
          mode="inline"
          items={visibleMenus}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>若依管理系统</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>{generateBreadcrumb().map((item, index) => (
              <span key={index}>
                {index > 0 && ' / '}
                {typeof item.title === 'string' ? item.title : item.title.props.children}
              </span>
            ))}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>若依</span>
              <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'pink', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>韩帅</span>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
            items={generateBreadcrumb()}
          />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
