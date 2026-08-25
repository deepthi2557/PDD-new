import './src/lib/polyfill';
import React, { useState, createContext, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/routes/login';
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

const queryClient = new QueryClient();

// Navigation Context
export const AppNavigationContext = createContext<{
  navigation: any;
  route: any;
}>({
  navigation: { navigate: () => {}, goBack: () => {} },
  route: { name: 'Login', params: {} },
});

export const useAppNavigation = () => useContext(AppNavigationContext);

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: 24 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#ef4444', marginBottom: 12 }}>Application Startup Error</Text>
          <Text style={{ fontSize: 14, color: '#f8fafc', marginBottom: 16, textAlign: 'center' }}>
            {String(this.state.error?.message || this.state.error || 'Unknown Error')}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 24, backgroundColor: '#7c3aed', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 16 }}
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

export default function App() {
  const [routeStack, setRouteStack] = useState<Array<{ name: string; params?: any }>>([{ name: 'Login' }]);
  const [activeTab, setActiveTab] = useState<'HomeTab' | 'ActivityTab' | 'ChatTab' | 'LeaderboardTab' | 'ProfileTab'>('HomeTab');

  const currentRoute = routeStack[routeStack.length - 1] || { name: 'Login' };

  const navigation = {
    navigate: (routeName: string, params?: any) => {
      if (routeName === 'Main') {
        if (params?.screen) setActiveTab(params.screen);
        setRouteStack([{ name: 'Main', params }]);
      } else if (routeName === 'Login' || routeName === 'Signup') {
        setRouteStack([{ name: routeName, params }]);
      } else {
        setRouteStack(prev => [...prev, { name: routeName, params }]);
      }
    },
    goBack: () => {
      setRouteStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
    },
    setOptions: () => {},
    addListener: () => () => {},
  };

  const route = {
    name: currentRoute.name,
    params: currentRoute.params || {},
  };

  const renderContent = () => {
    switch (currentRoute.name) {
      case 'Login':
        return <LoginScreen navigation={navigation} route={route} />;
      case 'Signup':
        return <SignupScreen navigation={navigation} route={route} />;
      case 'Main':
        return (
          <View style={{ flex: 1, backgroundColor: '#FAF9FC' }}>
            <View style={{ flex: 1 }}>
              {activeTab === 'HomeTab' && <HomeScreen navigation={navigation} route={route} />}
              {activeTab === 'ActivityTab' && <ActivityScreen navigation={navigation} route={route} />}
              {activeTab === 'ChatTab' && <ChatListScreen navigation={navigation} route={route} />}
              {activeTab === 'LeaderboardTab' && <LeaderboardScreen navigation={navigation} route={route} />}
              {activeTab === 'ProfileTab' && <ProfileDetailsScreen navigation={navigation} route={{ ...route, params: { id: 'me' } }} />}
            </View>

            {/* Custom Glassmorphic Tab Bar */}
            <View style={styles.tabBar}>
              <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('HomeTab')}>
                <Text style={{ fontSize: 18, color: activeTab === 'HomeTab' ? '#8b5cf6' : '#8C8797' }}>🏠</Text>
                <Text style={{ fontSize: 10, marginTop: 2, color: activeTab === 'HomeTab' ? '#8b5cf6' : '#8C8797', fontWeight: activeTab === 'HomeTab' ? 'bold' : 'normal' }}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('ActivityTab')}>
                <Text style={{ fontSize: 18, color: activeTab === 'ActivityTab' ? '#8b5cf6' : '#8C8797' }}>📅</Text>
                <Text style={{ fontSize: 10, marginTop: 2, color: activeTab === 'ActivityTab' ? '#8b5cf6' : '#8C8797', fontWeight: activeTab === 'ActivityTab' ? 'bold' : 'normal' }}>Activity</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('ChatTab')}>
                <Text style={{ fontSize: 18, color: activeTab === 'ChatTab' ? '#8b5cf6' : '#8C8797' }}>💬</Text>
                <Text style={{ fontSize: 10, marginTop: 2, color: activeTab === 'ChatTab' ? '#8b5cf6' : '#8C8797', fontWeight: activeTab === 'ChatTab' ? 'bold' : 'normal' }}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('LeaderboardTab')}>
                <Text style={{ fontSize: 18, color: activeTab === 'LeaderboardTab' ? '#8b5cf6' : '#8C8797' }}>🏆</Text>
                <Text style={{ fontSize: 10, marginTop: 2, color: activeTab === 'LeaderboardTab' ? '#8b5cf6' : '#8C8797', fontWeight: activeTab === 'LeaderboardTab' ? 'bold' : 'normal' }}>Rank</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('ProfileTab')}>
                <Text style={{ fontSize: 18, color: activeTab === 'ProfileTab' ? '#8b5cf6' : '#8C8797' }}>👤</Text>
                <Text style={{ fontSize: 10, marginTop: 2, color: activeTab === 'ProfileTab' ? '#8b5cf6' : '#8C8797', fontWeight: activeTab === 'ProfileTab' ? 'bold' : 'normal' }}>Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'Notifications':
        return <NotificationsScreen navigation={navigation} route={route} />;
      case 'Book':
        return <BookScreen navigation={navigation} route={route} />;
      case 'ChatDetails':
        return <ChatDetailsScreen navigation={navigation} route={route} />;
      case 'ProfileDetails':
        return <ProfileDetailsScreen navigation={navigation} route={route} />;
      case 'Community':
        return <CommunityScreen navigation={navigation} route={route} />;
      case 'VideoDetails':
        return <VideoScreen navigation={navigation} route={route} />;
      case 'ProfileSetup':
        return <ProfileSetupScreen navigation={navigation} route={route} />;
      default:
        return <LoginScreen navigation={navigation} route={route} />;
    }
  };

  return (
    <AppNavigationContext.Provider value={{ navigation, route }}>
      <View style={{ flex: 1, backgroundColor: '#FAF9FC' }}>
        <ErrorBoundary>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              {renderContent()}
            </QueryClientProvider>
          </SafeAreaProvider>
        </ErrorBoundary>
      </View>
    </AppNavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
    paddingVertical: 6,
  },
});
