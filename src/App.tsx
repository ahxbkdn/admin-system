import React from 'react';

import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Menus from './pages/Menus';
import Departments from './pages/Departments';
import Positions from './pages/Positions';
import Dictionary from './pages/Dictionary';
import Params from './pages/Params';
import Notifications from './pages/Notifications';
import Logs from './pages/Logs';
import Monitor from './pages/Monitor';
import Courses from './pages/Courses';
import Banners from './pages/Banners';
import CategoriesPage from './pages/Interview/Categories';
import QuestionsPage from './pages/Interview/Questions';
import { PermissionProvider } from './hooks/usePermission';

// 模拟测试数据
const mockPermissions = {
  permissions: ["admin"],
  roles: ['admin']
}

const App: React.FC = () => {

  return (
    <PermissionProvider permission={mockPermissions}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="ai" element={<div>AI对话页面</div>} />
          <Route path="roles" element={<Roles />} />
          <Route path="menus" element={<Menus />} />
          <Route path="departments" element={<Departments />} />
          <Route path="positions" element={<Positions />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="params" element={<Params />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="logs" element={<Logs />} />
          <Route path="logs/operation" element={<Logs />} />
          <Route path="logs/login" element={<Logs />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="monitor/online" element={<Monitor />} />
          <Route path="monitor/server" element={<Monitor />} />
          <Route path="courses" element={<Courses />} />
          <Route path="banners" element={<Banners />} />
          <Route path="interview/categories" element={<CategoriesPage />} />
          <Route path="interview/questions" element={<QuestionsPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </PermissionProvider>


  );
};

export default App;
