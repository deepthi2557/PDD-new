import './src/lib/polyfill';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens (Paths match our pages migration roadmap)
import RawLoginScreen from './src/routes/index';
import RawSignupScreen from './src/routes/signup';
import RawHomeScreen from './src/routes/home';
import RawActivityScreen from './src/routes/activity';
import RawChatListScreen from './src/routes/chat.index';
import RawChatDetailsScreen from './src/routes/chat.$id';
import RawLeaderboardScreen from './src/routes/leaderboard';
import RawProfileDetailsScreen from './src/routes/profile.$id';
import RawBookScreen from './src/routes/book';
import RawCommunityScreen from './src/routes/community';
import RawNotificationsScreen from './src/routes/notifications';
import RawVideoScreen from './src/routes/video.$id';
import RawProfileSetupScreen from './src/routes/profile.setup';

// Safe component resolver helper for module interop
const resolveComp = (comp: any): React.ComponentType<any> => {
  if (!comp) return () => <View style={{ flex: 1, backgroundColor: '#FAF9FC' }} />;
  if (typeof comp === 'function') return comp;
  if (comp && comp.default && typeof comp.default === 'function') return comp.default;
  return () => <View style={{ flex: 1, backgroundColor: '#FAF9FC' }} />;
};

const LoginScreen = resolveComp(RawLoginScreen);
const SignupScreen = resolveComp(RawSignupScreen);
const HomeScreen = resolveComp(RawHomeScreen);
const ActivityScreen = resolveComp(RawActivityScreen);
const ChatListScreen = resolveComp(RawChatListScreen);
const ChatDetailsScreen = resolveComp(RawChatDetailsScreen);
const LeaderboardScreen = resolveComp(RawLeaderboardScreen);
const ProfileDetailsScreen = resolveComp(RawProfileDetailsScreen);
const BookScreen = resolveComp(RawBookScreen);
const CommunityScreen = resolveComp(RawCommunityScreen);
const NotificationsScreen = resolveComp(RawNotificationsScreen);
const VideoScreen = resolveComp(RawVideoScreen);
const ProfileSetupScreen = resolveComp(RawProfileSetupScreen);

// Error boundary state interfaces
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7c3aed', padding: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 }}>Application Startup Error</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', marginBottom: 16, textAlign: 'center' }}>
            {String(this.state.error?.message || this.state.error || 'Unknown Error')}
          </Text>
          <ScrollView style={{ width: '100%', maxHeight: 300, backgroundColor: '#ffffff', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#ef4444' }}>
              {String(this.state.error?.stack || '')}
            </Text>
          </ScrollView>
          <TouchableOpacity 
            style={{ marginTop: 24, backgroundColor: '#ffffff', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: 16 }}>Reset App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

// Navigation parameter types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Notifications: undefined;
  Book: { id?: string } | undefined;
  ChatDetails: { id: string };
  ProfileDetails: { id: string };
  Community: undefined;
  VideoDetails: { id: string };
  ProfileSetup: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ActivityTab: undefined;
  ChatTab: undefined;
  LeaderboardTab: undefined;
  ProfileTab: { id: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const queryClient = new QueryClient();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#8b5cf6',
        tabBarInactiveTintColor: '#8C8797',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Rank',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileDetailsScreen}
        initialParams={{ id: 'me' }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9FC' }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer
              fallback={
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7c3aed' }}>
                  <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold' }}>SkillSwap Loading...</Text>
                </View>
              }
            >
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#7c3aed' },
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="Book" component={BookScreen} />
                <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} />
                <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
                <Stack.Screen name="Community" component={CommunityScreen} />
                <Stack.Screen name="VideoDetails" component={VideoScreen} />
                <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: '4%',
    right: '4%',
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    elevation: 4,
    shadowColor: 'rgba(94, 84, 112, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
