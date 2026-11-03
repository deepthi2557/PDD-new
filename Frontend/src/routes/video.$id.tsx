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
  Maximize2,
  Users,
  Settings
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
  const [screenShareError, setScreenShareError] = useState<string | null>(null);

  // Layout / Panels
  const [showWhiteboard, setShowWhiteboard] = useState(false);
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
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = displayStream;
      }
      setIsScreenSharing(true);

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
    setIsScreenSharing(false);
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
    if (!showWhiteboard || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 450;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [showWhiteboard]);

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
      <header className="px-5 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
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
                className="w-9 h-9 rounded-full object-cover border border-purple-500/50"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">{mentor.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                  {mentor.expertise}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">1-on-1 Skill Swap Session</span>
            </div>
          </div>
        </div>

        {/* Center / Right Badges: Timer & Screen Share Status */}
        <div className="flex items-center gap-2.5">
          {isScreenSharing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>LIVE SCREEN SHARE</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono font-bold text-purple-300">
            <span>⏱️ {formatTime(timeLeft)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs px-2.5 py-1 rounded-lg bg-slate-800/50">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>HD 1080p</span>
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
        
        {/* Stage Content: Screen Share / Video Tiles / Whiteboard */}
        <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 overflow-hidden">
          
          {/* Main Stage (Screen Share View OR Large Peer View) */}
          <div className="flex-1 min-h-0 bg-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden relative flex items-center justify-center shadow-inner">
            
            {/* 1. Real-time Screen Sharing Display */}
            <div className={`w-full h-full ${isScreenSharing ? 'flex' : 'hidden'} items-center justify-center bg-black relative`}>
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white">
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Your Shared Screen</span>
              </div>
              <button
                onClick={stopScreenShare}
                className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <MonitorOff className="w-3.5 h-3.5" />
                <span>Stop Sharing</span>
              </button>
            </div>

            {/* 2. Whiteboard View (When Active and not Screen Sharing) */}
            {showWhiteboard && !isScreenSharing && (
              <div className="w-full h-full flex flex-col bg-slate-950 p-2">
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

                <div className="flex-1 relative cursor-crosshair bg-slate-900/60 rounded-xl mt-2 overflow-hidden">
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

            {/* 3. Peer Video View (Default when not screen sharing and not in whiteboard mode) */}
            {!isScreenSharing && !showWhiteboard && (
              <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-slate-900 to-slate-950">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl"
                />

                {/* Animated Audio Waveform simulation for Peer */}
                <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-bold text-white">{mentor.name} (Speaking)</span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
                    Host • {mentor.role || 'Mentor'}
                  </span>
                </div>
              </div>
            )}

            {/* Picture-in-Picture: Local Camera Feed */}
            <div className="absolute bottom-4 right-4 z-20 w-36 h-24 sm:w-48 sm:h-32 bg-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl">
              {isVideoOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2">
                  <VideoOff className="w-5 h-5 mb-1 text-red-400" />
                  <span className="text-[10px] font-semibold">Camera Off</span>
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
              <div className="absolute bottom-1.5 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
                {isMuted ? <MicOff className="w-2.5 h-2.5 text-red-400" /> : <Mic className="w-2.5 h-2.5 text-emerald-400" />}
                <span>You</span>
              </div>
            </div>
          </div>
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
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            <span className="hidden sm:inline">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </button>

          {/* Whiteboard Toggle */}
          <button
            onClick={() => setShowWhiteboard(!showWhiteboard)}
            title="Toggle Whiteboard"
            className={`p-3 rounded-2xl transition-all ${
              showWhiteboard
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
