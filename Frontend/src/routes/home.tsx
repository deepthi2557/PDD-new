import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Search, Bell, ChevronDown, Star, MessageCircle, CalendarPlus, ShieldCheck, Flame, Trophy, Sparkles, X } from 'lucide-react-native';
import { categories, sortOptions, searchSuggestions, type Mentor } from '../lib/data';
import { fetchMentors, fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/home')({
  component: Home,
});

export default function Home() {
  const navigation = useNavigation<any>();
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Top Rated');
  const [sortOpen, setSortOpen] = useState(false);
  const [mentorsList, setMentorsList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        fetchMentorById(user.id)
          .then((profileData) => {
            setCurrentUser(profileData);
          })
          .catch(() => {
            setCurrentUser({
              id: user.id,
              name: user.user_metadata?.full_name || 'Learner',
              avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.email}`
            });
          });
      }
    });
  }, []);

  // Double-matching states
  const [doubleMatches, setDoubleMatches] = useState<Mentor[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [myProfile, setMyProfile] = useState<any>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMentors({
      name: search,
      tag: cat,
    })
      .then((data) => {
        if (active) {
          let sorted = [...data];
          if (sort === 'Top Rated') {
            sorted.sort((a, b) => b.rating - a.rating);
          } else if (sort === 'Newest') {
            sorted.sort((a, b) => b.followers - a.followers);
          } else if (sort === 'Most Active') {
            sorted.sort((a, b) => b.sessions - a.sessions);
          }
          setMentorsList(sorted);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cat, search, sort]);

  // Load my profile & find double matches
  React.useEffect(() => {
    try {
      let profile = JSON.parse(localStorage.getItem('my_profile') || 'null');
      if (!profile) {
        profile = {
          id: 'my-mock-user',
          name: 'Alex',
          expertise: 'Full-Stack Coding',
          teaches: 2,
          tags: ['React', 'Node', 'TypeScript'],
          interests: ['Python', 'Figma', 'AI', 'Communication']
        };
        localStorage.setItem('my_profile', JSON.stringify(profile));
      }
      setMyProfile(profile);
    } catch (e) {
      console.error(e);
    }
  }, []);

  React.useEffect(() => {
    if (!myProfile || mentorsList.length === 0) return;
    
    const myTeaches = myProfile.tags || ['React', 'TypeScript', 'Node'];
    const myInterests = myProfile.interests || ['Python', 'Figma', 'AI', 'Communication'];

    const matches = mentorsList.filter((m) => {
      const peerTeachesInterest = m.tags.some((tag: string) => 
        myInterests.some((interest: string) => tag.toLowerCase().includes(interest.toLowerCase()))
      );

      const peerLearningNeeds: Record<string, string[]> = {
        'aria-shah': ['React', 'TypeScript'],
        'leo-park': ['TypeScript', 'Node'],
        'maya-iyer': ['Python', 'Figma'],
        'noah-fields': ['React', 'Node'],
        'sara-kim': ['Figma', 'React'],
        'ravi-mehta': ['TypeScript', 'React']
      };
      
      const needs = peerLearningNeeds[m.id] || ['React', 'TypeScript'];
      const peerWantsMyTeaches = needs.some((n: string) => 
        myTeaches.some((t: string) => t.toLowerCase().includes(n.toLowerCase()))
      );

      return peerTeachesInterest && peerWantsMyTeaches;
    });

    setDoubleMatches(matches);
  }, [myProfile, mentorsList]);

  const renderDoubleMatchBanner = () => {
    if (doubleMatches.length === 0) return null;
    return (
      <View style={styles.matchBannerContainer}>
        <View style={styles.matchBannerHeader}>
          <Sparkles color="#ffffff" size={16} fill="#ffffff" />
          <Text style={styles.matchBannerTitle}>Perfect Double-Matches Found!</Text>
        </View>
        <Text style={styles.matchBannerText}>
          We found {doubleMatches.length} peers who want to learn your skills and can teach yours.
        </Text>
        <TouchableOpacity 
          style={styles.matchBannerBtn} 
          onPress={() => setShowMatchModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.matchBannerBtnText}>View Double-Matches</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDoubleMatchModal = () => {
    if (!showMatchModal) return null;
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.matchModalCard}>
          <View style={styles.modalHeaderRow}>
            <Text style={styles.modalTitleText}>✨ Smart Double-Matches</Text>
            <TouchableOpacity onPress={() => setShowMatchModal(false)} style={styles.closeBtn}>
              <X color="#342F3D" size={20} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {doubleMatches.map((peer) => {
              const myTeaches = myProfile?.tags || ['React', 'Node'];
              const peerTeaches = peer.tags;
              
              return (
                <View key={peer.id} style={styles.matchPeerCard}>
                  <View style={styles.matchCardTop}>
                    <Image source={{ uri: peer.avatar }} style={styles.matchAvatar} />
                    <View style={styles.matchMeta}>
                      <Text style={styles.matchPeerName}>{peer.name}</Text>
                      <Text style={styles.matchExpertise}>{peer.expertise}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.matchSplitContainer}>
                    <View style={styles.matchSplitCol}>
                      <Text style={styles.splitLabel}>You Learn From Them:</Text>
                      <View style={styles.splitTagsRow}>
                        {peerTeaches.slice(0, 2).map((t) => (
                          <View key={t} style={[styles.splitTag, styles.learnTag]}>
                            <Text style={styles.splitTagText}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.matchSplitCol}>
                      <Text style={styles.splitLabel}>They Learn From You:</Text>
                      <View style={styles.splitTagsRow}>
                        {myTeaches.slice(0, 2).map((t: string) => (
                          <View key={t} style={[styles.splitTag, styles.teachTag]}>
                            <Text style={styles.splitTagText}>{t}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.startSwapBtn}
                    onPress={() => {
                      setShowMatchModal(false);
                      navigation.navigate('ChatDetails', { id: peer.id });
                    }}
                    activeOpacity={0.8}
                  >
                    <MessageCircle color="#ffffff" size={16} style={{ marginRight: 6 }} />
                    <Text style={styles.startSwapBtnText}>Start Skill Swap</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Hi, {currentUser ? currentUser.name : 'Learner'} 👋</Text>
          <Text style={styles.headerTitle}>Explore Skills</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.7}
          >
            <Bell color="#342F3D" size={20} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          {currentUser && (
            <TouchableOpacity
              style={styles.myProfileButton}
              onPress={() => navigation.navigate('ProfileDetails', { id: currentUser.id })}
              activeOpacity={0.7}
            >
              <Image source={{ uri: currentUser.avatar }} style={styles.myProfileAvatar} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search color="#8C8797" size={20} style={styles.searchIcon} />
        <TextInput
          placeholder="Search skills, mentors..."
          placeholderTextColor="#8C8797"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Search Suggestions List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        style={styles.horizontalScrollWrapper}
      >
        {searchSuggestions.map((s) => (
          <TouchableOpacity key={s} style={styles.suggestionBadge} activeOpacity={0.7}>
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Double Match Recommendation Banner */}
      {renderDoubleMatchBanner()}

      {/* Sorting Selector */}
      <View style={styles.sortWrapper}>
        <TouchableOpacity
          onClick={() => setSortOpen(!sortOpen)}
          onPress={() => setSortOpen(!sortOpen)}
          style={styles.sortButton}
          activeOpacity={0.7}
        >
          <Text style={styles.sortLabel}>
            Sort: <Text style={styles.sortValue}>{sort}</Text>
          </Text>
          <ChevronDown color="#8b5cf6" size={16} />
        </TouchableOpacity>

        {sortOpen && (
          <View style={styles.dropdownContainer}>
            {sortOptions.map((o) => (
              <TouchableOpacity
                key={o}
                onPress={() => {
                  setSort(o);
                  setSortOpen(false);
                }}
                style={[
                  styles.dropdownItem,
                  sort === o ? styles.dropdownItemActive : null,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    sort === o ? styles.dropdownItemTextActive : null,
                  ]}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Categories Scroller */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        style={styles.horizontalScrollWrapper}
      >
        {categories.map((c) => {
          const active = c === cat;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCat(c)}
              style={[
                styles.categoryBadge,
                active ? styles.categoryBadgeActive : styles.categoryBadgeInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  active ? styles.categoryTextActive : styles.categoryTextInactive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mentors Card List */}
      <View style={styles.cardList}>
        {loading ? (
          <ActivityIndicator size="large" color="#8b5cf6" style={{ marginVertical: 32 }} />
        ) : mentorsList.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#8C8797', marginVertical: 32 }}>
            No mentors found matching your search.
          </Text>
        ) : (
          mentorsList.map((m) => <MentorCard key={m.id} m={m} />)
        )}
      </View>
      {renderDoubleMatchModal()}
    </ScrollView>
  );
}

const statusColor = {
  online: '#22C55E',
  busy: '#F59E0B',
  offline: '#9CA3AF',
};

const badgeIcon = {
  'Verified Mentor': ShieldCheck,
  'Top Contributor': Trophy,
  'Trending Mentor': Flame,
};

export function calculateMatchScore(mentorTags: string[]): number {
  const myInterests = ['Python', 'React', 'Figma', 'Communication', 'Calculus', 'TypeScript', 'TensorFlow'];
  const matches = mentorTags.filter(tag => myInterests.includes(tag)).length;
  if (matches > 0) {
    return Math.min(65 + matches * 10, 98);
  }
  return 55 + (mentorTags.length % 3) * 8;
}

export function MentorCard({ m }: { m: Mentor }) {
  const navigation = useNavigation<any>();
  const Icon = badgeIcon[m.badge];
  const unavailable = m.status === 'offline';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Avatar Image container */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: m.avatar }} style={styles.avatar} />
          <View style={[styles.statusDot, { backgroundColor: statusColor[m.status] }]} />
        </View>

        {/* Mentor Info */}
        <View style={styles.infoWrapper}>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.mentorName} numberOfLines={1}>{m.name}</Text>
              <Text style={styles.mentorExpertise} numberOfLines={1}>
                {m.expertise} · {m.level}
              </Text>
            </View>
            <View style={styles.ratingBox}>
              <Star color="#F59E0B" size={14} fill="#F59E0B" />
              <Text style={styles.ratingText}>{m.rating}</Text>
            </View>
          </View>
          <Text style={styles.mentorReviews} numberOfLines={1}>
            Teaches {m.teaches} skills · {m.reviews} reviews
          </Text>
        </View>
      </View>

      {/* Tags List */}
      <View style={styles.tagsContainer}>
        {m.tags.map((t) => (
          <View key={t} style={styles.tag}>
            <Text style={styles.tagText}>{t}</Text>
          </View>
        ))}
      </View>

      {/* Badges and Mode */}
      <View style={styles.badgesContainer}>
        <View style={styles.badgeMatch}>
          <Sparkles color="#8b5cf6" size={11} style={styles.badgeIcon} />
          <Text style={styles.badgeMatchText}>{calculateMatchScore(m.tags)}% Match</Text>
        </View>
        <View style={styles.badgeMint}>
          <Icon color="#22C55E" size={12} style={styles.badgeIcon} />
          <Text style={styles.badgeMintText}>{m.badge}</Text>
        </View>
        <View style={styles.badgeBlue}>
          <Text style={styles.badgeBlueText}>
            {m.mode === 'Online' ? '🎥' : m.mode === 'Offline' ? '📍' : '🔄'} {m.mode}
          </Text>
        </View>
        <View style={styles.badgeLavender}>
          <Text style={styles.badgeLavenderText}>{m.confidence}</Text>
        </View>
      </View>

      {/* Unavailable Banner */}
      {unavailable && (
        <View style={styles.unavailableBanner}>
          <Text style={styles.unavailableText}>⚠️ Currently Unavailable</Text>
        </View>
      )}

      {/* Call to Actions */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileDetails', { id: m.id })}
          activeOpacity={0.7}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('ChatDetails', { id: m.id })}
          activeOpacity={0.7}
        >
          <MessageCircle color="#342F3D" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.bookButton,
            unavailable ? styles.bookButtonDisabled : styles.bookButtonActive,
          ]}
          disabled={unavailable}
          onPress={() => navigation.navigate('Book', { id: m.id })}
          activeOpacity={0.7}
        >
          <CalendarPlus color={unavailable ? '#8C8797' : '#ffffff'} size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 110,
    backgroundColor: '#FAF9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerWelcome: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6',
  },
  searchContainer: {
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#342F3D',
    padding: 0,
  },
  horizontalScrollWrapper: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  suggestionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#342F3D',
  },
  sortWrapper: {
    zIndex: 20,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#342F3D',
    marginRight: 8,
  },
  sortValue: {
    color: '#8b5cf6',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    width: 220,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 8,
    shadowColor: 'rgba(94, 84, 112, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 5,
    zIndex: 30,
  },
  dropdownItem: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  dropdownItemActive: {
    backgroundColor: '#8b5cf6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#342F3D',
  },
  dropdownItemTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryBadgeInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  categoryBadgeActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextInactive: {
    color: '#342F3D',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  cardList: {
    width: '100%',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FAF9FC',
  },
  statusDot: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  mentorExpertise: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#342F3D',
    marginLeft: 4,
  },
  mentorReviews: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(196, 181, 253, 0.4)',
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#5E5470',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 6,
  },
  badgeMint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167, 243, 208, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeMintText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#065F46',
  },
  badgeBlue: {
    backgroundColor: 'rgba(191, 219, 254, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeBlueText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1E40AF',
  },
  badgeLavender: {
    backgroundColor: 'rgba(233, 213, 255, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeLavenderText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B21B6',
  },
  badgeMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  badgeMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  unavailableBanner: {
    marginTop: 12,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  unavailableText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  profileButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonActive: {
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  bookButtonDisabled: {
    backgroundColor: '#E8E5EC',
  },
  matchBannerContainer: {
    backgroundColor: '#8b5cf6',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  matchBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  matchBannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  matchBannerText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
    marginBottom: 16,
  },
  matchBannerBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  matchBannerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  matchModalCard: {
    width: '92%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    shadowColor: 'rgba(94, 84, 112, 0.2)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 36,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    flexGrow: 0,
  },
  matchPeerCard: {
    backgroundColor: '#FAF9FC',
    borderWidth: 1,
    borderColor: '#F3F0F6',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  matchCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  matchAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8E5EC',
  },
  matchMeta: {
    flex: 1,
  },
  matchPeerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  matchExpertise: {
    fontSize: 11,
    color: '#8C8797',
    marginTop: 2,
  },
  matchSplitContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  matchSplitCol: {
    flex: 1,
  },
  splitLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8C8797',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  splitTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  splitTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  learnTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  teachTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  splitTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5E5470',
  },
  startSwapBtn: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  startSwapBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myProfileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#8b5cf6',
    overflow: 'hidden',
  },
  myProfileAvatar: {
    width: '100%',
    height: '100%',
  },
});
