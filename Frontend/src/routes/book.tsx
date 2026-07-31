import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { mentors } from '../lib/data';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/book')({
  component: Book,
});

const days = Array.from({ length: 7 }, (_, i) => i);
const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

export default function Book() {
  const navigation = useNavigation<any>();
  const [skill, setSkill] = useState(mentors[0].tags[0]);
  const [day, setDay] = useState(2);
  const [time, setTime] = useState('3:00 PM');
  const [type, setType] = useState<'Online' | 'Offline'>('Online');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconBox}>
          <CheckCircle2 color="#ffffff" size={48} />
        </View>
        <Text style={styles.successTitle}>🎉 Session Booked Successfully</Text>
        <Text style={styles.successSubtitle}>
          We've notified your mentor. See you on {time}.
        </Text>
        <TouchableOpacity
          style={styles.successBtn}
          onPress={() => navigation.navigate('Main', { screen: 'ActivityTab' })}
          activeOpacity={0.8}
        >
          <Text style={styles.successBtnText}>View my sessions</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      <Text style={styles.title}>Book a session</Text>
      <Text style={styles.subtitle}>with Aria Shah</Text>

      {/* Select Skill */}
      <Label>Select skill</Label>
      <View style={styles.chipRow}>
        {['Python', 'TensorFlow', 'Data Science', 'ML Basics'].map((s) => {
          const active = skill === s;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setSkill(s)}
              style={[
                styles.chipBtn,
                active ? styles.chipBtnActive : styles.chipBtnInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active ? styles.textActive : styles.textInactive]}>
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Select Date */}
      <Label>Select date</Label>
      <View style={styles.dateGrid}>
        {days.map((i) => {
          const active = i === day;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setDay(i)}
              style={[
                styles.dateCard,
                active ? styles.dateCardActive : styles.dateCardInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.dateDay, active ? styles.textActiveSub : styles.textInactiveSub]}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </Text>
              <Text style={[styles.dateNum, active ? styles.textActive : styles.textInactive]}>
                {12 + i}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Time Slot */}
      <Label>Time slot</Label>
      <View style={styles.grid3Column}>
        {times.map((t) => {
          const active = time === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTime(t)}
              style={[
                styles.gridBtn,
                active ? styles.gridBtnActive : styles.gridBtnInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.gridBtnText, active ? styles.textActive : styles.textInactive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Session Type */}
      <Label>Session type</Label>
      <View style={styles.grid2Column}>
        {(['Online', 'Offline'] as const).map((t) => {
          const active = type === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              style={[
                styles.gridBtn2,
                active ? styles.gridBtnActive : styles.gridBtnInactive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.gridBtnText, active ? styles.textActive : styles.textInactive]}>
                {t === 'Online' ? '🎥' : '📍'} {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notes */}
      <Label>Notes</Label>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        placeholder="What do you want to focus on?"
        placeholderTextColor="#8C8797"
        style={styles.notesInput}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => setDone(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmBtnText}>Confirm Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 40,
    backgroundColor: '#FAF9FC',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#8C8797',
    marginBottom: 24,
    textAlign: 'center',
  },
  successBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  successBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  },
  subtitle: {
    fontSize: 14,
    color: '#8C8797',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#342F3D',
    marginBottom: 10,
    marginTop: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  chipBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  chipBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#ffffff',
  },
  textInactive: {
    color: '#342F3D',
  },
  dateGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateCard: {
    width: '13%',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  dateCardInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  dateCardActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  dateDay: {
    fontSize: 10,
    marginBottom: 4,
  },
  dateNum: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textActiveSub: {
    color: '#ffffff',
    opacity: 0.7,
  },
  textInactiveSub: {
    color: '#8C8797',
  },
  grid3Column: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  gridBtn: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  gridBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  gridBtnActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  gridBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  grid2Column: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  gridBtn2: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: '#342F3D',
    textAlignVertical: 'top',
    height: 96,
    marginBottom: 24,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
