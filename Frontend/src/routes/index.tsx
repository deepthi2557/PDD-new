import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/')({
  component: Login,
});

export default function Login() {
  const navigation = useNavigation<any>();
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

      // Preserves routing behavior: navigate to main App navigation structure
      navigation.navigate('Main');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        }
      });
      if (error) {
        setErrorMessage(error.message);
        Alert.alert('Google Sign-In Error', error.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAF9FC' }} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* Brand Logo Header */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Sparkles color="#ffffff" size={24} />
        </View>
        <Text style={styles.logoText}>SkillSwap</Text>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Welcome back</Text>
        <Text style={styles.welcomeSubtitle}>Sign in to keep learning and teaching</Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <Mail color="#8C8797" size={20} style={styles.inputIcon} />
          <TextInput
            placeholder="Email or phone"
            placeholderTextColor="#8C8797"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color="#8C8797" size={20} style={styles.inputIcon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#8C8797"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            editable={!loading}
          />
        </View>

        <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7} disabled={loading}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Log in</Text>
              <ArrowRight color="#ffffff" size={16} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Signup Redirection */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>
          New here?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('Signup')}
          >
            Create account
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAF9FC',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
    marginRight: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },
  welcomeContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#8C8797',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#342F3D',
    padding: 0, // Reset default padding
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8b5cf6',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E5EC',
  },
  dividerText: {
    fontSize: 12,
    color: '#8C8797',
    paddingHorizontal: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 16,
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#342F3D',
    marginLeft: 12,
  },
  signupContainer: {
    alignItems: 'center',
    paddingTop: 32,
  },
  signupText: {
    fontSize: 14,
    color: '#8C8797',
  },
  signupLink: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
