import React, { createContext, useContext, useMemo } from "react";
import { AuthRouteConfig, PermissionCode, UserPermission } from "../types/permission";


export const PermissionContext = createContext<UserPermission | null>(null);

// 导出一个权限Provider，通过这个Provider给后代组件传递数据
export const PermissionProvider: React.FC<{
    children: React.ReactNode,
    permission: UserPermission
}> = ({ children, permission }) => {
    return (
        <PermissionContext.Provider value={permission}>
            {children}
        </PermissionContext.Provider>
    );
}

// 封装一个权限校验的hook
export const usePermission = () => {
    //1. 先取出用户拥有的权限列表
    const context = useContext(PermissionContext);

    //2. 封装权限校验的函数
    const hasPermission = (code: PermissionCode) => {
        return context?.permissions.includes(code)
    }

    //3. 过滤带权限的菜单
    const filterMenu = useMemo(() => {
        const filter = (menus: any[]) => {
            // 遍历所有的菜单
            return menus.filter((menu: AuthRouteConfig) => {
                // 如果菜单是隐藏的，就不显示
                if (menu.hidden) return false;

                if (!menu.permission) return true;

                // 执行到这里，说明有权限标识符,判断一下是否有权限
                const hasMenuPermission = hasPermission(menu.permission)
                
                // 还需要递归遍历子菜单
                if (menu.children && menu.children.length > 0) {
                    menu.children = filter(menu.children)
                }

                return hasMenuPermission;
            })

        }

        return filter;
    }, [hasPermission])


    return {
        hasPermission,
        filterMenu,
        context
    }

}