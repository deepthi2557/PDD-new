import './src/lib/polyfill';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useState, Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './src/lib/supabase';

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

// Fallback loader component
const ScreenFallback = () => (
  <View style={{ flex: 1, backgroundColor: '#FAF9FC', justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator color="#7c3aed" size="large" />
  </View>
);

// Pure Native Zero-Dependency Login Screen
function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        Alert.alert('Login Error', error.message);
        return;
      }

      if (navigation && navigation.navigate) {
        navigation.navigate('Main');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const bypassToApp = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Main');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9FC' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Banner */}
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: '#f3e8ff',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              elevation: 4,
              shadowColor: '#7c3aed',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 36 }}>✨</Text>
          </View>
          <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#1e1b4b', letterSpacing: 0.5 }}>
            SkillSwap
          </Text>
          <Text style={{ fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '500' }}>
            Learn • Teach • Grow Together
          </Text>
        </View>

        {/* Form Card */}
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 28,
            padding: 24,
            elevation: 8,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 1,
            shadowRadius: 20,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 4 }}>
            Welcome Back 👋
          </Text>
          <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            Sign in to your account to continue
          </Text>

          {errorMessage ? (
            <View
              style={{
                backgroundColor: '#fef2f2',
                borderWidth: 1,
                borderColor: '#fecaca',
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: '#dc2626', fontSize: 13, textAlign: 'center', fontWeight: '500' }}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 }}>
            Email or Username
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              borderWidth: 1.5,
              borderColor: '#cbd5e1',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>📧</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ flex: 1, fontSize: 15, color: '#0f172a', padding: 0 }}
              editable={!loading}
            />
          </View>

          <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 }}>
            Password
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              borderWidth: 1.5,
              borderColor: '#cbd5e1',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 10 }}>🔒</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{ flex: 1, fontSize: 15, color: '#0f172a', padding: 0 }}
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 20 }} activeOpacity={0.7} disabled={loading}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#7c3aed' }}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#7c3aed',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 4,
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>Log In</Text>
                <Text style={{ color: '#ffffff', fontSize: 16, marginLeft: 8 }}>➜</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Quick Demo Bypass Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              borderRadius: 16,
              paddingVertical: 15,
              marginTop: 12,
            }}
            onPress={bypassToApp}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, marginRight: 8, color: '#ffffff' }}>⚡</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#ffffff' }}>
              Explore App (Demo Mode)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Signup Redirect Footer */}
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontSize: 14, color: '#64748b' }}>
            Don't have an account?{' '}
            <Text
              style={{ color: '#7c3aed', fontWeight: 'bold', textDecorationLine: 'underline' }}
              onPress={() => navigation && navigation.navigate('Signup')}
            >
              Create Account
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
          <ScrollView style={{ width: '100%', maxHeight: 300, backgroundColor: '#1e293b', borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#f87171' }}>
              {String(this.state.error?.stack || '')}
            </Text>
          </ScrollView>
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
            <NavigationContainer initialState={undefined}>
              <Stack.Navigator
                initialRouteName="Main"
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: '#FAF9FC' },
                }}
              >
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
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
