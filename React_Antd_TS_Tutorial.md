# React + Ant Design + TypeScript 项目实战教程

本教程基于当前项目，详细讲解如何构建一个基于 React 19、TypeScript、Vite 和 Ant Design 6 的后台管理系统雏形。

## 1. 技术栈

-   **构建工具**: [Vite](https://vitejs.dev/)
-   **前端框架**: [React](https://react.dev/) (v19)
-   **编程语言**: [TypeScript](https://www.typescriptlang.org/)
-   **UI 组件库**: [Ant Design](https://ant.design/) (v6)
-   **路由管理**: [React Router](https://reactrouter.com/) (v7)
-   **状态管理**: React Context API

## 2. 项目初始化

如果你是从零开始，可以使用 Vite 快速创建一个 React + TypeScript 项目：

```bash
# 创建项目
npm create vite@latest admin-system -- --template react-ts

# 进入项目目录
cd admin-system

# 安装依赖
npm install
```

### 安装项目所需依赖

安装 Ant Design、图标库和路由：

```bash
npm install antd @ant-design/icons react-router-dom
```

## 3. 项目结构

建议的目录结构如下：

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件 (Layout, Header, etc.)
├── contexts/        # 全局上下文 (Context)
├── pages/           # 页面组件 (Dashboard, Users, etc.)
├── App.tsx          # 根组件
├── main.tsx         # 入口文件
└── vite-env.d.ts    # Vite 类型定义
```

## 4. 核心功能实现

### 4.1 入口文件配置 (`src/main.tsx`)

配置 `BrowserRouter` 用于路由管理，并使用 `StrictMode` 包裹应用。

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

### 4.2 全局状态管理 - ThemeContext (`src/contexts/ThemeContext.tsx`)

使用 Context API 实现主题切换，并结合 TypeScript 定义类型安全接口。

```tsx
import { createContext, useContext, useState, ReactNode } from "react";

// 定义 Context 的数据类型
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

// 创建 Context 并提供默认值
const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { }
})

interface ThemeProviderProps {
    children: ReactNode;
}

// Provider 组件
export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<string>("light");

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 自定义 Hook 方便使用
export function useTheme(){
    return useContext(ThemeContext)
}
```

### 4.3 布局组件 - Ant Design Layout (`src/components/MainLayout.tsx`)

使用 Ant Design 的 `Layout` 和 `Menu` 组件构建侧边栏布局。注意 TypeScript 类型的使用。

```tsx
import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

// 定义菜单项类型助手函数
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', '/', <PieChartOutlined />),
  getItem('Users', '/users', <UserOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer } } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Menu 
            theme="dark" 
            defaultSelectedKeys={['/']} 
            selectedKeys={[location.pathname]}
            mode="inline" 
            items={items} 
            onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '16px' }}>
          {/* Outlet 用于渲染子路由 */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
```

### 4.4 数据展示页面 - Ant Design Table (`src/pages/Users.tsx`)

使用 TypeScript 定义表格列（`ColumnsType`）和数据源（`DataType`）的类型。

```tsx
import React from 'react';
import { Table, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// 定义数据类型接口
interface DataType {
  key: string;
  name: string;
  age: number;
  tags: string[];
}

// 定义列配置，泛型指定为 DataType
const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  // ... 其他列
];

const data: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, tags: ['developer'] },
];

const Users: React.FC = () => {
  return (
    <div>
      <h2>Users Management</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Users;
```

### 4.5 路由配置与组件组合 (`src/App.tsx`)

虽然当前 `App.tsx` 主要是为了演示 Context 的使用，但通常我们会在这里配置路由。

```tsx
import React from 'react';
import Child from './components/Child';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Child />
    </ThemeProvider>
  );
};

export default App;
```

*注意：如果需要启用完整路由，可以将 `App.tsx` 中的 `<ThemeProvider>` 替换为 `<Routes>` 配置，如代码注释所示。*

## 5. 运行与构建

### 开发模式

```bash
npm run dev
```

### 构建生产版本

TypeScript 项目构建时会先进行类型检查 (`tsc -b`)。

```bash
npm run build
```

## 6. TypeScript 开发技巧

1.  **组件 Props 类型**: 总是为组件 Props 定义接口。
    ```tsx
    interface MyComponentProps {
        title: string;
        isActive?: boolean; // 可选属性
    }
    const MyComponent: React.FC<MyComponentProps> = ({ title, isActive }) => { ... }
    ```

2.  **事件处理类型**: React 提供了丰富的事件类型。
    ```tsx
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    }
    ```

3.  **Ant Design 类型**: 从 `antd` 或子路径导入组件特定的类型（如 `ColumnsType`, `MenuProps`），这能提供极好的代码补全和类型检查。
