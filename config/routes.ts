import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject extends RouteObject {
  // 查看页面权限, 透传给组件，为了精细化控制组件无权限时的行为
  access?: string[];
  // 组件是否需要懒加载, 需要给useRouters组件外层加上Suspense
  defer?: boolean;
  // 重定向, 覆盖element元素
  redirect?: string;
  // 菜单栏是否隐藏, 默认为false
  hidden?: boolean;
  // 菜单栏标题
  title?: string;
  // 子路由
  children?: CustomRouteObject[];

  // 当element和redirect同时存在时，忽略redirect
}

const routesConfig: CustomRouteObject[] = [
  // Primary Auth 处理权限, 让Primary Layout懒加载, 避免无权限时不必要的加载
  {
    path: '/*',
    element: '@/layout/PrimaryAuth.tsx',
    access: ['user'],
    children: [
      {
        path: '*',
        element: '@/layout/PrimaryLayout.tsx',
        defer: true,
      },
    ],
  },
  {
    element: '@/layout/PublicLayout.tsx',
    children: [
      {
        path: '/login',
        element: '@/pages/Login/index.tsx',
        defer: true,
      },
      {
        path: '/reset',
        element: '@/pages/Reset/index.tsx',
        defer: true,
      },
    ],
  },
];
export default routesConfig;
