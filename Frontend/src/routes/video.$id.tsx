import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Video, 
  ExternalLink, 
  Radio, 
  Monitor, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  PhoneOff, 
  RotateCcw,
  ShieldCheck,
  MessageCircle,
  Clock,
  Send
} from 'lucide-react';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';
import { 
  GOOGLE_MEET_NEW_URL, 
  getVideoReturnUrl, 
  launchGoogleMeet, 
  releaseMediaDevices 
} from '../lib/meet';

export const Route = createFileRoute('/video/$id')({
  component: GoogleMeetBridgeRoom,
});

export default function GoogleMeetBridgeRoom() {
  const router = useRouter();

  // Extract ID from pathname or fallback
  let id = 'aria-shah';
  if (typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'video') {
      id = lastPart;
    }
  }

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetLaunched, setMeetLaunched] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callEnded, setCallEnded] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const meetWindowRef = useRef<Window | null>(null);

  // Load mentor information
  useEffect(() => {
    let active = true;
    setLoading(true);

    // Free any camera/mic hardware so Google Meet has exclusive access
    releaseMediaDevices();

    if (id === 'google-meet' || id === 'live-session') {
      // General video call session
      setMentor({
        id: 'google-meet',
        name: 'SkillSwap Video Mentor',
        role: 'Live Session Partner',
        company: 'SkillSwap Community',
        rating: 4.9,
        reviewsCount: 38,
        hourlyRate: 'Free Swap',
        expertise: ['Real-Time Collaboration', 'Screen Share'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        bio: 'Connecting live via Google Meet for high-definition 1-on-1 skill exchange and screen sharing.',
        skillsToTeach: ['Live Pair Programming', 'Skill Swap Discussion'],
        skillsToLearn: ['Feedback', 'Knowledge Sharing'],
        available: true,
      });
      setLoading(false);
    } else {
      fetchMentorById(id)
        .then((m) => {
          if (active && m) {
            setMentor(m);
          } else if (active) {
            const fallback = mentors.find((x) => x.id === id) || mentors[0];
            setMentor(fallback);
          }
        })
        .catch(() => {
          if (active) {
            const fallback = mentors.find((x) => x.id === id) || mentors[0];
            setMentor(fallback);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
      releaseMediaDevices();
    };
  }, [id]);

  // Launch Google Meet on mount (once mentor is ready)
  useEffect(() => {
    if (loading || meetLaunched) return;

    // Launch Google Meet in new tab
    const w = launchGoogleMeet({ returnUrl: getVideoReturnUrl() });
    if (w) {
      meetWindowRef.current = w;
      setMeetLaunched(true);
    } else {
      // If popup was blocked, set flag so user can click manually
      setMeetLaunched(true);
    }
  }, [loading, meetLaunched]);

  // Call duration timer
  useEffect(() => {
    if (callEnded) return;
    const timer = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callEnded]);

  // Detect when user cuts/closes the Google Meet window or returns focus to SkillSwap
  useEffect(() => {
    const checkMeetClosed = () => {
      if (meetWindowRef.current && meetWindowRef.current.closed && !callEnded) {
        setCallEnded(true);
        setShowReviewModal(true);
      }
    };

    const interval = setInterval(checkMeetClosed, 1500);

    const onWindowFocus = () => {
      checkMeetClosed();
    };
    window.addEventListener('focus', onWindowFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [callEnded]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualLaunchMeet = () => {
    releaseMediaDevices();
    const w = window.open(GOOGLE_MEET_NEW_URL, '_blank');
    if (w) {
      meetWindowRef.current = w;
    }
  };

  const handleDirectRedirect = () => {
    releaseMediaDevices();
    window.location.href = GOOGLE_MEET_NEW_URL;
  };

  const handleEndCall = () => {
    if (meetWindowRef.current && !meetWindowRef.current.closed) {
      try {
        meetWindowRef.current.close();
      } catch (e) {
        // Ignore cross-origin close errors
      }
    }
    setCallEnded(true);
    setShowReviewModal(true);
  };

  const returnToSkillSwap = () => {
    setShowReviewModal(false);
    releaseMediaDevices();
    const returnUrl = getVideoReturnUrl();
    if (returnUrl && !returnUrl.startsWith('/video')) {
      router.navigate({ to: returnUrl as any });
    } else if (id && id !== 'google-meet' && id !== 'live-session') {
      router.navigate({ to: '/chat/$id', params: { id } });
    } else {
      router.navigate({ to: '/home' });
    }
  };

  const submitReview = () => {
    setSubmitted(true);
    setTimeout(() => {
      returnToSkillSwap();
    }, 1000);
  };

  if (loading || !mentor) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Connecting to Google Meet...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={returnToSkillSwap}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors py-2 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to SkillSwap</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            {callEnded ? 'Call Finished' : `Live Call · ${formatDuration(callDuration)}`}
          </span>
        </div>
      </div>

      {/* Main Google Meet Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 shadow-2xl border border-purple-500/20">
        
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Google Meet Video Call Session</span>
          </div>

          {/* Mentor Profile Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-purple-400/50 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {mentor.name}
              </h1>
              <p className="text-purple-200 text-sm font-medium">
                {mentor.role || mentor.expertise?.[0] || 'Peer Mentor'} {mentor.company ? `• ${mentor.company}` : ''}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {mentor.expertise?.slice(0, 3).map((exp) => (
                  <span
                    key={exp}
                    className="px-2.5 py-0.5 rounded-lg bg-white/10 text-white/90 text-[11px] font-semibold border border-white/10"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Call Status Description */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-sm leading-relaxed space-y-2">
            <p className="font-semibold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Video call is active on Google Meet</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              Your camera, microphone, and screen share are running directly through Google Meet for highest quality HD video. SkillSwap is kept on standby in this tab so you can return instantly when you cut the call.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={handleManualLaunchMeet}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Google Meet Window</span>
            </button>

            <button
              onClick={handleDirectRedirect}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              title="Redirect the current tab directly to Google Meet"
            >
              <span>Go to Meet in Current Tab</span>
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3.5 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>

          {/* Google Meet Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">HD Video & Audio</p>
                <p className="text-slate-400 text-[11px]">Native Google camera</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Full Screen Sharing</p>
                <p className="text-slate-400 text-[11px]">Any tab or window</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Auto-Return</p>
                <p className="text-slate-400 text-[11px]">Resumes SkillSwap</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Review Modal when Call Ends */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Call Completed!
              </h2>
              <p className="text-xs text-slate-500">
                Your session with {mentor.name} lasted {formatDuration(callDuration)}. How was your skill swap?
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-center text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you! Returning to SkillSwap...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 5-star rating */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share a quick note about your swap session (optional)..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={returnToSkillSwap}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={submitReview}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Return</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
