import { useNavigate, useLocation, useParams } from "@tanstack/react-router";

export function useNavigation<T = any>() {
  const navigate = useNavigate();

  return {
    navigate: (screenName: string, params?: Record<string, any>) => {
      const routeMap: Record<string, string> = {
        Login: "/",
        Signup: "/signup",
        Main: "/home",
        HomeTab: "/home",
        ActivityTab: "/activity",
        ChatTab: "/chat",
        LeaderboardTab: "/leaderboard",
        ProfileTab: "/profile/me",
        Notifications: "/notifications",
        Book: "/book",
        Community: "/community",
      };

      if (screenName === "ChatDetails" && params?.id) {
        navigate({ to: "/chat/$id", params: { id: String(params.id) } });
        return;
      }
      if (screenName === "ProfileDetails" && params?.id) {
        navigate({ to: "/profile/$id", params: { id: String(params.id) } });
        return;
      }
      if (screenName === "VideoDetails" && params?.id) {
        navigate({ to: "/video/$id", params: { id: String(params.id) } });
        return;
      }

      const targetPath = routeMap[screenName] || "/home";
      navigate({ to: targetPath });
    },
    goBack: () => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    },
    setOptions: () => {},
    addListener: () => () => {},
  };
}

export function useRoute<T = any>(): { params: T; name: string } {
  const location = useLocation();
  const routeParams = useParams({ strict: false });

  return {
    params: {
      ...((location.search as Record<string, any>) || {}),
      ...(routeParams || {}),
    } as T,
    name: location.pathname,
  };
}

export function NavigationContainer({ children }: { children?: React.ReactNode; [key: string]: any }) {
  return children as any;
}

type NavigatorProps = {
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: any;
  [key: string]: any;
};

type ScreenProps = {
  name?: string;
  component?: any;
  options?: any;
  initialParams?: any;
  children?: React.ReactNode;
  [key: string]: any;
};

export function createNativeStackNavigator<T = any>() {
  return {
    Navigator: ({ children }: NavigatorProps) => children as any,
    Screen: ({ children }: ScreenProps) => children as any,
  };
}

export function createBottomTabNavigator<T = any>() {
  return {
    Navigator: ({ children }: NavigatorProps) => children as any,
    Screen: ({ children }: ScreenProps) => children as any,
  };
}
