// Custom local mock for react-router on native platforms to prevent startup evaluation crashes.
export function createFileRoute(path: string) {
  return function(config: any) {
    const routeObj = {
      path,
      component: config?.component,
      useRouteContext: () => ({ queryClient: null }),
      update: (opts: any) => ({ ...routeObj, ...opts }),
    };
    return routeObj;
  };
}

export function createRootRouteWithContext() {
  return function(config: any) {
    return {
      useRouteContext: () => ({ queryClient: null }),
      _addFileChildren: (children: any) => ({
        _addFileTypes: () => ({}),
      }),
      ...config,
    };
  };
}

export function createRootRoute(config: any) {
  return {
    useRouteContext: () => ({ queryClient: null }),
    _addFileChildren: (children: any) => ({
      _addFileTypes: () => ({}),
    }),
    ...config,
  };
}

export function createRouter(config: any) {
  return {
    ...config,
    subscribe: () => () => {},
    state: { location: { pathname: '/' } },
  };
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}

export function Outlet({ children }: any) {
  return children || null;
}

export function useRouter() {
  return {
    invalidate: () => {},
    navigate: () => {},
  };
}

export function useRouteContext() {
  return {};
}

export function Link({ children }: any) {
  return children || null;
}

export const useSearch = () => ({});
export const useParams = () => ({});
export const useNavigate = () => () => {};
export const useLocation = () => ({ pathname: '' });
