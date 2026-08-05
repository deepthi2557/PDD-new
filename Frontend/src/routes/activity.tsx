import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Star, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react-native';
import { activity, mentors, type Mentor } from '../lib/data';
import { fetchMentors } from '../lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/activity')({
  component: Activity,
});

const tabs = ['Learning', 'Teaching', 'Upcoming', 'Completed'] as const;

export default function Activity() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<typeof tabs[number]>('Learning');
  const [suggestedList, setSuggestedList] = useState<Mentor[]>([]);

  React.useEffect(() => {
    fetchMentors()
      .then((data) => {
        setSuggestedList(data.slice(0, 2));
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const getItems = () => {
    if (tab === 'Learning') return activity.learning;
    if (tab === 'Teaching') return activity.teaching;
    if (tab === 'Upcoming') return [...activity.learning, ...activity.teaching].filter((x) => x.status === 'upcoming');
    return [...activity.learning, ...activity.teaching].filter((x) => x.status === 'completed');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.title}>My Activity</Text>

      {/* Grid Stats */}
      <View style={styles.gridStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Trust score</Text>
          <Text style={[styles.statValue, styles.statValuePurple]}>96</Text>
          <Text style={styles.statSubTextOnline}>⭐ Top tier</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Attendance</Text>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statSubTextMuted}>0 missed sessions</Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
        style={styles.tabScrollWrapper}
      >
        <View style={styles.tabContainer}>
          {tabs.map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[
                  styles.tabButton,
                  active ? styles.tabButtonActive : null,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    active ? styles.tabButtonTextActive : styles.tabButtonTextInactive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* List Items */}
      <View style={styles.itemList}>
        {getItems().map((it) => (
          <View key={it.id} style={styles.itemCard}>
            <View
              style={[
                styles.itemIconBox,
                it.status === 'upcoming' ? styles.iconBoxPurple : styles.iconBoxMint,
              ]}
            >
              {it.status === 'upcoming' ? (
                <Clock color="#ffffff" size={20} />
              ) : (
                <CheckCircle2 color="#22C55E" size={20} />
              )}
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>{it.skill}</Text>
              <Text style={styles.itemSubtitle} numberOfLines={1}>with {it.with}</Text>
              <Text style={styles.itemTime}>{it.time}</Text>
            </View>

            {it.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Star color="#F59E0B" size={10} fill="#F59E0B" />
                <Text style={styles.ratingText}>{it.rating}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Suggested For You Header */}
      <View style={styles.sectionHeader}>
        <Sparkles color="#8b5cf6" size={16} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Suggested for you</Text>
      </View>

      {/* Suggested List */}
      <View style={styles.suggestedList}>
        {(suggestedList.length > 0 ? suggestedList : mentors.slice(0, 2)).map((m) => (
          <View key={m.id} style={styles.suggestedCard}>
            <Image source={{ uri: m.avatar }} style={styles.suggestedAvatar} />
            <View style={styles.suggestedInfo}>
              <Text style={styles.suggestedName} numberOfLines={1}>{m.name}</Text>
              <Text style={styles.suggestedExpertise} numberOfLines={1}>
                Matches interest in {m.tags[0]}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileDetails', { id: m.id })}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestedViewLink}>View</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Caution Reminder Banner */}
      <View style={styles.cautionBanner}>
        <AlertTriangle color="#D97706" size={20} style={styles.cautionIcon} />
        <View style={styles.cautionContent}>
          <Text style={styles.cautionTitle}>Reliability reminder</Text>
          <Text style={styles.cautionDesc}>
            Missing 3+ sessions flags your profile as low reliability.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 110,
    backgroundColor: '#FAF9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 16,
  },
  gridStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  statValuePurple: {
    color: '#8b5cf6',
  },
  statSubTextOnline: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '500',
    marginTop: 4,
  },
  statSubTextMuted: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 4,
  },
  tabScrollWrapper: {
    marginHorizontal: -20,
    marginBottom: 20,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 6,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  tabButtonTextInactive: {
    color: '#8C8797',
  },
  itemList: {
    marginBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  itemIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxPurple: {
    backgroundColor: '#8b5cf6',
  },
  iconBoxMint: {
    backgroundColor: 'rgba(167, 243, 208, 0.5)',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  itemTime: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  suggestedList: {
    marginBottom: 24,
  },
  suggestedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  suggestedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F0F6',
    marginRight: 12,
  },
  suggestedInfo: {
    flex: 1,
    paddingRight: 8,
  },
  suggestedName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  suggestedExpertise: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  suggestedViewLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  cautionBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(254, 243, 199, 0.6)',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cautionIcon: {
    marginRight: 12,
  },
  cautionContent: {
    flex: 1,
  },
  cautionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
  },
  cautionDesc: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
  },
});
