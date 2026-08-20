import './src/lib/polyfill';

import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from './src/lib/supabase';

// Import External Screens
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
  if (!comp) return () => <View style={{ flex: 1, backgroundColor: '#7c3aed' }} />;
  if (typeof comp === 'function') return comp;
  if (comp && comp.default && typeof comp.default === 'function') return comp.default;
  return () => <View style={{ flex: 1, backgroundColor: '#7c3aed' }} />;
};

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

// Inline Login Screen using Native-Safe @expo/vector-icons
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
    <View style={styles.loginRoot}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.loginContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.logoBadge}>
            <Feather name="sparkles" size={28} color="#7c3aed" />
          </View>
          <Text style={styles.brandTitle}>SkillSwap</Text>
          <Text style={styles.brandTagline}>Learn • Teach • Grow Together</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to your account to continue</Text>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>Email or Username</Text>
          <View style={styles.inputBox}>
            <Feather name="mail" size={20} color="#7c3aed" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.textInput}
              editable={!loading}
            />
          </View>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputBox}>
            <Feather name="lock" size={20} color="#7c3aed" style={{ marginRight: 12 }} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.textInput}
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7} disabled={loading}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.disabledBtn]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={styles.btnRow}>
                <Text style={styles.primaryBtnText}>Log In</Text>
                <Feather name="arrow-right" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>

          {/* Quick Demo Bypass Button */}
          <TouchableOpacity
            style={styles.bypassBtn}
            onPress={bypassToApp}
            activeOpacity={0.8}
          >
            <Feather name="check-circle" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.bypassBtnText}>Explore App (Demo Mode)</Text>
          </TouchableOpacity>
        </View>

        {/* Signup Redirect Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text
              style={styles.signupLink}
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
    <View style={{ flex: 1, backgroundColor: '#7c3aed' }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
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
  loginRoot: {
    flex: 1,
    backgroundColor: '#7c3aed',
  },
  loginContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  headerBanner: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 18,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    padding: 0,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c3aed',
  },
  primaryBtn: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  bypassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 12,
  },
  bypassBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  signupLink: {
    color: '#ffffff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
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
