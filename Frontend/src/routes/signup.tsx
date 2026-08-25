import { createFileRoute } from '../lib/router-bridge';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, User, Phone, Mail, Lock, GraduationCap, BookOpen, Brain, Award, Camera } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'mentor', label: 'Mentor', icon: Award },
  { id: 'learner', label: 'Learner', icon: BookOpen },
  { id: 'expert', label: 'Expert', icon: Brain },
];

const categoriesWithCourses = {
  Programming: ["Python", "React", "Node.js", "TypeScript", "Java", "C++"],
  Design: ["Figma", "Prototyping", "Illustrator", "Photoshop", "UI/UX Basics"],
  Business: ["Project Management", "Startup Strategy", "Marketing", "Sales"],
  Communication: ["Public Speaking", "Technical Writing", "Storytelling"],
  Mathematics: ["Calculus", "Linear Algebra", "Statistics"],
  AI: ["TensorFlow", "PyTorch", "Prompt Engineering", "Machine Learning"],
  Languages: ["Spanish", "French", "German", "Japanese"]
};

export default function Signup() {
  const navigation = useNavigation<any>();
  const [role, setRole] = useState('student');
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<keyof typeof categoriesWithCourses>('Programming');
  const fileInputRef = React.useRef<any>(null);
  const [uploading, setUploading] = useState(false);

  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  const triggerFileSelect = () => {
    if (typeof document !== 'undefined' && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // On mobile environment, toggle default avatar
      setFormState(prev => ({ ...prev, avatarUrl: prev.avatarUrl ? '' : DEFAULT_AVATAR }));
    }
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormState(prev => ({ ...prev, avatarUrl: publicUrl }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMessage(err.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSignup = async () => {
    const { name, phone, email, password, confirmPassword, avatarUrl } = formState;

    if (!name || !phone || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage('Please select at least one skill/course');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const finalAvatar = (avatarUrl && avatarUrl.trim().length > 0) 
      ? avatarUrl 
      : DEFAULT_AVATAR;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            role: role,
            tags: selectedSkills,
            avatar_url: finalAvatar,
          },
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        Alert.alert('Signup Error', error.message);
        return;
      }

      if (data.session || data.user) {
        Alert.alert('Success', 'Account created successfully! Please configure your profile and skills.');
        navigation.navigate('ProfileSetup');
      } else {
        Alert.alert('Success', 'Registration successful! Please configure your profile.');
        navigation.navigate('ProfileSetup');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
        onPress={() => {
          if (navigation && navigation.navigate) {
            navigation.navigate('Login');
          } else if (navigation && navigation.goBack) {
            navigation.goBack();
          }
        }}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#8C8797" size={16} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Start your skill exchange journey</Text>

      {/* Form Fields */}
      <View style={styles.form}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}



        {/* Profile Image Picker */}
        <View style={styles.avatarPickerContainer}>
          <TouchableOpacity 
            style={styles.avatarPickerFrame} 
            onPress={triggerFileSelect} 
            activeOpacity={0.8}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#8b5cf6" size="small" />
            ) : formState.avatarUrl ? (
              <Image source={{ uri: formState.avatarUrl }} style={styles.avatarPreview} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Camera color="#8C8797" size={32} />
                <Text style={styles.avatarPlaceholderText}>Upload</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.avatarLabel}>
            {formState.avatarUrl ? 'Profile Picture Set ✓' : 'Upload Profile Picture (Optional)'}
          </Text>
          <View style={styles.urlInputContainer}>
            <TextInput
              placeholder="Or paste image URL directly..."
              placeholderTextColor="#8C8797"
              value={formState.avatarUrl || ''}
              onChangeText={(val: string) => setFormState(prev => ({ ...prev, avatarUrl: val }))}
              style={styles.urlInput}
              editable={!loading}
            />
          </View>
        </View>

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
                onChangeText={(val: string) => setFormState(prev => ({ ...prev, [f.key]: val }))}
                style={styles.input}
                editable={!loading}
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

        {/* Skills Selection Dropdown/Pills Board */}
        <View style={styles.skillsSectionContainer}>
          <Text style={styles.skillsTitle}>Select your skills</Text>
          <Text style={styles.skillsSubtitle}>Choose multiple courses to list on your profile</Text>

          {/* Categories Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {Object.keys(categoriesWithCourses).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCurrentCategory(cat as any)}
                style={[
                  styles.catTab,
                  currentCategory === cat ? styles.catTabActive : styles.catTabInactive,
                ]}
              >
                <Text
                  style={[
                    styles.catTabText,
                    currentCategory === cat ? styles.catTabTextActive : styles.catTabTextInactive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sub-courses Grid */}
          <View style={styles.coursesGrid}>
            {categoriesWithCourses[currentCategory].map((course) => {
              const isSelected = selectedSkills.includes(course);
              return (
                <TouchableOpacity
                  key={course}
                  onPress={() => {
                    if (isSelected) {
                      setSelectedSkills(prev => prev.filter(x => x !== course));
                    } else {
                      setSelectedSkills(prev => [...prev, course]);
                    }
                  }}
                  style={[
                    styles.courseCard,
                    isSelected ? styles.courseCardActive : styles.courseCardInactive,
                  ]}
                >
                  <Text style={[styles.courseText, isSelected ? styles.courseTextActive : styles.courseTextInactive]}>
                    {isSelected ? '✓ ' : ''}{course}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selected Skills Pills */}
          {selectedSkills.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.selectedLabel}>Selected Courses ({selectedSkills.length}):</Text>
              <View style={styles.pillsRow}>
                {selectedSkills.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    onPress={() => setSelectedSkills(prev => prev.filter(x => x !== skill))}
                    style={styles.pill}
                  >
                    <Text style={styles.pillText}>{skill} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSignup} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Create account</Text>
          )}
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
  avatarPickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  urlInputContainer: {
    width: '100%',
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: 'rgba(94, 84, 112, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  urlInput: {
    fontSize: 12,
    color: '#342F3D',
    padding: 0,
    textAlign: 'center',
  },
  avatarPickerFrame: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 2,
    borderColor: '#E8E5EC',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8C8797',
    marginTop: 4,
  },
  avatarLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5E5470',
    marginTop: 8,
  },
  skillsSectionContainer: {
    marginTop: 24,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
    marginBottom: 2,
  },
  skillsSubtitle: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 12,
  },
  catScroll: {
    marginBottom: 12,
  },
  catTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  catTabActive: {
    backgroundColor: '#8b5cf6',
  },
  catTabInactive: {
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  catTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  catTabTextActive: {
    color: '#ffffff',
  },
  catTabTextInactive: {
    color: '#5E5470',
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  courseCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  courseCardActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  courseCardInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  courseText: {
    fontSize: 12,
    fontWeight: '600',
  },
  courseTextActive: {
    color: '#8b5cf6',
  },
  courseTextInactive: {
    color: '#5E5470',
  },
  selectedContainer: {
    marginBottom: 16,
  },
  selectedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#E8E5EC',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5E5470',
  },
});
