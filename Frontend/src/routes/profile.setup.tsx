import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ArrowRight, BookOpen, CheckCircle, Plus, X } from 'lucide-react-native';
import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/profile/setup')({
  component: ProfileSetup,
});

const categoriesWithSkills = {
  "Software & Technology": [
    "Python Software Development",
    "React Front-End Engineering",
    "Node.js Back-End Development",
    "TypeScript Web Programming",
    "Cyber Security & Networking",
    "SQL Database Administration",
    "Docker & Cloud DevOps"
  ],
  "Business & Management": [
    "Agile Product Management",
    "Lean Startup Strategy",
    "Corporate Financial Analysis",
    "Sales & Business Development",
    "Project Management (PMP)"
  ],
  "Creative Arts & Design": [
    "Figma UI/UX Design",
    "Blender 3D Graphics",
    "Adobe Graphic Design",
    "Video Editing & Motion Graphics",
    "Digital Illustration"
  ],
  "Marketing & Writing": [
    "SEO Content Optimization",
    "Growth Hacking & Analytics",
    "Digital Advertising & PPC",
    "Technical Writing",
    "Copywriting & Email Marketing"
  ],
  "Languages & Academics": [
    "ESL English Teaching",
    "Conversational Spanish",
    "Mandarin Chinese",
    "Calculus & Linear Algebra",
    "Statistical Data Analysis"
  ],
  "Health & Wellness": [
    "Yoga & Breathwork Instruction",
    "Strength & Weight Training",
    "Diet & Nutrition Coaching",
    "Mindfulness & Meditation"
  ]
} as const;

type CategoryType = keyof typeof categoriesWithSkills;

