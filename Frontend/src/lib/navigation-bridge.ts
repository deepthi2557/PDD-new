import { useNavigate, useLocation, useParams } from "@tanstack/react-router";

export function useIsFocused() {
  return true;
}

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
        ProfileSetup: "/profile/setup",
      };

      let targetScreen = screenName;
      if (screenName === "Main" && params?.screen) {
        targetScreen = params.screen;
      }

      if (targetScreen === "ChatDetails" && params?.id) {
        navigate({ to: "/chat/$id", params: { id: String(params.id) } });
        return;
      }
      if (targetScreen === "ProfileDetails" && params?.id) {
        navigate({ to: "/profile/$id", params: { id: String(params.id) } });
        return;
      }
      if (targetScreen === "VideoDetails" && params?.id) {
        navigate({ to: "/video/$id", params: { id: String(params.id) } });
        return;
      }
      if (targetScreen === "Book") {
        if (params?.id) {
          localStorage.setItem('selected_mentor_id', String(params.id));
          navigate({ to: "/book", search: { id: params.id } as any });
        } else {
          navigate({ to: "/book" });
        }
        return;
      }

      const targetPath = routeMap[targetScreen] || "/home";
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

  let searchObj: Record<string, any> = {};
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => {
      searchObj[key] = value;
    });
  }

  return {
    params: {
      ...searchObj,
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
