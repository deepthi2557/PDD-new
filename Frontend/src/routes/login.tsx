import { createFileRoute } from '../lib/router-bridge';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export const Route = (createFileRoute as any)('/login')({
  component: Login,
});

export default function Login(props: any) {
  const hookNavigation = useNavigation<any>();
  const navigation = props?.navigation || hookNavigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async () => {
    setEmailError(false);
    setPasswordError(false);

    if (!email.trim()) {
      setEmailError(true);
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setPasswordError(true);
      setErrorMessage('Please enter your password');
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
    <SafeAreaView style={styles.rootView}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.logoBadge}>
            <Text style={{ fontSize: 32 }}>✨</Text>
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
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.fieldLabel}>Email or Username</Text>
          <View style={[styles.inputBox, emailError && styles.inputBoxError]}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>📧</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={(text: string) => { setEmail(text); setEmailError(false); setErrorMessage(''); }}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.textInput}
              editable={!loading}
            />
          </View>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={[styles.inputBox, passwordError && styles.inputBoxError]}>
            <Text style={{ fontSize: 18, marginRight: 10 }}>🔒</Text>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={(text: string) => { setPassword(text); setPasswordError(false); setErrorMessage(''); }}
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
                <Text style={{ color: '#ffffff', fontSize: 16, marginLeft: 8 }}>➜</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Quick Demo Bypass Button */}
          <TouchableOpacity
            style={styles.bypassBtn}
            onPress={bypassToApp}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, marginRight: 8, color: '#ffffff' }}>⚡</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
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
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e1b4b',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 22,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
  inputBoxError: {
    borderColor: '#ef4444',
    backgroundColor: '#fff5f5',
  },
  inputIcon: {
    marginRight: 12,
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
    color: '#64748b',
  },
  signupLink: {
    color: '#7c3aed',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
