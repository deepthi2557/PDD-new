import { createFileRoute } from '../lib/router-bridge';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, TextInput, Platform } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Mic, MicOff, Video as VideoIcon, VideoOff, Palette, RotateCcw, PhoneOff, Star, CheckCircle2, Send } from 'lucide-react-native';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';

export const Route = createFileRoute('/video/$id')({
  component: VideoRoom,
});

export default function VideoRoom() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const id = route.params?.id;

  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [peerVideoOff, setPeerVideoOff] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [drawColor, setDrawColor] = useState('#8b5cf6'); // Default violet
  const [lineWidth, setLineWidth] = useState(4);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [showChat, setShowChat] = useState(false);
  const [msgs, setMsgs] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');

  useEffect(() => {
    if (!id) return;
    const localMsgs = localStorage.getItem(`chat_msgs_${id}`);
    if (localMsgs) {
      setMsgs(JSON.parse(localMsgs));
    }
  }, [id]);

  const sendChatMessage = () => {
    if (!chatText.trim() || !id) return;
    const newMsg = {
      from: 'me',
      text: chatText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setChatText('');
    
    // Update last message in chat list
    const chatsList = JSON.parse(localStorage.getItem('chats_list') || '[]');
    const chatIdx = chatsList.findIndex((c: any) => c.id === id);
    if (chatIdx > -1) {
      chatsList[chatIdx].last = chatText;
      chatsList[chatIdx].time = 'now';
      localStorage.setItem('chats_list', JSON.stringify(chatsList));
    }
  };

  const getVideoContainerStyle = () => {
    if (showWhiteboard && showChat) {
      return { width: '25%' };
    }
    if (showWhiteboard) {
      return styles.videoContainerMini;
    }
    return styles.videoContainerFull;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Fetch mentor profile
  useEffect(() => {
    if (!id) return;
    let active = true;
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

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Draw handlers for HTML5 Canvas
  useEffect(() => {
    if (!showWhiteboard || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution canvas drawing
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 450;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [showWhiteboard, canvasRef.current]);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    isDrawing.current = true;
  };

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const shareWhiteboardSnapshot = () => {
    if (!canvasRef.current || !id) return;
    try {
      const snapshotUrl = canvasRef.current.toDataURL('image/png');
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const localMsgsStr = localStorage.getItem(`chat_msgs_${id}`);
      const chatMsgs = localMsgsStr ? JSON.parse(localMsgsStr) : [];
      
      const snapshotMsg = {
        from: 'me',
        type: 'image',
        mediaUrl: snapshotUrl,
        time: timeNow,
        caption: '🎨 Shared a snapshot of the whiteboard'
      };
      
      const updated = [...chatMsgs, snapshotMsg];
      localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
      setMsgs(updated);
      
      alert('Whiteboard snapshot shared successfully to chat!');
    } catch (err) {
      console.error('Failed to export canvas:', err);
      alert('Could not share canvas snapshot.');
    }
  };

  const submitReview = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      navigation.navigate('ChatDetails', { id });
    }, 1500);
  };

  if (loading || !m) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#342F3D" size={20} />
        </TouchableOpacity>
        <View style={styles.mentorInfo}>
          <Text style={styles.title}>Swap Session</Text>
          <Text style={styles.subtitle}>with {m.name}</Text>
        </View>
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Main Content (Split screen style: Video and Canvas) */}
      <View style={styles.contentSplit}>
        {/* Left Side: Video Streams */}
        <View style={[styles.videoContainer, getVideoContainerStyle()]}>
           {/* Peer Stream (Mentor) */}
          <View style={styles.peerVideoCard}>
            {peerVideoOff ? (
              <View style={styles.videoOffPlaceholder}>
                <Image source={{ uri: m.avatar }} style={styles.offlineAvatar} />
                <Text style={styles.videoOffText}>{m.name}'s camera off</Text>
              </View>
            ) : (
              <View style={styles.peerVideoOverlay}>
                <Image source={{ uri: m.avatar }} style={styles.videoStreamMock} />
                <View style={styles.nameBadge}>
                  <Text style={styles.nameBadgeText}>{m.name}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Self Stream */}
          <View style={styles.selfVideoCard}>
            {videoOff ? (
              <View style={styles.videoOffPlaceholder}>
                <Text style={[styles.videoOffText, { fontSize: 11 }]}>Your camera off</Text>
              </View>
            ) : (
              <View style={styles.peerVideoOverlay}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' }} style={styles.videoStreamMock} />
                <View style={styles.nameBadge}>
                  <Text style={styles.nameBadgeText}>You (Alex)</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Right Side: Interactive Whiteboard */}
        {showWhiteboard && (
          <View style={styles.whiteboardContainer}>
            <View style={styles.whiteboardHeader}>
              <View style={styles.whiteboardTitleRow}>
                <Palette color="#8b5cf6" size={16} />
                <Text style={styles.whiteboardTitle}>Interactive Whiteboard</Text>
              </View>
              
              {/* Whiteboard Color Tools */}
              <View style={styles.toolsRow}>
                {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#000000'].map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setDrawColor(color)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      drawColor === color ? styles.colorDotActive : null,
                    ]}
                  />
                ))}
                
                <TouchableOpacity onPress={clearCanvas} style={styles.toolBtn}>
                  <RotateCcw color="#5E5470" size={16} />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={shareWhiteboardSnapshot} 
                  style={[styles.toolBtn, styles.shareBtn]}
                  activeOpacity={0.8}
                >
                  <Send color="#ffffff" size={12} style={{ marginRight: 6 }} />
                  <Text style={styles.shareBtnText}>Share to Chat</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Canvas Area */}
            <View style={styles.canvasWrapper}>
              {Platform.OS === 'web' ? (
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleDrawing}
                  onMouseUp={handleStopDraw}
                  onMouseLeave={handleStopDraw}
                  style={styles.htmlCanvas}
                />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F0F7', borderRadius: 8 }}>
                  <Text style={{ color: '#8C8797' }}>Whiteboard is only available on Web</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Right Side / Drawer: Chat Panel */}
        {showChat && (
          <View style={styles.chatDrawerContainer}>
            <View style={styles.chatDrawerHeader}>
              <Text style={styles.chatDrawerTitle}>Live Chat</Text>
            </View>
            <ScrollView 
              style={styles.chatDrawerMessages}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            >
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
            <View style={styles.chatDrawerInputWrapper}>
              <TextInput
                value={chatText}
                onChangeText={setChatText}
                onSubmitEditing={sendChatMessage}
                placeholder="Type message..."
                placeholderTextColor="#8C8797"
                style={styles.chatDrawerInput}
              />
              <TouchableOpacity onPress={sendChatMessage} style={styles.chatDrawerSendBtn}>
                <Send color="#ffffff" size={14} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Footer Controls */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          onPress={() => setMuted(!muted)}
          style={[styles.controlCircleBtn, muted ? styles.controlCircleBtnActive : styles.controlCircleBtnInactive]}
        >
          {muted ? <MicOff color="#ef4444" size={22} /> : <Mic color="#5E5470" size={22} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setVideoOff(!videoOff)}
          style={[styles.controlCircleBtn, videoOff ? styles.controlCircleBtnActive : styles.controlCircleBtnInactive]}
        >
          {videoOff ? <VideoOff color="#ef4444" size={22} /> : <VideoIcon color="#5E5470" size={22} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowWhiteboard(!showWhiteboard)}
          style={[styles.whiteboardToggleBtn, showWhiteboard ? styles.whiteboardToggleBtnActive : null]}
        >
          <Text style={[styles.whiteboardToggleText, showWhiteboard ? styles.whiteboardToggleTextActive : null]}>
            {showWhiteboard ? 'Hide Board' : 'Show Whiteboard'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowChat(!showChat)}
          style={[styles.whiteboardToggleBtn, showChat ? styles.whiteboardToggleBtnActive : null, { marginLeft: 8 }]}
        >
          <Text style={[styles.whiteboardToggleText, showChat ? styles.whiteboardToggleTextActive : null]}>
            {showChat ? 'Hide Chat' : 'Show Chat'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowReviewModal(true)}
          style={[styles.controlCircleBtn, styles.hangUpBtn]}
        >
          <PhoneOff color="#ffffff" size={22} />
        </TouchableOpacity>
      </View>

      {/* Review & Feedback Modal */}
      {showReviewModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {submitted ? (
              <View style={styles.successWrapper}>
                <CheckCircle2 color="#22c55e" size={48} />
                <Text style={styles.successTitle}>Swap Completed!</Text>
                <Text style={styles.successSub}>Thank you for sharing your skills.</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Rate your swap with {m.name}</Text>
                <Text style={styles.modalSubtitle}>How was the learning experience?</Text>

                {/* Stars Rating Selector */}
                <View style={styles.starsRowModal}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                      <Star
                        color="#f59e0b"
                        size={32}
                        fill={star <= rating ? '#f59e0b' : 'transparent'}
                        style={styles.modalStar}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Feedback Input */}
                <TextInput
                  value={feedback}
                  onChangeText={setFeedback}
                  placeholder="Share a short feedback review..."
                  placeholderTextColor="#8C8797"
                  multiline={true}
                  style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 12,
                    borderColor: '#E8E5EC',
                    borderWidth: 1,
                    padding: 12,
                    fontSize: 14,
                    marginBottom: 20,
                    textAlignVertical: 'top',
                  }}
                />

                {/* Modal Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setShowReviewModal(false)}
                  >
                    <Text style={styles.cancelBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitBtnModal}
                    onPress={submitReview}
                  >
                    <Text style={styles.submitBtnText}>Submit & End</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#F3F0F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#342F3D',
  },
  subtitle: {
    fontSize: 12,
    color: '#8C8797',
    marginTop: 1,
  },
  timerCard: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  contentSplit: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  videoContainer: {
    gap: 16,
  },
  videoContainerMini: {
    width: '35%',
  },
  videoContainerFull: {
    width: '100%',
  },
  peerVideoCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#E8E5EC',
    overflow: 'hidden',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  peerVideoOverlay: {
    flex: 1,
  },
  selfVideoCard: {
    height: 160,
    borderRadius: 24,
    backgroundColor: '#E8E5EC',
    overflow: 'hidden',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  videoStreamMock: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOffPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#342F3D',
  },
  offlineAvatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    marginBottom: 12,
  },
  videoOffText: {
    fontSize: 12,
    color: '#FAF9FC',
    fontWeight: '500',
  },
  nameBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 47, 61, 0.75)',
  },
  nameBadgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  whiteboardContainer: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F3F0F6',
    overflow: 'hidden',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  whiteboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F0F6',
  },
  whiteboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteboardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#342F3D',
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  colorDotActive: {
    borderColor: '#FAF9FC',
    outline: '2px solid #8b5cf6',
  },
  toolBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  canvasWrapper: {
    flex: 1,
    backgroundColor: '#FAF9FC',
  },
  htmlCanvas: {
    width: '100%',
    height: '100%',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#F3F0F6',
  },
  controlCircleBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  controlCircleBtnInactive: {
    backgroundColor: '#FAF9FC',
  },
  controlCircleBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  whiteboardToggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 99,
    backgroundColor: '#FAF9FC',
  },
  whiteboardToggleBtnActive: {
    backgroundColor: '#8b5cf6',
  },
  whiteboardToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5E5470',
  },
  whiteboardToggleTextActive: {
    color: '#ffffff',
  },
  hangUpBtn: {
    backgroundColor: '#ef4444',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(52, 47, 61, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'rgba(94, 84, 112, 0.25)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 1,
    shadowRadius: 48,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#342F3D',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#8C8797',
    marginBottom: 20,
  },
  starsRowModal: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  modalStar: {
    marginHorizontal: 2,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#FAF9FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5E5470',
  },
  submitBtnModal: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  successWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#342F3D',
    marginTop: 16,
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    color: '#8C8797',
  },
  chatDrawerContainer: {
    width: 280,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#F3F0F6',
    overflow: 'hidden',
    shadowColor: 'rgba(94, 84, 112, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
    height: '100%',
    justifyContent: 'space-between',
  },
  chatDrawerHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F0F6',
    backgroundColor: '#ffffff',
  },
  chatDrawerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#342F3D',
  },
  chatDrawerMessages: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FAF9FC',
  },
  chatDrawerInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#F3F0F6',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  chatDrawerInput: {
    flex: 1,
    backgroundColor: '#FAF9FC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#342F3D',
  },
  chatDrawerSendBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  msgLeft: {
    justifyContent: 'flex-start',
  },
  msgRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: '#8b5cf6',
    borderBottomRightRadius: 2,
  },
  bubbleThem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E8E5EC',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 13,
  },
  textMe: {
    color: '#ffffff',
  },
  textThem: {
    color: '#342F3D',
  },
  msgTime: {
    fontSize: 8,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  timeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeThem: {
    color: '#8C8797',
  },
  shareBtn: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
