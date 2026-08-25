import { createFileRoute } from '../lib/router-bridge';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentors, fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';
import { VITE_API_URL } from '../lib/env';

export const Route = createFileRoute('/book')({
  component: Book,
});

const days = Array.from({ length: 7 }, (_, i) => i);
const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

export default function Book() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const targetMentorId = route.params?.id || localStorage.getItem('selected_mentor_id');

  const [skill, setSkill] = useState('');
  const [targetMentor, setTargetMentor] = useState<Mentor | null>(null);
  const [loadingMentor, setLoadingMentor] = useState(true);

  React.useEffect(() => {
    let active = true;
    setLoadingMentor(true);
    
    const load = async () => {
      try {
        if (targetMentorId) {
          const mData = await fetchMentorById(targetMentorId);
          if (active) {
            setTargetMentor(mData);
            if (mData.tags && mData.tags.length > 0) {
              setSkill(mData.tags[0]);
            }
          }
        } else {
          const mList = await fetchMentors();
          if (active && mList.length > 0) {
            setTargetMentor(mList[0]);
            if (mList[0].tags && mList[0].tags.length > 0) {
              setSkill(mList[0].tags[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading mentor for booking:', err);
        const fallback = mentors.find(x => x.id === targetMentorId) || mentors[0];
        if (active) {
          setTargetMentor(fallback);
          if (fallback.tags && fallback.tags.length > 0) {
            setSkill(fallback.tags[0]);
          }
        }
      } finally {
        if (active) setLoadingMentor(false);
      }
    };
    
    load();
    return () => { active = false; };
  }, [targetMentorId]);

  const [day, setDay] = useState(2);
  const [time, setTime] = useState('3:00 PM');
  const [type, setType] = useState<'Online' | 'Offline'>('Online');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!targetMentor) return;
    setSubmitting(true);

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + (day - 2));
    const dateString = bookingDate.toISOString().split('T')[0];

    // 1. Try writing to Supabase
    try {
      const { data: userData } = await supabase.auth.getUser();
      const learnerId = userData?.user?.id;
      if (learnerId) {
        const { error } = await supabase
          .from('bookings')
          .insert([
            {
              learner_id: learnerId,
              mentor_id: targetMentor.id,
              skill: skill,
              date: dateString,
              time_slot: time,
              type: type,
              notes: notes,
              status: 'UPCOMING'
            }
          ]);
        if (error) console.warn('Supabase booking insert warning:', error);
      }
    } catch (err) {
      console.warn('Supabase insert fail:', err);
    }

    // 2. Try writing to Spring Boot REST API
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (token) {
        await fetch(`${VITE_API_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            mentorId: targetMentor.id,
            skill: skill,
            date: dateString,
            timeSlot: time,
            type: type,
            notes: notes
          })
        });
      }
    } catch (err) {
      console.warn('Backend server insert fail:', err);
    }

    // 3. Update localStorage to ensure UI updates are fully interactive
    try {
      const localBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      const newBooking = {
        id: Math.random().toString(36).substring(2),
        skill: skill,
        with: targetMentor.name,
        time: `${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]} · ${time}`,
        rating: 0,
        status: 'upcoming'
      };
      localBookings.push(newBooking);
      localStorage.setItem('my_bookings', JSON.stringify(localBookings));

      const localNotifs = JSON.parse(localStorage.getItem('my_notifications') || '[]');
      localNotifs.unshift({
        id: Date.now(),
        type: 'booking',
        title: `Session request sent to ${targetMentor.name} for ${skill}`,
        time: '1s',
        icon: '📩'
      });
      localStorage.setItem('my_notifications', JSON.stringify(localNotifs));

      const localChats = JSON.parse(localStorage.getItem(`chat_msgs_${targetMentor.id}`) || '[]');
      localChats.push({
        from: 'me',
        text: `Hello! I booked a session with you for ${skill} on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]} at ${time}. Notes: ${notes || 'No extra notes.'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem(`chat_msgs_${targetMentor.id}`, JSON.stringify(localChats));

      const chatsList = JSON.parse(localStorage.getItem('chats_list') || '[]');
      const chatIdx = chatsList.findIndex((c: any) => c.id === targetMentor.id);
      const chatDetails = {
        id: targetMentor.id,
        name: targetMentor.name,
        avatar: targetMentor.avatar,
        last: `Requested session for ${skill}`,
        time: 'now',
        unread: 0,
        online: true
      };
      if (chatIdx > -1) {
        chatsList[chatIdx].last = `Requested session for ${skill}`;
        chatsList[chatIdx].time = 'now';
      } else {
        chatsList.push(chatDetails);
      }
      localStorage.setItem('chats_list', JSON.stringify(chatsList));
    } catch (err) {
      console.error('LocalStorage booking sync error:', err);
    }

    setSubmitting(false);
    setDone(true);
  };

  if (loadingMentor || !targetMentor) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', minHeight: 400 }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

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
      <Text style={styles.subtitle}>with {targetMentor.name}</Text>

      {/* Select Skill */}
      <Label>Select skill</Label>
      <View style={styles.chipRow}>
        {(targetMentor.tags || []).map((s) => {
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
        style={[styles.confirmBtn, submitting && { opacity: 0.7 }]}
        onPress={handleConfirm}
        activeOpacity={0.8}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.confirmBtnText}>Confirm Session</Text>
        )}
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
