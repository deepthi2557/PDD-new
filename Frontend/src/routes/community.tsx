import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { Heart, MessageSquare, Sparkles, Plus } from 'lucide-react-native';
import { community } from '../lib/data';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/community')({
  component: Community,
});

export default function Community() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity style={styles.plusBtn} activeOpacity={0.7}>
          <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Weekly Challenge Banner */}
      <View style={styles.challengeCard}>
        <View style={styles.challengeHeaderRow}>
          <Sparkles color="#342F3D" size={16} style={styles.challengeIcon} />
          <Text style={styles.challengeHeader}>Weekly Challenge</Text>
        </View>
        <Text style={styles.challengeTitle}>Build a 1-min portfolio in Figma</Text>
        <Text style={styles.challengeSubtitle}>142 students participating</Text>
        <TouchableOpacity style={styles.challengeBtn} activeOpacity={0.7}>
          <Text style={styles.challengeBtnText}>Join challenge</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        style={styles.horizontalScrollWrapper}
      >
        {['All', 'Discussions', 'Challenges', 'Posts', 'Q&A'].map((f, i) => {
          const active = i === 0;
          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterBtn,
                active ? styles.filterBtnActive : styles.filterBtnInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, active ? styles.textActive : styles.textInactive]}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Feed List */}
      <View style={styles.feedContainer}>
        {community.map((p) => (
          <View key={p.id} style={styles.feedCard}>
            <View style={styles.feedHeader}>
              <Image source={{ uri: p.avatar }} style={styles.feedAvatar} />
              <View style={styles.feedUser}>
                <Text style={styles.feedAuthorName}>{p.author}</Text>
                <Text style={styles.feedTime}>{p.time} ago</Text>
              </View>
              <View style={styles.mintBadge}>
                <Text style={styles.mintBadgeText}>{p.tag}</Text>
              </View>
            </View>

            <Text style={styles.feedTitle}>{p.title}</Text>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <Heart color="#8C8797" size={16} style={styles.actionIcon} />
                <Text style={styles.actionText}>{p.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <MessageSquare color="#8C8797" size={16} style={styles.actionIcon} />
                <Text style={styles.actionText}>{p.comments}</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  plusBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeCard: {
    backgroundColor: '#ebdfff', // mapped from gradient-hero background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  challengeIcon: {
    marginRight: 6,
  },
  challengeHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#342F3D',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
    lineHeight: 22,
  },
  challengeSubtitle: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 4,
  },
  challengeBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
  },
  challengeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#342F3D',
  },
  horizontalScrollWrapper: {
    marginHorizontal: -20,
    marginBottom: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
  },
  filterBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  filterBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#ffffff',
  },
  textInactive: {
    color: '#342F3D',
  },
  feedContainer: {
    width: '100%',
  },
  feedCard: {
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
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F0F6',
    marginRight: 10,
  },
  feedUser: {
    flex: 1,
  },
  feedAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
  },
  feedTime: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 1,
  },
  mintBadge: {
    backgroundColor: 'rgba(167, 243, 208, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  mintBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065F46',
  },
  feedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#342F3D',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#8C8797',
  },
});
