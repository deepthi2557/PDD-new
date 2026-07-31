import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, Phone, Mail, Lock, GraduationCap, BookOpen, Brain, Award } from 'lucide-react-native';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'mentor', label: 'Mentor', icon: Award },
  { id: 'learner', label: 'Learner', icon: BookOpen },
  { id: 'expert', label: 'Expert', icon: Brain },
];

export default function Signup() {
  const navigation = useNavigation<any>();
  const [role, setRole] = useState('student');
  const [formState, setFormState] = useState<Record<string, string>>({});

  const handleSignup = () => {
    navigation.navigate('Main');
  };

  const fields = [
    { key: 'name', icon: User, ph: 'Full name', secure: false, keyboard: 'default' as const },
    { key: 'phone', icon: Phone, ph: 'Phone number', secure: false, keyboard: 'phone-pad' as const },
    { key: 'email', icon: Mail, ph: 'Email', secure: false, keyboard: 'email-address' as const },
    { key: 'password', icon: Lock, ph: 'Password', secure: true, keyboard: 'default' as const },
    { key: 'confirmPassword', icon: Lock, ph: 'Confirm password', secure: true, keyboard: 'default' as const },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#8C8797" size={16} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start your skill exchange journey</Text>

      {/* Form Fields */}
      <View style={styles.form}>
        {fields.map((f, i) => {
          const Icon = f.icon;
          return (
            <View key={i} style={styles.inputContainer}>
              <Icon color="#8C8797" size={20} style={styles.inputIcon} />
              <TextInput
                placeholder={f.ph}
                placeholderTextColor="#8C8797"
                secureTextEntry={f.secure}
                keyboardType={f.keyboard}
                autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                value={formState[f.key] || ''}
                onChangeText={(val) => setFormState(prev => ({ ...prev, [f.key]: val }))}
                style={styles.input}
              />
            </View>
          );
        })}

        {/* Joining As Selection */}
        <View style={styles.roleSelectionContainer}>
          <Text style={styles.roleTitle}>I'm joining as</Text>
          <View style={styles.grid}>
            {roles.map((r) => {
              const active = role === r.id;
              const Icon = r.icon;
              return (
                <TouchableOpacity
                  key={r.id}
                  onPress={() => setRole(r.id)}
                  activeOpacity={0.8}
                  style={[
                    styles.roleCard,
                    active ? styles.roleCardActive : styles.roleCardInactive,
                  ]}
                >
                  <Icon color={active ? '#ffffff' : '#5E5470'} size={24} />
                  <Text style={[styles.roleLabel, active ? styles.roleLabelActive : styles.roleLabelInactive]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSignup} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Create account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAF9FC',
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  backIcon: {
    marginRight: 6,
  },
  backText: {
    fontSize: 14,
    color: '#8C8797',
    fontWeight: '500',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8C8797',
    marginBottom: 24,
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
    marginBottom: 12,
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
    padding: 0,
  },
  roleSelectionContainer: {
    marginTop: 16,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleCard: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  roleCardInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  roleCardActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  roleLabelInactive: {
    color: '#5E5470',
  },
  roleLabelActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
