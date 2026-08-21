import { createFileRoute } from '@tanstack/react-router';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Users, Calendar, Star, TrendingUp, Flag, MessageSquare, Activity as ActIcon, BarChart3 } from 'lucide-react-native';

export const Route = createFileRoute('/admin')({
  component: Admin,
});

export default function Admin() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#8C8797" size={16} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.headerSubtitle}>Admin Dashboard</Text>
      <Text style={styles.title}>Overview</Text>

      {/* Grid Stats */}
      <View style={styles.gridStats}>
        <Stat icon={Users} label="Total Users" value="12,480" trend="+8.2%" />
        <Stat icon={Calendar} label="Active Sessions" value="342" trend="+3.1%" />
        <Stat icon={Star} label="Avg Rating" value="4.78" trend="+0.04" />
        <Stat icon={TrendingUp} label="User Growth" value="+12%" trend="this month" />
      </View>

      {/* Engagement Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Engagement</Text>
          <BarChart3 color="#8C8797" size={16} />
        </View>
        <View style={styles.chartContainer}>
          {[40, 65, 50, 78, 60, 90, 75].map((h, i) => (
            <View key={i} style={styles.chartColumn}>
              <View style={styles.chartBarWrapper}>
                <View style={[styles.chartBar, { height: `${h}%` }]} />
              </View>
              <Text style={styles.chartColumnLabel}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Popular Skills Progress Meters */}
      <View style={styles.progressCard}>
        <Text style={styles.chartTitle}>Popular skills</Text>
        {[
          { name: 'AI & ML', pct: 86 },
          { name: 'UI/UX', pct: 72 },
          { name: 'Coding', pct: 64 },
          { name: 'Public Speaking', pct: 41 },
        ].map((s) => (
          <View key={s.name} style={styles.progressRow}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressName}>{s.name}</Text>
              <Text style={styles.progressPct}>{s.pct}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${s.pct}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Manage Grid */}
      <Text style={styles.sectionTitle}>Manage</Text>
      <View style={styles.manageGrid}>
        {[
          { icon: Users, label: 'Users', count: 12480 },
          { icon: Calendar, label: 'Sessions', count: 8412 },
          { icon: Flag, label: 'Reports', count: 14 },
          { icon: Star, label: 'Reviews', count: 6291 },
          { icon: MessageSquare, label: 'Community', count: 932 },
          { icon: ActIcon, label: 'Categories', count: 28 },
        ].map((m) => (
          <TouchableOpacity key={m.label} style={styles.manageCard} activeOpacity={0.7}>
            <m.icon color="#8b5cf6" size={20} style={styles.manageIcon} />
            <Text style={styles.manageLabel}>{m.label}</Text>
            <Text style={styles.manageCount}>{m.count.toLocaleString()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

import { ArrowLeft } from 'lucide-react-native';

function Stat({ icon: Icon, label, value, trend }: { icon: any; label: string; value: string; trend: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconBox}>
        <Icon color="#ffffff" size={16} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTrend}>{trend}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: '#FAF9FC',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  headerSubtitle: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 20,
  },
  gridStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 12,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#8C8797',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  statTrend: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '500',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 128,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBarWrapper: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#8b5cf6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chartColumnLabel: {
    fontSize: 10,
    color: '#8C8797',
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  progressRow: {
    marginTop: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#342F3D',
  },
  progressPct: {
    fontSize: 12,
    color: '#8C8797',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F3F0F6',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 12,
  },
  manageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 40,
  },
  manageCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
  },
  manageIcon: {
    marginBottom: 8,
  },
  manageLabel: {
    fontSize: 12,
    color: '#8C8797',
    marginBottom: 2,
  },
  manageCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
  },
});
