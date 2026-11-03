import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  MessageSquare, 
  Palette, 
  RotateCcw, 
  PhoneOff, 
  Star, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  ExternalLink, 
  Wifi, 
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Users,
  LayoutGrid,
  Tv,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';

export const Route = createFileRoute('/video/$id')({
  component: VideoRoom,
});

export default function VideoRoom() {
  const router = useRouter();

  // Extract ID from pathname or fallback
  let id: string = 'aria-shah';
  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'video') {
      id = lastPart;
    }
  }

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  // Audio / Video / Screen Share states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showScreenPreview, setShowScreenPreview] = useState(false); // Off by default to eliminate infinite mirror loop!
  const [screenShareError, setScreenShareError] = useState<string | null>(null);

  // Layout View Modes: 'split' (side-by-side profile cards) | 'stage' (presentation focus) | 'whiteboard'
  const [layoutMode, setLayoutMode] = useState<'split' | 'stage' | 'whiteboard'>('split');
  const [showChat, setShowChat] = useState(false);
  const [drawColor, setDrawColor] = useState('#8b5cf6');
  const [lineWidth, setLineWidth] = useState(4);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // In-call chat
  const [msgs, setMsgs] = useState<any[]>([]);
  const [chatText, setChatText] = useState('');

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const stageScreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  // Load Mentor Data
  useEffect(() => {
    let active = true;
    fetchMentorById(id)
      .then((data) => {
        if (active) {
          setMentor(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          const fallback = mentors.find((x) => x.id === id) || mentors[0];
          setMentor(fallback);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  // Load Chat Messages
  useEffect(() => {
    if (!id || typeof window === 'undefined') return;
    const localMsgs = localStorage.getItem(`chat_msgs_${id}`);
    if (localMsgs) {
      try {
        setMsgs(JSON.parse(localMsgs));
      } catch (e) {
        console.error(e);
      }
    } else {
      setMsgs([
        { from: 'them', text: `Welcome to our live swap session! I am ready whenever you are.`, time: 'Now' }
      ]);
    }
  }, [id]);

  // Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start Camera Stream on mount
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
        .then((s) => {
          stream = s;
          localStreamRef.current = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera / Mic permission denied or unavailable:', err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Sync Local Video Ref when video state changes or component re-renders
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && !isVideoOff) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isVideoOff, layoutMode, isScreenSharing]);

  // Sync Screen Share Video Ref whenever preview or stage is active
  useEffect(() => {
    if (isScreenSharing && screenStreamRef.current) {
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStreamRef.current;
      }
      if (stageScreenVideoRef.current) {
        stageScreenVideoRef.current.srcObject = screenStreamRef.current;
      }
    }
  }, [isScreenSharing, showScreenPreview, layoutMode]);

  // Toggle Mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => {
        t.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => {
        t.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Real-Time Screen Share Toggle
  const startScreenShare = async () => {
    setScreenShareError(null);
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        setScreenShareError('Screen sharing is not supported by your current browser.');
        return;
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always' as any,
          displaySurface: 'monitor' as any,
        },
        audio: true,
      });

      screenStreamRef.current = displayStream;
      setIsScreenSharing(true);
      setShowScreenPreview(false); // Keep off by default to avoid recursive loop

      // Listen for browser's native "Stop Sharing" floating button
      const videoTrack = displayStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }
    } catch (err: any) {
      console.warn('Screen share error:', err);
      if (err.name !== 'NotAllowedError') {
        setScreenShareError('Could not start screen share: ' + (err.message || 'Permission denied'));
      }
    }
  };

  const stopScreenShare = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }
    if (stageScreenVideoRef.current) {
      stageScreenVideoRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
    setShowScreenPreview(false);
  };

  const toggleScreenShare = () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  // In-call Chat Message Send
  const sendChatMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatText.trim() || !id) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      from: 'me',
      text: chatText.trim(),
      time: timeNow,
    };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setChatText('');
  };

  // Whiteboard Canvas Handlers
  useEffect(() => {
    if (layoutMode !== 'whiteboard' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 450;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [layoutMode]);

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
      const snapshotMsg = {
        from: 'me',
        text: '🎨 Shared a whiteboard snapshot to chat',
        image: snapshotUrl,
        time: timeNow,
      };
      const updated = [...msgs, snapshotMsg];
      setMsgs(updated);
      localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
      setShowChat(true);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      router.navigate({ to: '/activity' });
    }, 1200);
  };

  if (loading || !mentor) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Connecting to Video Classroom...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Top Header Bar */}
      <header className="px-4 sm:px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 shrink-0 gap-3">
        
        {/* Left: Mentor Details */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.navigate({ to: '/chat/$id', params: { id } })}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Leave to Chat"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/60 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white truncate max-w-[140px] sm:max-w-none">{mentor.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[10px] font-semibold hidden sm:inline-block">
                  {mentor.expertise}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium block">1-on-1 Skill Swap Session</span>
            </div>
          </div>
        </div>

        {/* Center: View Layout Switcher (Profiles Grid vs Stage vs Whiteboard) */}
        <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60 gap-1">
          <button
            onClick={() => setLayoutMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'split'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Side-by-Side Profiles Grid (Screen Share in Profile)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Profile Grid</span>
          </button>

          <button
            onClick={() => setLayoutMode('stage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'stage'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Theater / Stage Mode"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Stage View</span>
          </button>

          <button
            onClick={() => setLayoutMode('whiteboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              layoutMode === 'whiteboard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Collaborative Whiteboard Canvas"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Whiteboard</span>
          </button>
        </div>

        {/* Right Badges: Timer & Screen Share Status */}
        <div className="flex items-center gap-2.5">
          {isScreenSharing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
              <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
              <span className="hidden sm:inline">SCREEN ACTIVE</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono font-bold text-purple-300">
            <span>⏱️ {formatTime(timeLeft)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs px-2.5 py-1 rounded-lg bg-slate-800/50">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>HD</span>
          </div>
        </div>
      </header>

      {/* Screen Share Error Alert */}
      {screenShareError && (
        <div className="bg-red-500/20 border-b border-red-500/40 px-4 py-2 text-red-200 text-xs flex items-center justify-between z-20">
          <span>{screenShareError}</span>
          <button onClick={() => setScreenShareError(null)} className="font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Main Classroom Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Stage Content Area */}
        <div className="flex-1 flex flex-col p-3 sm:p-5 gap-4 overflow-hidden">
          
          {/* ============================================================ */}
          {/* MODE 1: PROFILES GRID (Screen share is inside each profile) */}
          {/* ============================================================ */}
          {layoutMode === 'split' && (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 overflow-hidden">
              
              {/* ---------------------------------------------------- */}
              {/* PERSON 1: MENTOR'S PROFILE CARD                      */}
              {/* ---------------------------------------------------- */}
              <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative group">
                
                {/* Profile Card Header */}
                <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/50"
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{mentor.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400 fill-purple-950" />
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 font-semibold">
                    Mentor • {mentor.expertise}
                  </span>
                </div>

                {/* Profile Video / Avatar Stage */}
                <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                  
                  {/* Big Glowing Avatar */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-purple-500/40 shadow-2xl relative z-10"
                      />
                      <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 z-20" title="Online" />
                    </div>

                    <h3 className="text-base font-bold text-white mt-4">{mentor.name}</h3>
                    <p className="text-xs text-purple-400 font-medium mt-0.5">{mentor.role || 'Host Mentor'}</p>

                    {/* Audio Speaking Waveform for Mentor */}
                    <div className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
                      <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.15s]" />
                      <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.45s]" />
                      <span className="text-[10px] font-bold text-slate-300 ml-1">Live Audio</span>
                    </div>
                  </div>

                  {/* Mentor Badge in Bottom Corner */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] font-semibold text-slate-300">
                      ⭐ {mentor.rating} ({mentor.reviewsCount} sessions)
                    </span>
                  </div>
                </div>

                {/* Profile Card Footer */}
                <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-medium">Microphone Active</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Host Stream</span>
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* PERSON 2: YOUR PROFILE CARD (WITH SCREEN SHARE INSIDE)*/}
              {/* ---------------------------------------------------- */}
              <div className={`flex flex-col rounded-3xl border shadow-xl overflow-hidden relative transition-all ${
                isScreenSharing 
                  ? 'bg-slate-900 border-emerald-500/50 ring-2 ring-emerald-500/20' 
                  : 'bg-slate-900 border-slate-800'
              }`}>
                
                {/* Profile Card Header */}
                <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-purple-400/40">
                      You
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block leading-tight">Your Profile</span>
                      <span className="text-[10px] text-slate-400">Learner & Co-Host</span>
                    </div>
                  </div>

                  {/* Right Header Status / Toggle in Card */}
                  <div className="flex items-center gap-2">
                    {isScreenSharing && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Screen Sharing
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile Video / Screen Share Stage */}
                <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
                  
                  {/* CASE A: SCREEN SHARING ACTIVE INSIDE YOUR PROFILE */}
                  {isScreenSharing ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950 relative">
                      
                      {/* Sub-view 1: High-Definition Live Preview (When toggled on) */}
                      {showScreenPreview ? (
                        <div className="w-full h-full relative flex items-center justify-center bg-black rounded-2xl overflow-hidden border border-slate-800">
                          <video
                            ref={screenVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700 flex items-center gap-1.5">
                            <Monitor className="w-3 h-3 text-emerald-400" />
                            <span>Live Screen Broadcast</span>
                          </div>
                        </div>
                      ) : (
                        /* Sub-view 2: Anti-Mirror Presenter Mode (Default - prevents infinite screen mirror!) */
                        <div className="flex flex-col items-center justify-center text-center max-w-sm px-4 py-6 space-y-3">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
                              <Monitor className="w-8 h-8" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-white">You are sharing your screen</h4>
                            <p className="text-xs text-slate-400 mt-1">
                              Your screen is streaming live to <span className="text-purple-300 font-semibold">{mentor.name}</span>.
                            </p>
                          </div>

                          {/* Anti-Mirror Infinite Reflection Helper Tip */}
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed text-left flex items-start gap-2">
                            <span className="text-amber-400 shrink-0">💡</span>
                            <span>
                              <strong>Anti-Mirror Mode Active:</strong> Switch to your presentation, code, or application tab to present without recursive reflections.
                            </span>
                          </div>

                          {/* Action Buttons inside Your Profile Card */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => setShowScreenPreview(true)}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-purple-400" />
                              <span>Show Live Preview</span>
                            </button>

                            <button
                              onClick={stopScreenShare}
                              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                            >
                              <MonitorOff className="w-3.5 h-3.5" />
                              <span>Stop Sharing</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Floating Mini WebCam Feed inside Your Card when sharing screen */}
                      <div className="absolute bottom-3 right-3 w-28 h-20 bg-slate-900 rounded-xl border border-slate-700/80 overflow-hidden shadow-2xl z-10">
                        {isVideoOff ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[9px] font-semibold">
                            <VideoOff className="w-3.5 h-3.5 text-red-400 mb-0.5" />
                            <span>Camera Off</span>
                          </div>
                        ) : (
                          <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                          />
                        )}
                        <span className="absolute bottom-1 left-1.5 text-[8px] font-bold text-white bg-black/60 px-1 rounded">Cam</span>
                      </div>
                    </div>
                  ) : (
                    /* CASE B: WEBCAM / PROFILE DISPLAY WHEN NOT SCREEN SHARING */
                    <div className="w-full h-full flex items-center justify-center relative">
                      {isVideoOff ? (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-2">
                            <VideoOff className="w-8 h-8 text-red-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-300">Your Camera is Off</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Click camera button below to turn on</p>
                        </div>
                      ) : (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover transform -scale-x-100"
                        />
                      )}

                      {/* Microphone Badge */}
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-white flex items-center gap-1.5 border border-slate-700/70">
                        {isMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                        <span>{isMuted ? 'Muted' : 'Speaking'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Card Footer with Dedicated Action Buttons */}
                <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Share Screen Button right inside Your Profile Card */}
                    <button
                      onClick={toggleScreenShare}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                        isScreenSharing
                          ? 'bg-red-600/90 hover:bg-red-600 text-white shadow-sm'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                      }`}
                    >
                      {isScreenSharing ? <MonitorOff className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                      <span>{isScreenSharing ? 'Stop Screen Share' : 'Share My Screen'}</span>
                    </button>

                    {isScreenSharing && showScreenPreview && (
                      <button
                        onClick={() => setShowScreenPreview(false)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1"
                        title="Hide Preview to avoid mirror reflection"
                      >
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hide Preview</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <button 
                      onClick={toggleMute}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isMuted ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>

                    <button 
                      onClick={toggleVideo}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isVideoOff ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title={isVideoOff ? 'Turn on Camera' : 'Turn off Camera'}
                    >
                      {isVideoOff ? <VideoOff className="w-3.5 h-3.5" /> : <VideoIcon className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 2: STAGE VIEW (Maximized Screen Share / Main Focus)     */}
          {/* ============================================================ */}
          {layoutMode === 'stage' && (
            <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
              <div className="flex-1 bg-black rounded-3xl border border-slate-800 overflow-hidden relative flex items-center justify-center">
                {isScreenSharing ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <video
                      ref={stageScreenVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white">
                      <Monitor className="w-4 h-4 text-emerald-400" />
                      <span>Stage Presentation</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Tv className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-sm font-bold text-white">No active screen share on stage</h3>
                    <p className="text-xs text-slate-400">Click "Share Screen" below or switch to Profile Grid view.</p>
                  </div>
                )}
              </div>

              {/* Both Participants Docked Below Stage */}
              <div className="h-28 grid grid-cols-2 gap-3 shrink-0">
                {/* Mentor Dock Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2.5 flex items-center gap-3">
                  <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-xl object-cover border border-purple-500/50" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{mentor.name}</h4>
                    <span className="text-[10px] text-purple-400 font-semibold">{mentor.expertise}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Mentor (Speaking)</span>
                  </div>
                </div>

                {/* You Dock Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative">
                      {!isVideoOff && (
                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      )}
                      {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">You</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Your Feed</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">{isScreenSharing ? 'Sharing Active' : 'Camera Ready'}</span>
                    </div>
                  </div>

                  <button
                    onClick={toggleScreenShare}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    {isScreenSharing ? <MonitorOff className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                    <span>{isScreenSharing ? 'Stop' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 3: COLLABORATIVE WHITEBOARD                             */}
          {/* ============================================================ */}
          {layoutMode === 'whiteboard' && (
            <div className="flex-1 flex flex-col bg-slate-950 rounded-3xl border border-slate-800 p-3 overflow-hidden min-h-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Interactive Canvas Whiteboard</span>
                </div>
                
                {/* Whiteboard Controls */}
                <div className="flex items-center gap-1.5">
                  {['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDrawColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full transition-transform ${drawColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80'}`}
                    />
                  ))}
                  <button
                    onClick={clearCanvas}
                    title="Clear Canvas"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={shareWhiteboardSnapshot}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold ml-1 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send to Chat</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 relative cursor-crosshair bg-slate-900/60 rounded-2xl mt-2 overflow-hidden border border-slate-800/80">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleStartDraw}
                  onMouseMove={handleDrawing}
                  onMouseUp={handleStopDraw}
                  onMouseLeave={handleStopDraw}
                  className="w-full h-full block"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right Drawer: In-Call Live Chat */}
        {showChat && (
          <aside className="w-80 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">In-Call Messages</h3>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, idx) => {
                const isMe = m.from === 'me';
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs font-medium ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {m.image && (
                        <img src={m.image} alt="Whiteboard" className="rounded-lg mb-1.5 max-h-36 object-contain bg-white" />
                      )}
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.time}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={sendChatMessage} className="p-3 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message in call..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!chatText.trim()}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* Bottom Floating Call Controls Bar */}
      <footer className="px-4 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 z-20 shrink-0">
        
        {/* Left: Meeting Metadata */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-300">Room: swap-{id}</span>
        </div>

        {/* Center: Main Media Controls */}
        <div className="flex items-center gap-2.5 mx-auto">
          
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            className={`p-3 rounded-2xl transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleVideo}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            className={`p-3 rounded-2xl transition-all ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* REAL-TIME SCREEN SHARE BUTTON */}
          <button
            onClick={toggleScreenShare}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen in Real Time'}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs transition-all shadow-md ${
              isScreenSharing
                ? 'bg-red-600 hover:bg-red-700 text-white border border-red-400 ring-2 ring-red-500/30'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            <span className="hidden sm:inline">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </button>

          {/* Whiteboard Toggle */}
          <button
            onClick={() => setLayoutMode(layoutMode === 'whiteboard' ? 'split' : 'whiteboard')}
            title="Toggle Whiteboard"
            className={`p-3 rounded-2xl transition-all ${
              layoutMode === 'whiteboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Palette className="w-5 h-5" />
          </button>

          {/* In-Call Chat Toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            title="Toggle Chat"
            className={`p-3 rounded-2xl transition-all relative ${
              showChat
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {!showChat && msgs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full" />
            )}
          </button>

          {/* Hang Up Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            title="End Video Session"
            className="p-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:shadow-red-600/30 ml-2"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Jitsi Meet External Link Fallback */}
        <div className="hidden lg:flex items-center gap-2">
          <a
            href={`https://meet.jit.si/SkillSwap-${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Jitsi</span>
          </a>
        </div>
      </footer>

      {/* Review Modal on End Call */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            {submitted ? (
              <div className="py-6 space-y-2">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Swap Session Completed!</h3>
                <p className="text-xs text-slate-400">Your feedback has been recorded and your trust score updated.</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Rate your session with {mentor.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">How was the skill exchange and screen share experience?</p>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setRating(s)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-7 h-7 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave a short note for the mentor..."
                  className="w-full h-20 p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 outline-none resize-none focus:border-purple-500"
                />

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Back to Call
                  </button>
                  <button
                    onClick={submitReview}
                    className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md"
                  >
                    Complete & Exit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
