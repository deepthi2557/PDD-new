import './src/lib/polyfill';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens (Paths match our pages migration roadmap)
import LoginScreen from './src/routes/index';
import SignupScreen from './src/routes/signup';
import HomeScreen from './src/routes/home';
import ActivityScreen from './src/routes/activity';
import ChatListScreen from './src/routes/chat.index';
import ChatDetailsScreen from './src/routes/chat.$id';
import LeaderboardScreen from './src/routes/leaderboard';
import ProfileDetailsScreen from './src/routes/profile.$id';
import BookScreen from './src/routes/book';
import CommunityScreen from './src/routes/community';
import NotificationsScreen from './src/routes/notifications';
import VideoScreen from './src/routes/video.$id';
import ProfileSetupScreen from './src/routes/profile.setup';

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9FC', padding: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ef4444', marginBottom: 12 }}>Application Error</Text>
          <Text style={{ fontSize: 14, color: '#8C8797', marginBottom: 16, textAlign: 'center' }}>
            A rendering crash occurred during startup.
          </Text>
          <ScrollView style={{ width: '100%', maxHeight: 300, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E8E5EC', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 12, color: '#ef4444', fontWeight: 'bold', marginBottom: 8 }}>
              {String(this.state.error?.message || this.state.error || 'Unknown Error')}
            </Text>
            <Text style={{ fontFamily: 'monospace', fontSize: 10, color: '#342F3D' }}>
              {String(this.state.error?.stack || '')}
            </Text>
          </ScrollView>
          <TouchableOpacity 
            style={{ marginTop: 24, backgroundColor: '#8b5cf6', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Reset App</Text>
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

// Custom Bottom Tab Bar representing the MobileShell.tsx design
import { Home, Calendar, MessageCircle, Trophy, User } from 'lucide-react-native';

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
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ActivityTab"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <MessageCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Rank',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <Trophy color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileDetailsScreen}
        initialParams={{ id: 'me' }}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => <User color={color} size={size} />,
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
                  <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold' }}>SkillSwap Loading...</Text>
                </View>
              }
            >
              <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FAF9FC' },
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
