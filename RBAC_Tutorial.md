# React + Ant Design + TypeScript 实现 RBAC 权限控制教程

本文档详细介绍了如何在 React 项目中实现基于角色的访问控制（RBAC），涵盖权限定义、Context 状态管理、Hook 封装、菜单过滤、路由守卫以及按钮级权限控制。

## 0. 场景举例：什么是 RBAC 权限控制？

为了更好地理解接下来的代码实现，我们先通过一个具体的场景来看看三种不同粒度的权限控制。

假设系统中有两个角色：**超级管理员 (Admin)** 和 **普通员工 (Staff)**。

### 1. 菜单权限 (Menu Permission)
**目标**：不同角色看到的侧边栏菜单是不一样的。

*   **Admin**：可以看到 "仪表盘"、"用户管理"、"系统设置"。
*   **Staff**：只能看到 "仪表盘"。
*   **实现效果**：Staff 登录后，侧边栏根本不会渲染 "用户管理" 和 "系统设置" 的菜单项。

**代码场景示例**：
```tsx
// 菜单配置：通过 permission 字段标记该菜单需要的权限
const menuItems = [
  {
    label: '仪表盘',
    key: '/dashboard',
    // 无 permission 字段，表示所有人可见
  },
  {
    label: '用户管理',
    key: '/users',
    permission: 'menu:users' // 只有拥有 'menu:users' 权限的用户才能看到
  }
];

// 使用自定义 Hook 过滤菜单
const { filterMenu } = usePermission();
const visibleMenus = filterMenu(menuItems); 
// Staff 用户（无 'menu:users' 权限）得到的 visibleMenus 将不包含用户管理
```

### 2. 路由权限 (Route Permission)
**目标**：防止用户通过直接在浏览器地址栏输入 URL 访问未授权页面。
*   **场景**：虽然 Staff 看不到 "用户管理" 菜单，但他如果知道 URL 是 `/users` 并直接在地址栏输入访问。
*   **实现效果**：路由守卫（Guard）会拦截该请求，检测到 Staff 没有 `page:users` 权限，自动跳转到 403 无权限页面。

**代码场景示例**：
```tsx
// 路由配置：使用 AuthRoute 包裹需要保护的组件
<Routes>
  {/* 公开页面 */}
  <Route path="/login" element={<Login />} />
  
  {/* 受保护页面：需要 'page:users' 权限 */}
  <Route 
    path="/users" 
    element={
      <AuthRoute requiredPermission="page:users">
        <UsersPage />
      </AuthRoute>
    } 
  />
</Routes>
```

### 3. 按钮权限 (Button Permission)
**目标**：在同一个页面中，不同角色看到的操作按钮不同。
*   **场景**：在 "用户列表" 页面。
    *   **Admin**：可以看到 "新增用户"、"编辑"、"删除" 按钮。
    *   **Staff**：只能查看列表数据，**看不到**（或禁用）所有操作按钮。
*   **实现效果**：通过 `AuthButton` 组件包裹按钮，判断当前用户是否有 `button:add` 或 `button:delete` 权限，从而决定是否渲染该按钮。

**代码场景示例**：
```tsx
// 在页面组件中
const UsersPage = () => {
  return (
    <div>
      <h1>用户列表</h1>
      
      {/* 只有拥有 'button:add' 权限才会渲染这个按钮 */}
      <AuthButton requiredPermission="button:add">
        <Button type="primary">新增用户</Button>
      </AuthButton>

      <Table ... />
    </div>
  );
};
```

---

## 1. 定义权限类型

### 模拟后端返回的数据结构
在实际开发中，用户登录成功后，后端接口通常会返回如下结构的数据。我们在前端定义类型时需要与之匹配。

```typescript
// 模拟 API 响应：登录成功后返回的用户信息
const mockLoginResponse = {
  code: 200,
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    userInfo: {
      id: "1001",
      name: "Super Admin",
      avatar: "https://example.com/avatar.png",
      // 关键：后端返回的权限列表
      permissions: [
        "dashboard:view",
        "user:view",
        "user:add",
        "user:edit",
        "user:delete",
        "system:settings"
      ],
      // 可选：后端返回的角色列表
      roles: ["admin"]
    }
  }
};
```

