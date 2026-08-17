// Custom local mock for react-router on native platforms to prevent startup evaluation crashes.
export function createFileRoute(path: string) {
  return function(config: any) {
    return {
      path,
      component: config.component,
    };
  };
}

export function Link({ children }: any) {
  return children;
}

export const useSearch = () => ({});
export const useParams = () => ({});
export const useNavigate = () => () => {};
export const useLocation = () => ({ pathname: '' });
