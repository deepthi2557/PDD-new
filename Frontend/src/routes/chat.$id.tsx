import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Phone, Video, Smile, Paperclip, Mic, Send } from 'lucide-react-native';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat/$id')({
  component: ChatRoom,
});

const initialMsgs = [
  { from: 'them', text: 'Hey! Excited about our session tomorrow 🚀', time: '10:24' },
  { from: 'me', text: 'Same here! Quick question — should I prep anything?', time: '10:25' },
  { from: 'them', text: "Just have a notebook ready. We'll build a tiny model together.", time: '10:26' },
  { from: 'me', text: 'Sounds perfect — see you then!', time: '10:27' },
];

export default function ChatRoom() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchMentorById(id)
      .then((data) => {
        if (active) {
          setM(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          const fallback = mentors.find((x) => x.id === id) || mentors[0];
          setM(fallback);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const [msgs, setMsgs] = useState(initialMsgs);
  const [text, setText] = useState('');
  const [typing] = useState(true);

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { from: 'me', text, time: 'now' }]);
    setText('');
  };

  if (loading || !m) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#342F3D" size={20} />
        </TouchableOpacity>
        <Image source={{ uri: m.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{m.name}</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionIconBtn} activeOpacity={0.7}>
          <Phone color="#342F3D" size={16} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionIconBtn, styles.videoBtn]} activeOpacity={0.7}>
          <Video color="#ffffff" size={16} />
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {msgs.map((msg, i) => {
          const me = msg.from === 'me';
          return (
            <View key={i} style={[styles.msgWrapper, me ? styles.msgRight : styles.msgLeft]}>
              <View
                style={[
                  styles.msgBubble,
                  me ? styles.bubbleMe : styles.bubbleThem,
                ]}
              >
                <Text style={[styles.msgText, me ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                <Text style={[styles.msgTime, me ? styles.timeMe : styles.timeThem]}>{msg.time}</Text>
              </View>
            </View>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <View style={[styles.msgWrapper, styles.msgLeft]}>
            <View style={[styles.msgBubble, styles.bubbleThem, styles.typingBubble]}>
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
              <View style={styles.typingDot} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input area */}
      <View style={styles.inputStickyWrapper}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.utilityBtn} activeOpacity={0.7}>
            <Smile color="#8C8797" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.utilityBtn} activeOpacity={0.7}>
            <Paperclip color="#8C8797" size={20} />
          </TouchableOpacity>

          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Message..."
            placeholderTextColor="#8C8797"
            style={styles.textInput}
          />

          {text.trim() ? (
            <TouchableOpacity onPress={send} style={styles.sendBtn} activeOpacity={0.7}>
              <Send color="#ffffff" size={16} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.7}>
              <Mic color="#ffffff" size={16} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    zIndex: 20,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F0F6',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#22C55E',
    fontWeight: '500',
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  videoBtn: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMe: {
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomLeftRadius: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8C8797',
  },
  msgText: {
    fontSize: 14,
  },
  textMe: {
    color: '#ffffff',
  },
  textThem: {
    color: '#342F3D',
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeThem: {
    color: '#8C8797',
  },
  inputStickyWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 6,
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 1,
  },
  utilityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#342F3D',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