### 前端类型定义
首先，我们需要定义权限相关的类型，确保代码的类型安全。

创建文件：`src/types/permission.ts`

```typescript
/** 权限类型 */
export type PermissionCode = string; // 如 "user:list"、"button:add"、"menu:dashboard"

/** 用户权限信息 */
export interface UserPermission {
  permissions: PermissionCode[]; // 用户拥有的权限码列表
  roles: string[]; // 角色（可选，用于角色级权限）
}

/** 路由配置（含权限） */
export interface AuthRouteConfig {
  path: string;
  element: React.ReactNode;
  
  // 用于生成菜单的 UI 配置
  title?: string; // 菜单显示的文字，如 "用户管理"
  icon?: string; // 菜单显示的图标，如 "UserOutlined"
  hidden?: boolean; // 如果为 true，则该路由不生成在菜单中（如 "登录页"、"404页"）
  
  // 权限控制配置
  permission?: PermissionCode; // 访问该路由/看到该菜单需要的权限码
  
  children?: AuthRouteConfig[]; // 子路由/子菜单
}
```

**为什么这样定义？**
在后台管理系统中，我们通常采用 **"路由即菜单"** 的设计模式。一份配置同时用于生成：
1.  **路由表 (`<Routes>`)**：根据 `path` 和 `element` 渲染组件。
2.  **侧边栏菜单 (`<Menu>`)**：根据 `title` 和 `icon` 渲染菜单项。
    *   **title**: 决定了菜单上显示的文字（例如 "用户管理"）。
    *   **icon**: 决定了菜单项前面的小图标。
    *   **permission**: 同时控制了**路由能否访问**以及**菜单是否显示**。

## 2. 创建权限 Context 和 Hook

我们需要一个全局的 Context 来存储当前用户的权限信息，并提供一个 Hook 供组件使用。

创建文件：`src/hooks/usePermission.tsx`

```typescript
import React, { createContext, useContext, useMemo } from 'react';
import { UserPermission, PermissionCode } from '../types/permission';

// 权限上下文（存储当前用户的权限信息）
const PermissionContext = createContext<UserPermission | null>(null);

// 权限Provider（全局包裹App，注入用户权限）
export const PermissionProvider: React.FC<{
  children: React.ReactNode;
  permission: UserPermission;
}> = ({ children, permission }) => {
  return (
    <PermissionContext.Provider value={permission}>
      {children}
    </PermissionContext.Provider>
  );
};

// 核心权限Hook
export const usePermission = () => {
  const permission = useContext(PermissionContext);

  // 判断是否拥有指定权限码
  const hasPermission = useMemo(
    () => (code: PermissionCode) => {
      if (!permission) return false;
      if (!code) return true; // 无权限码则默认可见
      return permission.permissions.includes(code);
    },
    [permission]
  );

  // 过滤带权限的菜单列表
  const filterMenu = useMemo(
    () => {
      const filter = (menus: any[]) => {
        return menus.filter(menu => {
          // 1. 隐藏的菜单直接过滤
          if (menu.hidden) return false;
          // 2. 无权限码则保留
          if (!menu.permission) return true;
          // 3. 有权限码则判断是否拥有
          const hasMenuPermission = hasPermission(menu.permission);
          // 4. 递归处理子菜单
          if (menu.children && menu.children.length > 0) {
            menu.children = filter(menu.children);
          }
          return hasMenuPermission;
        });
      }
      return filter
    },
    [hasPermission]
  );

  return {
    hasPermission,
    filterMenu,
    currentPermission: permission,
  };
};
```

## 3. 实现路由权限守卫 (AuthRoute)

我们需要一个高阶组件（HOC）或封装组件来拦截路由访问。

