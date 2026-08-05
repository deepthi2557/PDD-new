import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Mic, MicOff, Video as VideoIcon, VideoOff, Palette, RotateCcw, PhoneOff, Star, CheckCircle2 } from 'lucide-react-native';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';
import { createFileRoute } from '@tanstack/react-router';

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
  const [showWhiteboard, setShowWhiteboard] = useState(true);
  const [drawColor, setDrawColor] = useState('#8b5cf6'); // Default violet
  const [lineWidth, setLineWidth] = useState(4);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins in seconds
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
        <View style={[styles.videoContainer, showWhiteboard ? styles.videoContainerMini : styles.videoContainerFull]}>
          {/* Peer Stream (Mentor) */}
          <View style={styles.peerVideoCard}>
            {videoOff ? (
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
            <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' }} style={styles.videoStreamMock} />
            <View style={styles.nameBadge}>
              <Text style={styles.nameBadgeText}>You (Alex)</Text>
            </View>
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
              </View>
            </View>

            {/* Canvas Area */}
            <View style={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                onMouseDown={handleStartDraw}
                onMouseMove={handleDrawing}
                onMouseUp={handleStopDraw}
                onMouseLeave={handleStopDraw}
                style={styles.htmlCanvas}
              />
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
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share a short feedback review..."
                  className="modal-textarea"
                  style={{
                    width: '100%',
                    height: 80,
                    borderRadius: 12,
                    borderColor: '#E8E5EC',
                    borderWidth: 1,
                    padding: 12,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'none',
                    marginBottom: 20,
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
    cursor: 'crosshair',
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
});
