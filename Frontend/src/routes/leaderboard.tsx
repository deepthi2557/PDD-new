import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Crown } from 'lucide-react-native';
import { fetchMentors } from '../lib/api';
import { Mentor } from '../lib/data';

export const Route = createFileRoute('/leaderboard')({
  component: Board,
});

const tabs = ['Mentors', 'Learners', 'Skills'] as const;

export default function Board() {
  const [tab, setTab] = useState<typeof tabs[number]>('Mentors');
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMentors()
      .then((data) => {
        if (!active) return;
        // Rank real users dynamically based on points/rating/sessions
        const ranked = data.map((user, idx) => {
          const calculatedScore = Math.round((user.rating || 4.8) * 900 + (user.sessions || 10) * 45 + (user.reviews || 5) * 12);
          return {
            rank: idx + 1,
            name: user.name,
            avatar: user.avatar,
            score: calculatedScore,
            badge: user.badge === 'Top Contributor' ? '🏆' : user.badge === 'Verified Mentor' ? '🎖️' : '⭐',
            expertise: user.expertise,
          };
        }).sort((a, b) => b.score - a.score).map((u, i) => ({ ...u, rank: i + 1 }));

        setRealUsers(ranked);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard load error:', err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const top3 = realUsers.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Trophy color="#8b5cf6" size={24} style={styles.headerIcon} />
        <Text style={styles.title}>Leaderboard</Text>
      </View>

      {/* Podium Card Banner */}
      <View style={styles.podiumBanner}>
        <Text style={styles.podiumSubTitle}>Live Rankings</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#8b5cf6" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.podiumContainer}>
            {podiumOrder.map((user, i) => {
              if (!user) return null;
              const isFirst = user.rank === 1;
              const heights = [80, 112, 64];

              return (
                <View key={user.name + i} style={styles.podiumColumn}>
                  {isFirst && <Crown color="#D97706" size={20} style={styles.crownIcon} />}
                  <Image source={{ uri: user.avatar }} style={styles.podiumAvatar} />
                  <Text style={styles.podiumName} numberOfLines={1}>
                    {user.name.split(' ')[0]}
                  </Text>
                  <Text style={styles.podiumScore}>{user.score} pts</Text>
                  <View style={[styles.podiumBox, { height: heights[i % heights.length] }]}>
                    <Text style={styles.podiumRankText}>#{user.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Tabs Menu */}
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

      {/* Tab Contents */}
      {loading ? (
        <ActivityIndicator size="large" color="#8b5cf6" style={{ marginVertical: 32 }} />
      ) : tab !== 'Skills' ? (
        <View style={styles.listContainer}>
          {realUsers.map((m) => (
            <View key={m.name + m.rank} style={styles.listCard}>
              <Text style={styles.rankIndex}>#{m.rank}</Text>
              <Image source={{ uri: m.avatar }} style={styles.listAvatar} />
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{m.name}</Text>
                <Text style={styles.listScore}>{m.score} pts · {m.expertise}</Text>
              </View>
              {m.badge && <Text style={styles.listBadgeEmoji}>{m.badge}</Text>}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {[
            { name: 'Python & AI', growth: '+42% this week' },
            { name: 'React & TypeScript', growth: '+38% this week' },
            { name: 'UI/UX & Figma', growth: '+31% this week' },
            { name: 'Node.js & Backend', growth: '+25% this week' },
          ].map((s, i) => (
            <View key={s.name} style={styles.listCard}>
              <Text style={styles.rankIndex}>#{i + 1}</Text>
              <Text style={styles.skillName}>{s.name}</Text>
              <View style={styles.growthBadge}>
                <TrendingUp color="#22C55E" size={12} style={styles.growthIcon} />
                <Text style={styles.growthText}>{s.growth}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Your Badges Grid */}
      <Text style={styles.badgesSectionTitle}>Your badges</Text>
      <View style={styles.badgesGrid}>
        {[
          { e: '📚', l: 'Fast Learner' },
          { e: '🎯', l: 'Session Master' },
          { e: '🚀', l: 'Explorer' },
        ].map((b) => (
          <View key={b.l} style={styles.badgeItemCard}>
            <Text style={styles.badgeEmoji}>{b.e}</Text>
            <Text style={styles.badgeLabel} numberOfLines={1}>{b.l}</Text>
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  podiumBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  podiumSubTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8C8797',
    opacity: 0.8,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 8,
  },
  podiumColumn: {
    alignItems: 'center',
    flex: 1,
  },
  crownIcon: {
    marginBottom: 4,
  },
  podiumAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#F3F0F6',
  },
  podiumName: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    color: '#342F3D',
  },
  podiumScore: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 2,
  },
  podiumBox: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  podiumRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 6,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  tabButtonTextInactive: {
    color: '#8C8797',
  },
  listContainer: {
    width: '100%',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  rankIndex: {
    width: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#8C8797',
    marginRight: 6,
  },
  listAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F0F6',
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  listScore: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 2,
  },
  listBadgeEmoji: {
    fontSize: 18,
  },
  skillName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(167, 243, 208, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  growthIcon: {
    marginRight: 4,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  badgesSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
    marginTop: 24,
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  badgeItemCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#342F3D',
  },
});
