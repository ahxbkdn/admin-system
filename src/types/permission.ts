import React from "react";

// 该文件用来定义权限相关的类型
export type PermissionCode = string;

// 定义用户拥有的权限信息 类型
export interface UserPermission{
    permissions:PermissionCode[],  // 用户的权限数组
    roles:string[] // 用户拥有的角色列表
}

// 路由权限信息
export interface AuthRouteConfig{
    path:string,
    element:React.ReactNode,
    title?:string,
    icon?:string,
    permission?:PermissionCode,// 访问该路由需要具备的权限码
    children?:AuthRouteConfig[], 
    hidden?:boolean
}