import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Search, Bell, ChevronDown, Star, MessageCircle, CalendarPlus, ShieldCheck, Flame, Trophy } from 'lucide-react-native';
import { categories, sortOptions, searchSuggestions, type Mentor } from '../lib/data';
import { fetchMentors } from '../lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home')({
  component: Home,
});

export default function Home() {
  const navigation = useNavigation<any>();
  const [cat, setCat] = useState('Programming');
  const [sort, setSort] = useState('Top Rated');
  const [sortOpen, setSortOpen] = useState(false);
  const [mentorsList, setMentorsList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Hi, Alex 👋</Text>
          <Text style={styles.headerTitle}>Explore Skills</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <Bell color="#342F3D" size={20} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
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
          onPress={() => navigation.navigate('Book')}
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
});
