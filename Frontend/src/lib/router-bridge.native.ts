// Custom local mock for react-router on native platforms to prevent startup evaluation crashes.
const noopRoute = (path?: any) => (config?: any) => {
  const routeObj = {
    path,
    component: config?.component,
    useRouteContext: () => ({ queryClient: null }),
    update: (opts: any) => ({ ...routeObj, ...opts }),
  };
  return routeObj;
};

export const createFileRoute = (path?: any) => noopRoute(path);
export const createRootRoute = () => noopRoute();
export const createRootRouteWithContext = () => () => noopRoute();
export const createRouter = (config: any) => ({
  ...config,
  subscribe: () => () => {},
  state: { location: { pathname: '/' } },
});
export const Link = ({ children }: any) => children || null;
export const Outlet = ({ children }: any) => children || null;
export const HeadContent = () => null;
export const Scripts = () => null;
export const useSearch = () => ({});
export const useParams = () => ({});
export const useNavigate = () => () => {};
export const useLocation = () => ({ pathname: '/' });
export const useRouter = () => ({ invalidate: () => {}, navigate: () => {} });
export const useRouteContext = () => ({ queryClient: null });
