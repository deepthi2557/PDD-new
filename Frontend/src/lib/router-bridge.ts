import { Platform } from 'react-native';

let bridge: any;

if (Platform.OS === 'web') {
  try {
    bridge = require('@tanstack/react-router');
  } catch (e) {
    bridge = null;
  }
}

if (!bridge) {
  const noopRoute = (path?: any) => (config?: any) => {
    const routeObj = {
      path,
      component: config?.component,
      useRouteContext: () => ({ queryClient: null }),
      update: (opts: any) => ({ ...routeObj, ...opts }),
    };
    return routeObj;
  };

  bridge = {
    createFileRoute: (path?: any) => noopRoute(path),
    createRootRoute: () => noopRoute(),
    createRootRouteWithContext: () => () => noopRoute(),
    createRouter: (config: any) => ({
      ...config,
      subscribe: () => () => {},
      state: { location: { pathname: '/' } },
    }),
    Link: ({ children }: any) => children || null,
    Outlet: ({ children }: any) => children || null,
    HeadContent: () => null,
    Scripts: () => null,
    useSearch: () => ({}),
    useParams: () => ({}),
    useNavigate: () => () => {},
    useLocation: () => ({ pathname: '/' }),
    useRouter: () => ({ invalidate: () => {}, navigate: () => {} }),
    useRouteContext: () => ({ queryClient: null }),
  };
}

export const {
  createFileRoute,
  Link,
  useSearch,
  useParams,
  useNavigate,
  useLocation,
  createRootRouteWithContext,
  createRootRoute,
  createRouter,
  HeadContent,
  Scripts,
  Outlet,
  useRouter,
  useRouteContext,
} = bridge;
