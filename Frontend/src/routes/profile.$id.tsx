import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Star, MessageCircle, CalendarPlus, UserPlus, Award, Send, CheckCircle2, X } from 'lucide-react-native';
import { mentors, getReviewsForMentor, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';
import { VITE_API_URL } from '../lib/env';

export const Route = createFileRoute('/profile/$id')({
  component: Profile,
});

export function calculateMatchScore(mentorTags: string[]): number {
  const myInterests = ['Python', 'React', 'Figma', 'Communication', 'Calculus', 'TypeScript', 'TensorFlow'];
  const matches = mentorTags.filter(tag => myInterests.includes(tag)).length;
  if (matches > 0) {
    return Math.min(65 + matches * 10, 98);
  }
  return 55 + (mentorTags.length % 3) * 8;
}

const badgesList = [
  { name: 'Top Mentor', icon: '🌟', desc: 'Maintained a rating above 4.8 for 50+ completed swap sessions.' },
  { name: 'Consistent', icon: '🔥', desc: 'Completed at least 3 swaps per week for 4 consecutive weeks.' },
  { name: 'Skill Expert', icon: '🏆', desc: 'Highest verified knowledge score in their subject area.' },
  { name: 'Friendly Helper', icon: '🤝', desc: 'Earned 95%+ positive recommendations from learners.' }
];

export default function Profile() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; desc: string; icon: string } | null>(null);

  const [following, setFollowing] = useState(false);
  const [localFollowers, setLocalFollowers] = useState(0);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editExpertise, setEditExpertise] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLevel, setEditLevel] = useState('Intermediate');
  const [editMode, setEditMode] = useState('Online');
  const [editTagsStr, setEditTagsStr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editError, setEditError] = useState('');

  const isOwnProfile = currentUserId && m && currentUserId === m.id;

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        setCurrentUserId(user.id);
      }
    });
  }, []);

  React.useEffect(() => {
    if (m) {
      setEditName(m.name || '');
      setEditExpertise(m.expertise || '');
      setEditBio(m.bio || '');
      setEditLevel(m.level || 'Intermediate');
      setEditMode(m.mode || 'Online');
      setEditTagsStr(m.tags ? m.tags.join(', ') : '');
    }
  }, [m]);

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editExpertise.trim() || !editTagsStr.trim()) {
      setEditError('Name, Expertise and Skills are required.');
      return;
    }
    setSavingProfile(true);
    setEditError('');

    try {
      const skillsArray = editTagsStr.split(',').map(s => s.trim()).filter(Boolean);
      
      // 1. Update Supabase users
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: editName.trim(),
          expertise: editExpertise.trim(),
          bio: editBio.trim(),
          level: editLevel,
          mode: editMode,
          teaches: skillsArray.length
        })
        .eq('id', m!.id);

      if (userError) throw userError;

      // 2. Update Supabase user_tags
      await supabase.from('user_tags').delete().eq('user_id', m!.id);
      const tagsToInsert = skillsArray.map(tag => ({
        user_id: m!.id,
        tag: tag
      }));
      await supabase.from('user_tags').insert(tagsToInsert);

      // 3. Update Spring Boot Backend PUT endpoint
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (token) {
        await fetch(`${VITE_API_URL}/api/mentors/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: editName.trim(),
            expertise: editExpertise.trim(),
            bio: editBio.trim(),
            level: editLevel,
            mode: editMode,
            teaches: skillsArray.length,
            avatarUrl: m!.avatar || ''
          })
        });
      }

      // Update local state to reflect change immediately
      setM((prev: any) => prev ? {
        ...prev,
        name: editName.trim(),
        expertise: editExpertise.trim(),
        bio: editBio.trim(),
        level: editLevel as any,
        mode: editMode as any,
        tags: skillsArray,
        teaches: skillsArray.length
      } : null);

      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || 'Failed to save changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  React.useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchMentorById(id)
      .then((data) => {
        if (active) {
          setM(data);
          setLocalFollowers(data.followers);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          const fallback = mentors.find((x) => x.id === id) || mentors[0];
          setM(fallback);
          setLocalFollowers(fallback.followers);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewText, setReviewText] = useState('');

  const isSessionCompleted = () => {
    if (!m || !m.name) return false;
    try {
      const bookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      return bookings.some((b: any) => {
        const matchesMentor = (b.with && b.with.toLowerCase() === m.name.toLowerCase()) || (b.mentorId === m.id);
        return matchesMentor && b.status === 'completed';
      });
    } catch (e) {
      return false;
    }
  };

  if (loading || !m) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 400 }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.headerHero}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#342F3D" size={16} style={styles.backIcon} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: m.avatar }} style={styles.avatar} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.name}>{m.name}</Text>
              <Text style={styles.expertise} numberOfLines={1}>{m.expertise}</Text>
            </View>
          </View>

          <Text style={styles.bio}>{m.bio}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <Stat label="Sessions" value={m.sessions} />
            <Stat label="Followers" value={localFollowers} />
            <Stat label="Rating" value={m.rating} />
          </View>

          {/* Compatibility Details */}
          <View style={styles.matchDetailRow}>
            <View style={styles.matchMeterOuter}>
              <View style={[styles.matchMeterInner, { width: `${calculateMatchScore(m.tags)}%` }]} />
            </View>
            <Text style={styles.matchDetailText}>
              ⚡ {calculateMatchScore(m.tags)}% Compatibility Match based on your learning interests!
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionsRow}>
            {isOwnProfile ? (
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => setEditModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.editProfileBtnText}>Edit Profile Details</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.chatBtn}
                  onPress={() => navigation.navigate('ChatDetails', { id: m.id })}
                  activeOpacity={0.7}
                >
                  <MessageCircle color="#342F3D" size={16} style={styles.btnIcon} />
                  <Text style={styles.chatBtnText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => navigation.navigate('Book', { id: m.id })}
                  activeOpacity={0.7}
                >
                  <CalendarPlus color="#ffffff" size={16} style={styles.btnIcon} />
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.followBtn, following && styles.followBtnActive]}
                  onPress={() => {
                    if (following) {
                      setLocalFollowers((prev) => prev - 1);
                    } else {
                      setLocalFollowers((prev) => prev + 1);
                    }
                    setFollowing(!following);
                  }}
                  activeOpacity={0.7}
                >
                  <UserPlus color={following ? '#ffffff' : '#342F3D'} size={16} style={styles.btnIcon} />
                  <Text style={[styles.followBtnText, following && styles.followBtnTextActive]}>
                    {following ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Can teach section */}
        <Section title="Can teach">
          <View style={styles.chipRow}>
            {m.tags.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </View>
        </Section>

        {/* Wants to learn section */}
        <Section title="Wants to learn">
          <View style={styles.chipRow}>
            <Chip>Product Strategy</Chip>
            <Chip>Spanish</Chip>
            <Chip>Music Theory</Chip>
          </View>
        </Section>

        {/* Experience & Certifications */}
        <Section title="Experience & Certifications">
          <View style={styles.certsContainer}>
            <Cert title="ML Engineer · NovaLabs" sub="2021 — Present" />
            <Cert title="Google ML Specialization" sub="Certified · 2022" />
          </View>
        </Section>

        {/* Achievements */}
        <Section title="Achievements">
          <View style={styles.chipRow}>
            {badgesList.map((badge) => (
              <TouchableOpacity
                key={badge.name}
                onPress={() => setSelectedBadge(badge)}
                activeOpacity={0.7}
              >
                <Badge>{badge.icon} {badge.name}</Badge>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Availability Calendar */}
        <Section title="Availability">
          <View style={styles.calendarGrid}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const active = [1, 3, 5].includes(i);
              return (
                <View key={i} style={styles.calendarColumn}>
                  <Text style={styles.calendarDayText}>{d}</Text>
                  <View
                    style={[
                      styles.calendarDateBox,
                      active ? styles.dateBoxActive : styles.dateBoxInactive,
                    ]}
                  >
                    <Text style={[styles.calendarDateText, active ? styles.dateTextActive : styles.dateTextInactive]}>
                      {i + 12}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Section>

        {/* Reviews Section */}
        <Section title="Reviews">
          <View style={styles.reviewsList}>
            {getReviewsForMentor(m.id).map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewUser}>
                    <Text style={styles.reviewUserName}>{r.user}</Text>
                    <Text style={styles.reviewDate}>{r.date} ago</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        color="#F59E0B"
                        size={10}
                        fill={idx < r.rating ? '#F59E0B' : 'transparent'}
                        style={styles.starIcon}
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Leave Review Form */}
        {isSessionCompleted() && (
          <Section title="Leave a review">
            {submitted ? (
              <View style={styles.submittedCard}>
                <CheckCircle2 color="#22C55E" size={20} style={styles.submittedIcon} />
                <Text style={styles.submittedText}>Feedback Submitted Successfully</Text>
              </View>
            ) : (
              <View style={styles.formCard}>
                <View style={styles.ratingFormRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <TouchableOpacity key={n} onPress={() => setRating(n)} activeOpacity={0.7}>
                      <Star
                        color="#F59E0B"
                        size={28}
                        fill={n <= rating ? '#F59E0B' : 'transparent'}
                        style={styles.formStarIcon}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder="Share your experience..."
                  placeholderTextColor="#8C8797"
                  multiline
                  numberOfLines={3}
                  style={styles.reviewInput}
                />
                <TouchableOpacity style={styles.submitReviewBtn} onPress={() => setSubmitted(true)} activeOpacity={0.7}>
                  <Send color="#ffffff" size={16} style={styles.btnIcon} />
                  <Text style={styles.submitReviewText}>Submit Review</Text>
                </TouchableOpacity>
              </View>
            )}
          </Section>
        )}
      </View>

      {/* Achievements Info Modal */}
      {selectedBadge && (
        <View style={styles.badgeModalOverlay}>
          <View style={styles.badgeModalCard}>
            <Text style={styles.badgeModalIcon}>{selectedBadge.icon}</Text>
            <Text style={styles.badgeModalTitle}>{selectedBadge.name}</Text>
            <Text style={styles.badgeModalDesc}>{selectedBadge.desc}</Text>
            <TouchableOpacity
              style={styles.badgeCloseBtn}
              onPress={() => setSelectedBadge(null)}
            >
              <Text style={styles.badgeCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.editModalContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.editModalHeader}>
            <Text style={styles.editModalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.editModalClose}>
              <X color="#342F3D" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
              placeholderTextColor="#8C8797"
              style={styles.formInput}
            />

            <Text style={styles.inputLabel}>Expertise Header</Text>
            <TextInput
              value={editExpertise}
              onChangeText={setEditExpertise}
              placeholder="e.g. Full-Stack Developer"
              placeholderTextColor="#8C8797"
              style={styles.formInput}
            />

            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              value={editBio}
              onChangeText={setEditBio}
              placeholder="Tell others about yourself..."
              placeholderTextColor="#8C8797"
              multiline
              numberOfLines={4}
              style={[styles.formInput, { height: 100, textAlignVertical: 'top' }]}
            />

            <Text style={styles.inputLabel}>Experience Level</Text>
            <View style={styles.pickerRow}>
              {['Beginner Friendly', 'Intermediate', 'Expert'].map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setEditLevel(lvl)}
                  style={[styles.pickerBtn, editLevel === lvl && styles.pickerBtnActive]}
                >
                  <Text style={[styles.pickerBtnText, editLevel === lvl && styles.pickerBtnTextActive]}>
                    {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Mentorship Mode</Text>
            <View style={styles.pickerRow}>
              {['Online', 'Offline', 'Hybrid'].map((md) => (
                <TouchableOpacity
                  key={md}
                  onPress={() => setEditMode(md)}
                  style={[styles.pickerBtn, editMode === md && styles.pickerBtnActive]}
                >
                  <Text style={[styles.pickerBtnText, editMode === md && styles.pickerBtnTextActive]}>
                    {md}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Teaching Skills (comma-separated)</Text>
            <TextInput
              value={editTagsStr}
              onChangeText={setEditTagsStr}
              placeholder="React, TypeScript, Node.js"
              placeholderTextColor="#8C8797"
              style={styles.formInput}
            />

            {editError ? <Text style={styles.editErrorText}>{editError}</Text> : null}

            <TouchableOpacity 
              style={[styles.saveProfileBtn, savingProfile && { opacity: 0.7 }]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveProfileBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{children}</Text>
    </View>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
}

function Cert({ title, sub }: { title: string; sub: string }) {
  return (
    <View style={styles.certCard}>
      <View style={styles.certIconBox}>
        <Award color="#ffffff" size={20} />
      </View>
      <View style={styles.certInfo}>
        <Text style={styles.certTitle}>{title}</Text>
        <Text style={styles.certSub}>{sub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FAF9FC',
    paddingBottom: 40,
  },
  matchDetailRow: {
    marginTop: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  matchMeterOuter: {
    height: 6,
    backgroundColor: '#E8E5EC',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 8,
  },
  matchMeterInner: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 99,
  },
  matchDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  badgeModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 47, 61, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  badgeModalCard: {
    width: 300,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.25)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 8,
  },
  badgeModalIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  badgeModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 8,
  },
  badgeModalDesc: {
    fontSize: 13,
    color: '#8C8797',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  badgeCloseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
  },
  badgeCloseText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  headerHero: {
    height: 140,
    backgroundColor: '#ebdfff', // mapped from gradient-hero colors
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  backIcon: {
    marginRight: 4,
  },
  backText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#342F3D',
  },
  profileSection: {
    paddingHorizontal: 20,
  },
  mainCard: {
    marginTop: -64,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 16,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: -48,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#F3F0F6',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
    paddingBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  expertise: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: '#8C8797',
    lineHeight: 20,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 20,
  },
  statContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  statLabel: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  chatBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  bookBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  btnIcon: {
    marginRight: 6,
  },
  followBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  followBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  followBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  followBtnTextActive: {
    color: '#ffffff',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#342F3D',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(167, 243, 208, 0.4)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#065F46',
  },
  certsContainer: {
    width: '100%',
    gap: 8,
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
  },
  certIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  certInfo: {
    flex: 1,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  certSub: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  calendarColumn: {
    alignItems: 'center',
    flex: 1,
  },
  calendarDayText: {
    fontSize: 10,
    color: '#8C8797',
    marginBottom: 4,
  },
  calendarDateBox: {
    width: '85%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBoxInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dateBoxActive: {
    backgroundColor: '#8b5cf6',
  },
  calendarDateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateTextInactive: {
    color: '#342F3D',
  },
  dateTextActive: {
    color: '#ffffff',
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F0F6',
    marginRight: 10,
  },
  reviewUser: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  reviewDate: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#8C8797',
    marginTop: 8,
    lineHeight: 18,
  },
  submittedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
  },
  submittedIcon: {
    marginRight: 8,
  },
  submittedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#342F3D',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  ratingFormRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  formStarIcon: {
    marginHorizontal: 2,
  },
  reviewInput: {
    backgroundColor: 'rgba(243, 240, 246, 0.5)',
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: '#342F3D',
    textAlignVertical: 'top',
    height: 80,
  },
  submitReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 12,
  },
  submitReviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  editProfileBtn: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(139, 92, 246, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  editProfileBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  editModalContainer: {
    padding: 24,
    backgroundColor: '#FAF9FC',
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 16,
  },
  editModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  editModalClose: {
    padding: 8,
  },
  editForm: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5E5470',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: -4,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: '#342F3D',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  pickerBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5E5470',
  },
  pickerBtnTextActive: {
    color: '#ffffff',
  },
  editErrorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  saveProfileBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: 'rgba(139, 92, 246, 0.35)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  saveProfileBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