创建文件：`src/components/AuthRoute.tsx`

```typescript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { PermissionCode } from '../types/permission';

interface AuthRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionCode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requiredPermission }) => {
  const { hasPermission } = usePermission();

  // 如果没有传入权限码，直接放行
  if (!requiredPermission) {
    return <>{children}</>;
  }

  // 检查是否有权限
  if (!hasPermission(requiredPermission)) {
    // 无权限，跳转到 403 页面或登录页
    return <Navigate to="/403" replace />;
  }

  // 有权限，渲染子组件
  return <>{children}</>;
};

export default AuthRoute;
```

## 4. 实现按钮级权限组件 (AuthButton)

对于细粒度的按钮控制，我们可以封装一个 `AuthButton` 组件。

创建文件：`src/components/AuthButton.tsx`

```typescript
import React from 'react';
import { usePermission } from '../hooks/usePermission';
import { PermissionCode } from '../types/permission';

interface AuthButtonProps {
  children: React.ReactNode;
  requiredPermission: PermissionCode;
  fallback?: React.ReactNode; // 无权限时的替代展示（如禁用按钮或空）
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  children, 
  requiredPermission, 
  fallback = null 
}) => {
  const { hasPermission } = usePermission();

  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default AuthButton;
```

## 5. 实现动态菜单渲染 (SidebarMenu)

根据用户的权限，动态生成侧边栏菜单。

创建文件：`src/components/SidebarMenu.tsx`

```typescript
import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import { AuthRouteConfig } from '../types/permission';

interface SidebarMenuProps {
  routes: AuthRouteConfig[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ routes }) => {
  const navigate = useNavigate();
  const { filterMenu } = usePermission();

  // 1. 过滤出用户可见的菜单项
  const visibleRoutes = filterMenu(routes);

  // 2. 将路由配置转换为 Ant Design Menu 的 items 格式
  const menuItems = visibleRoutes.map(route => {
    // 简化处理：这里假设只有一级或二级菜单，实际可递归处理
    if (route.children) {
      return {
        key: route.path,
        icon: route.icon, // 注意：实际项目中需要将字符串图标转换为组件
        label: route.title,
        children: route.children.map(child => ({
          key: child.path,
          label: child.title,
        })),
      };
    }
    return {
      key: route.path,
      icon: route.icon,
      label: route.title,
    };
  });

  return (
    <Menu
      mode="inline"
      theme="dark"
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  );
};

export default SidebarMenu;
```

## 6. 综合使用示例

最后，我们在 `App.tsx` 中将所有内容串联起来。


```typescript
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PermissionProvider } from './hooks/usePermission';
import AuthRoute from './components/AuthRoute';
import AuthButton from './components/AuthButton';
import { Button } from 'antd';

// 模拟从后端获取的用户权限
const mockUserPermission = {
  permissions: ['dashboard:view', 'user:view', 'button:add'],
  roles: ['admin']
};

const Dashboard = () => <h1>仪表盘 (Public)</h1>;
const Users = () => (
  <div>
    <h1>用户管理 (Protected)</h1>
    <AuthButton requiredPermission="button:add" fallback={<Button disabled>无权限新增</Button>}>
      <Button type="primary">新增用户</Button>
    </AuthButton>
    <AuthButton requiredPermission="button:delete">
      <Button danger>删除用户</Button>
    </AuthButton>
  </div>
);
const Forbidden = () => <h1>403 无权限</h1>;

const App: React.FC = () => {
  // 实际项目中，这里应该是在 useEffect 中请求 API 获取权限
  const [permission] = useState(mockUserPermission);

  return (
    <PermissionProvider permission={permission}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* 路由权限保护 */}
          <Route 
            path="/users" 
            element={
              <AuthRoute requiredPermission="user:view">
                <Users />
              </AuthRoute>
            } 
          />
          
          <Route path="/403" element={<Forbidden />} />
        </Routes>
      </BrowserRouter>
    </PermissionProvider>
  );
};

export default App;
```
