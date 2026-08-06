import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Phone, Video, Smile, Paperclip, Mic, Send, Monitor, PhoneOff, MicOff, Volume2, MessageSquare, X } from 'lucide-react-native';
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

  const [msgs, setMsgs] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);

  // Calling / Screen Sharing states
  const [activeCallMode, setActiveCallMode] = useState<'none' | 'voice' | 'screenshare'>('none');
  const [showCallChat, setShowCallChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Persistence of Messages
  useEffect(() => {
    if (!id) return;
    const localMsgs = localStorage.getItem(`chat_msgs_${id}`);
    if (localMsgs) {
      setMsgs(JSON.parse(localMsgs));
    } else {
      setMsgs(initialMsgs);
      localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(initialMsgs));
    }
  }, [id]);

  // Call duration timer
  useEffect(() => {
    let timer: any;
    if (activeCallMode !== 'none') {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCallMode]);

  const send = () => {
    if (!text.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { from: 'me', text, time: timeNow };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setText('');

    // Update last message in chat list
    const chatsList = JSON.parse(localStorage.getItem('chats_list') || '[]');
    const chatIdx = chatsList.findIndex((c: any) => c.id === id);
    if (chatIdx > -1) {
      chatsList[chatIdx].last = text;
      chatsList[chatIdx].time = 'now';
      localStorage.setItem('chats_list', JSON.stringify(chatsList));
    }
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const renderCallChatDrawer = () => {
    return (
      <View style={styles.callChatDrawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>In-call Chat</Text>
          <TouchableOpacity onPress={() => setShowCallChat(false)} style={styles.drawerClose}>
            <X color="#342F3D" size={20} />
          </TouchableOpacity>
        </View>
        
        <ScrollView contentContainerStyle={styles.drawerScrollContent} showsVerticalScrollIndicator={false}>
          {msgs.map((msg, i) => {
            const me = msg.from === 'me';
            return (
              <View key={i} style={[styles.msgWrapper, me ? styles.msgRight : styles.msgLeft]}>
                <View style={[styles.msgBubble, me ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.msgText, me ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                  <Text style={[styles.msgTime, me ? styles.timeMe : styles.timeThem]}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.drawerInputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Message..."
            placeholderTextColor="#8C8797"
            style={styles.drawerTextInput}
          />
          <TouchableOpacity onPress={send} style={styles.drawerSendBtn} activeOpacity={0.7}>
            <Send color="#ffffff" size={14} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading || !m) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (activeCallMode === 'voice') {
    return (
      <View style={styles.callOverlay}>
        <View style={styles.callContainer}>
          <View style={styles.callHeader}>
            <Text style={styles.callStateText}>Secure Voice Call</Text>
            <Text style={styles.callTimer}>{formatDuration(callDuration)}</Text>
          </View>

          <View style={styles.callAvatarSection}>
            <View style={styles.pulseContainer}>
              <View style={[styles.pulseRing, styles.pulse1]} />
              <View style={[styles.pulseRing, styles.pulse2]} />
              <Image source={{ uri: m.avatar }} style={styles.callAvatar} />
            </View>
            <Text style={styles.callName}>{m.name}</Text>
            <Text style={styles.callStatus}>Connected</Text>
          </View>

          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[styles.controlCircle, isMuted ? styles.controlCircleActive : styles.controlCircleInactive]}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.7}
            >
              <MicOff color={isMuted ? '#ffffff' : '#5E5470'} size={22} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlCircle, showCallChat ? styles.controlCircleActive : styles.controlCircleInactive]}
              onPress={() => setShowCallChat(!showCallChat)}
              activeOpacity={0.7}
            >
              <MessageSquare color={showCallChat ? '#ffffff' : '#5E5470'} size={22} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlCircle, isSpeakerOn ? styles.controlCircleActive : styles.controlCircleInactive]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
              activeOpacity={0.7}
            >
              <Volume2 color={isSpeakerOn ? '#ffffff' : '#5E5470'} size={22} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlCircle, styles.callHangup]}
              onPress={() => {
                setActiveCallMode('none');
                setShowCallChat(false);
              }}
              activeOpacity={0.7}
            >
              <PhoneOff color="#ffffff" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {showCallChat && renderCallChatDrawer()}
      </View>
    );
  }

  if (activeCallMode === 'screenshare') {
    return (
      <View style={styles.callOverlay}>
        <View style={styles.callContainer}>
          <View style={styles.callHeader}>
            <Text style={styles.callStateText}>Screen Sharing Session</Text>
            <Text style={styles.callTimer}>{formatDuration(callDuration)}</Text>
          </View>

          <View style={styles.sharedScreenContainer}>
            <View style={styles.sharedScreenMock}>
              <View style={styles.editorHeader}>
                <View style={styles.editorDotRow}>
                  <View style={[styles.editorDot, { backgroundColor: '#ef4444' }]} />
                  <View style={[styles.editorDot, { backgroundColor: '#f59e0b' }]} />
                  <View style={[styles.editorDot, { backgroundColor: '#10b981' }]} />
                </View>
                <Text style={styles.editorFilename}>main.py</Text>
              </View>
              <ScrollView style={styles.codeTextContainer}>
                <Text style={styles.codeText}><Text style={styles.codeKeyword}>import</Text> tensorflow <Text style={styles.codeKeyword}>as</Text> tf</Text>
                <Text style={styles.codeText}><Text style={styles.codeKeyword}>import</Text> numpy <Text style={styles.codeKeyword}>as</Text> np</Text>
                <Text style={styles.codeText}></Text>
                <Text style={styles.codeComment}># Creating a simple neural network classifier</Text>
                <Text style={styles.codeText}>model = tf.keras.Sequential([</Text>
                <Text style={styles.codeText}>    tf.keras.layers.Dense(<Text style={styles.codeNumber}>128</Text>, activation=<Text style={styles.codeString}>'relu'</Text>),</Text>
                <Text style={styles.codeText}>    tf.keras.layers.Dropout(<Text style={styles.codeNumber}>0.2</Text>),</Text>
                <Text style={styles.codeText}>    tf.keras.layers.Dense(<Text style={styles.codeNumber}>10</Text>, activation=<Text style={styles.codeString}>'softmax'</Text>)</Text>
                <Text style={styles.codeText}>])</Text>
                <Text style={styles.codeText}></Text>
                <Text style={styles.codeText}>model.compile(optimizer=<Text style={styles.codeString}>'adam'</Text>,</Text>
                <Text style={styles.codeText}>              loss=<Text style={styles.codeString}>'sparse_categorical_crossentropy'</Text>,</Text>
                <Text style={styles.codeText}>              metrics=[<Text style={styles.codeString}>'accuracy'</Text>])</Text>
              </ScrollView>
            </View>

            <View style={styles.pipVideo}>
              <Image source={{ uri: m.avatar }} style={styles.pipAvatar} />
              <View style={styles.pipNameBadge}>
                <Text style={styles.pipNameText}>{m.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[styles.controlCircle, isMuted ? styles.controlCircleActive : styles.controlCircleInactive]}
              onPress={() => setIsMuted(!isMuted)}
              activeOpacity={0.7}
            >
              <MicOff color={isMuted ? '#ffffff' : '#5E5470'} size={22} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlCircle, showCallChat ? styles.controlCircleActive : styles.controlCircleInactive]}
              onPress={() => setShowCallChat(!showCallChat)}
              activeOpacity={0.7}
            >
              <MessageSquare color={showCallChat ? '#ffffff' : '#5E5470'} size={22} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlCircle, styles.callHangup]}
              onPress={() => {
                setActiveCallMode('none');
                setShowCallChat(false);
              }}
              activeOpacity={0.7}
            >
              <PhoneOff color="#ffffff" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {showCallChat && renderCallChatDrawer()}
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
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => setActiveCallMode('voice')}
          activeOpacity={0.7}
        >
          <Phone color="#342F3D" size={16} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionIconBtn} 
          onPress={() => setActiveCallMode('screenshare')}
          activeOpacity={0.7}
        >
          <Monitor color="#342F3D" size={16} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionIconBtn, styles.videoBtn]} 
          onPress={() => navigation.navigate('VideoDetails', { id: m.id })}
          activeOpacity={0.7}
        >
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
  callOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF9FC',
    zIndex: 100,
    flexDirection: 'row',
  },
  callContainer: {
    flex: 1,
    height: '100%',
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF9FC',
  },
  callHeader: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  callStateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8C8797',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  callTimer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginTop: 8,
  },
  callAvatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  pulse1: {
    transform: [{ scale: 0.9 }],
  },
  pulse2: {
    transform: [{ scale: 0.7 }],
  },
  callAvatar: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: '#F3F0F6',
  },
  callName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 6,
  },
  callStatus: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  callControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  controlCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  controlCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  controlCircleActive: {
    backgroundColor: '#8b5cf6',
  },
  callHangup: {
    backgroundColor: '#ef4444',
  },
  sharedScreenContainer: {
    width: '100%',
    flex: 1,
    marginVertical: 20,
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E1E2F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(94, 84, 112, 0.12)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 4,
  },
  sharedScreenMock: {
    flex: 1,
    padding: 16,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 10,
    marginBottom: 12,
  },
  editorDotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  editorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editorFilename: {
    color: '#8C8797',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 16,
  },
  codeTextContainer: {
    flex: 1,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#D4D4D4',
    lineHeight: 18,
    textAlign: 'left',
  },
  codeKeyword: {
    color: '#C779D0',
    fontWeight: 'bold',
  },
  codeString: {
    color: '#98C379',
  },
  codeNumber: {
    color: '#D19A66',
  },
  codeComment: {
    color: '#5C6370',
    fontStyle: 'italic',
  },
  pipVideo: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 80,
    height: 110,
    borderRadius: 16,
    backgroundColor: '#342F3D',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  pipAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pipNameBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pipNameText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  callChatDrawer: {
    width: 320,
    height: '100%',
    backgroundColor: '#FAF9FC',
    borderLeftWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 12,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  drawerClose: {
    padding: 4,
  },
  drawerScrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  drawerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  drawerTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#342F3D',
    padding: 0,
  },
  drawerSendBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
