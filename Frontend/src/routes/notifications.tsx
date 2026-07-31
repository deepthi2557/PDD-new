import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { notifications } from '../lib/data';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/notifications')({
  component: Notifs,
});

export default function Notifs() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <ArrowLeft color="#8C8797" size={16} style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Notifications</Text>

      {/* Notifications List */}
      <View style={styles.notifList}>
        {notifications.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>{n.icon}</Text>
            </View>
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifTime}>{n.time} ago</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 20,
  },
  notifList: {
    width: '100%',
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#ebdfff', // mapped from gradient-hero background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 18,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#342F3D',
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 10,
    color: '#8C8797',
    marginTop: 2,
  },
});