export default function ProfileSetup() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Profile Form States
  const [expertise, setExpertise] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [bio, setBio] = useState('');
  const [mode, setMode] = useState<'Online' | 'Offline' | 'Both'>('Online');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Dropdown States
  const [category, setCategory] = useState<CategoryType>("Software & Technology");
  const [subSkill, setSubSkill] = useState<string>(categoriesWithSkills["Software & Technology"][0]);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);

  // Update default sub-skill when category changes
  useEffect(() => {
    setSubSkill(categoriesWithSkills[category][0]);
  }, [category]);

  const addSkill = () => {
    if (!selectedSkills.includes(subSkill)) {
      setSelectedSkills(prev => [...prev, subSkill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSaveProfile = async () => {
    if (!expertise.trim()) {
      setErrorMessage('Please enter your primary expertise title.');
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage('Please select and add at least one skill.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;

      if (currentUserId) {
        // 1. Update Supabase users table
        const { error: userError } = await supabase
          .from('users')
          .update({
            expertise: expertise.trim(),
            level: level,
            bio: bio.trim(),
            mode: mode,
            reviews: 0,
            teaches: selectedSkills.length
          })
          .eq('id', currentUserId);

        if (userError) console.warn('Supabase profile update warning:', userError);

        // 2. Update Supabase tags table
        await supabase.from('user_tags').delete().eq('user_id', currentUserId);
        const tagsToInsert = selectedSkills.map(tag => ({
          user_id: currentUserId,
          tag: tag
        }));
        const { error: tagsError } = await supabase.from('user_tags').insert(tagsToInsert);
        if (tagsError) console.warn('Supabase tags insert warning:', tagsError);
      }

      // 3. Update Spring Boot profile PUT endpoint
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        if (token) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/mentors/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              expertise: expertise.trim(),
              level: level,
              bio: bio.trim(),
              mode: mode,
              reviews: 0,
              teaches: selectedSkills.length
            })
          });
        }
      } catch (err) {
        console.warn('Backend server profile PUT fail:', err);
      }

      // 4. Update LocalStorage profile to enable live display updates
      const localProfile = {
        id: currentUserId || 'my-mock-user',
        name: user?.user_metadata?.full_name || 'Alex',
        avatar: user?.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex',
        expertise: expertise.trim(),
        level: level,
        teaches: selectedSkills.length,
        rating: 5.0,
        reviews: 0,
        status: 'online',
        tags: selectedSkills,
        badge: 'New Mentor',
        mode: mode,
        confidence: 'High',
        bio: bio.trim(),
        trustScore: 100,
        completion: 100,
        positive: 100,
        followers: 0,
        sessions: 0
      };
      localStorage.setItem('my_profile', JSON.stringify(localProfile));

      // Append to local mentors list so they show up on cards
      const mentorsList = JSON.parse(localStorage.getItem('chats_mentors') || '[]');
      const updatedMentors = [localProfile, ...mentorsList.filter((m: any) => m.id !== localProfile.id)];
      localStorage.setItem('chats_mentors', JSON.stringify(updatedMentors));

      Alert.alert('Success', 'Profile setup complete!');
      navigation.navigate('Main');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Complete Setup</Text>
      <Text style={styles.subtitle}>Update your expertise and categories of skills</Text>

      <View style={styles.form}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Expertise Title */}
        <Text style={styles.label}>Primary Expertise Title</Text>
        <TextInput
          placeholder="e.g. Senior Frontend Architect, Data Scientist"
          placeholderTextColor="#8C8797"
          value={expertise}
          onChangeText={setExpertise}
          style={styles.input}
        />

        {/* Level */}
        <Text style={styles.label}>Experience Level</Text>
        <View style={styles.levelRow}>
          {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((l) => {
            const active = level === l;
            return (
              <TouchableOpacity
                key={l}
                onPress={() => setLevel(l)}
                style={[styles.levelBtn, active ? styles.levelBtnActive : styles.levelBtnInactive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.levelText, active ? styles.textActive : styles.textInactive]}>
                  {l}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category Dropdown Selection */}
        <Text style={styles.label}>Select Skill Category</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => {
            setCatDropdownOpen(!catDropdownOpen);
            setSubDropdownOpen(false);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownValue}>{category}</Text>
          <ChevronDown color="#5E5470" size={16} />
        </TouchableOpacity>

        {catDropdownOpen && (
          <View style={styles.dropdownContainer}>
            {(Object.keys(categoriesWithSkills) as CategoryType[]).map((catName) => (
              <TouchableOpacity
                key={catName}
                onPress={() => {
                  setCategory(catName);
                  setCatDropdownOpen(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{catName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Subseries Dropdown Selection */}
        <Text style={styles.label}>Select Sub-Skill (Subseries)</Text>
        <TouchableOpacity 
          style={styles.dropdownSelector} 
          onPress={() => {
            setSubDropdownOpen(!subDropdownOpen);
            setCatDropdownOpen(false);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.dropdownValue}>{subSkill}</Text>
          <ChevronDown color="#5E5470" size={16} />
        </TouchableOpacity>

        {subDropdownOpen && (
          <View style={styles.dropdownContainer}>
            {categoriesWithSkills[category].map((skillName) => (
              <TouchableOpacity
                key={skillName}
                onPress={() => {
                  setSubSkill(skillName);
                  setSubDropdownOpen(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{skillName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Add Skill Button */}
        <TouchableOpacity style={styles.addSkillBtn} onPress={addSkill} activeOpacity={0.8}>
          <Plus color="#ffffff" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.addSkillBtnText}>Add Skill to List</Text>
        </TouchableOpacity>

        {/* Display Added Skills */}
        {selectedSkills.length > 0 && (
          <View style={styles.skillsWrapper}>
            <Text style={styles.skillsSectionTitle}>Added Skills ({selectedSkills.length})</Text>
            <View style={styles.pillsRow}>
              {selectedSkills.map((skill) => (
                <View key={skill} style={styles.pill}>
                  <Text style={styles.pillText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)} style={styles.pillRemove}>
                    <X color="#8b5cf6" size={12} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Session Exchange Mode */}
        <Text style={styles.label}>Preferred Exchange Mode</Text>
        <View style={styles.levelRow}>
          {['Online', 'Offline', 'Both'].map((m) => {
            const active = mode === m;
            return (
              <TouchableOpacity
                key={m}
                onPress={() => setMode(m as any)}
                style={[styles.levelBtn, active ? styles.levelBtnActive : styles.levelBtnInactive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.levelText, active ? styles.textActive : styles.textInactive]}>
                  {m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Short Bio */}
        <Text style={styles.label}>Profile Bio</Text>
        <TextInput
          placeholder="Briefly describe your background, interest, or what you want to achieve..."
          placeholderTextColor="#8C8797"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

        {/* Save button */}
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSaveProfile} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Save & Enter Dashboard</Text>
              <ArrowRight color="#ffffff" size={16} style={{ marginLeft: 6 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 40,
    backgroundColor: '#FAF9FC',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8797',
    marginBottom: 28,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#342F3D',
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#342F3D',
    marginBottom: 12,
    shadowColor: 'rgba(94, 84, 112, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  textArea: {
    textAlignVertical: 'top',
    height: 100,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  levelBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  textActive: {
    color: '#ffffff',
  },
  textInactive: {
    color: '#342F3D',
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  dropdownValue: {
    fontSize: 14,
    color: '#342F3D',
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    maxHeight: 180,
    overflow: 'scroll',
    marginBottom: 12,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.02)',
  },
  dropdownItemText: {
    fontSize: 13,
    color: '#342F3D',
  },
  addSkillBtn: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  addSkillBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  skillsWrapper: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  skillsSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C8797',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 99,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
  },
  pillText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  pillRemove: {
    marginLeft: 6,
    padding: 2,
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
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
});
