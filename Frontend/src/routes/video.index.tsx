import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Monitor, 
  Phone, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentors } from '../lib/api';

export const Route = createFileRoute('/video/')({
  component: VideoHub,
});

export default function VideoHub() {
  const router = useRouter();
  const [mentorList, setMentorList] = useState<Mentor[]>(mentors);
  const [customRoom, setCustomRoom] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMentors()
      .then((data) => {
        if (active && data.length > 0) {
          setMentorList(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic mentors:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleStartInstant = () => {
    const roomId = customRoom.trim() ? customRoom.trim().toLowerCase().replace(/\s+/g, '-') : 'live-session';
    router.navigate({ to: '/video/$id', params: { id: roomId } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Hero Live Video Hub Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-6 sm:p-10 text-white shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>HD Real-Time Video & Screen Share</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            SkillSwap Live Video Classrooms
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connect face-to-face with mentors and peers. Share your screen in real time, collaborate on the live whiteboard, and exchange skills seamlessly.
          </p>

          {/* Quick Instant Session Join / Start Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
            <input
              type="text"
              placeholder="Enter meeting room code or peer name..."
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:border-purple-400 backdrop-blur-md"
            />
            <button
              onClick={handleStartInstant}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              <Video className="w-4 h-4" />
              <span>Start Instant Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Real-Time Screen Share</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Share any application window, browser tab, or entire monitor in crystal clear 60 FPS HD with built-in audio.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">HD Video & Audio Calling</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero install required. Runs straight in your browser or phone with dynamic noise suppression and mute controls.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Interactive Canvas Whiteboard</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Draw diagrams, annotate code snippets, and instantly send canvas snapshots into the conversation chat.
          </p>
        </div>
      </div>

      {/* Active Available Mentors to Call */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Mentors for Video Calls</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a mentor below to launch a 1-on-1 video and screen share session immediately.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {mentorList.length} Mentors Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentorList.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-200/80 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-12 h-12 rounded-2xl bg-white border object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{m.name}</h4>
                  <p className="text-xs text-purple-600 font-semibold truncate">{m.expertise}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{m.mode || 'Online Video'} • {m.level}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                <button
                  onClick={() => router.navigate({ to: '/chat/$id', params: { id: m.id } })}
                  className="py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors text-center"
                >
                  Chat First
                </button>
                <button
                  onClick={() => router.navigate({ to: '/video/$id', params: { id: m.id } })}
                  className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
