import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Star, Clock, CheckCircle2, AlertTriangle, Sparkles, User, Calendar } from 'lucide-react';
import { fetchMentors } from '../lib/api';
import { Mentor } from '../lib/data';

export const Route = createFileRoute('/activity')({
  component: Activity,
});

const tabs = ['Learning', 'Teaching', 'Upcoming', 'Completed'] as const;

export default function Activity() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [tab, setTab] = useState<typeof tabs[number]>('Learning');
  const [suggestedList, setSuggestedList] = useState<Mentor[]>([]);
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMentors()
      .then((data) => {
        if (active) {
          setSuggestedList(data.slice(0, 3));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (isFocused || typeof window !== 'undefined') {
      try {
        const bookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
        setLocalBookings(bookings);
      } catch (e) {
        console.warn('Failed to parse local bookings:', e);
      }
    }
  }, [isFocused]);

  const totalBooked = localBookings.length;
  const completedSessions = localBookings.filter(b => b.status === 'completed').length;
  const missedSessions = localBookings.filter(b => b.status === 'missed' || b.status === 'cancelled').length;

  const attendancePct = totalBooked > 0 
    ? Math.round((completedSessions / totalBooked) * 100) 
    : 100;

  const trustScore = Math.min(100, Math.max(70, 95 + completedSessions * 2 - missedSessions * 5));

  const getItems = () => {
    const mergedLearning = localBookings.length > 0 ? localBookings : [
      { id: 'b1', skill: 'Public Speaking', with: 'ENAMALA SHANI PRIYA', time: 'Wednesday · 3:00 PM', status: 'upcoming', rating: 5 },
      { id: 'b2', skill: 'Technical Writing', with: 'ENAMALA SHANI PRIYA', time: 'Thursday · 4:00 PM', status: 'upcoming', rating: 4.9 },
      { id: 'b3', skill: 'Full-Stack Development', with: 'P.Venkata Sai Pradeep Reddy', time: 'Wednesday · 5:00 PM', status: 'completed', rating: 5 }
    ];
    const mergedTeaching: any[] = [];

    if (tab === 'Learning') return mergedLearning;
    if (tab === 'Teaching') return mergedTeaching;
    if (tab === 'Upcoming') return mergedLearning.filter((x) => x.status === 'upcoming');
    return mergedLearning.filter((x) => x.status === 'completed');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Swap Activity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Track your active skill learning, teaching sessions, and trust score metrics.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Trust Score</span>
            <span className="text-3xl font-extrabold text-purple-600 mt-1 block">{trustScore}</span>
            <span className="text-xs font-semibold text-emerald-600 mt-1 inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{trustScore > 90 ? 'Top tier reliability' : 'Verified peer'}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            🛡️
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">{attendancePct}%</span>
            <span className="text-xs font-semibold text-slate-400 mt-1 block">
              {missedSessions} missed sessions
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            📅
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
        {tabs.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                active
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* List Items Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">{tab} Sessions ({getItems().length})</h2>
        
        {getItems().length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No sessions found in {tab.toLowerCase()}.
          </div>
        ) : (
          <div className="space-y-3">
            {getItems().map((it) => (
              <div
                key={it.id || it.skill + it.time}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/30 border border-slate-100 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    it.status === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {it.status === 'upcoming' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{it.skill}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">with <strong className="text-slate-700">{it.with}</strong></p>
                    <span className="text-[11px] text-slate-400 mt-1 block font-medium">{it.time}</span>
                  </div>
                </div>

                {it.rating > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{it.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Peers Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-slate-900">Suggested Peers for You</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestedList.map((m) => (
            <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl bg-white border object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{m.name}</h4>
                <p className="text-[11px] text-purple-600 font-semibold truncate">{m.expertise || 'SkillSwap Peer'}</p>
              </div>
              <button
                onClick={() => router.navigate({ to: `/profile/$id`, params: { id: m.id } })}
                className="text-xs font-bold text-purple-600 hover:underline shrink-0"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Caution Reminder Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold">Reliability reminder</h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Missing 3+ sessions flags your profile as low reliability and reduces your match score visibility.
          </p>
        </div>
      </div>
    </div>
  );
}
