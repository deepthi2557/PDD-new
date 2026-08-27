import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Crown, Star, Award, Sparkles } from 'lucide-react';
import { fetchMentors } from '../lib/api';

export const Route = createFileRoute('/leaderboard')({
  component: Board,
});

const tabs = ['Mentors', 'Learners', 'Skills'] as const;

export default function Board() {
  const router = useRouter();
  const [tab, setTab] = useState<typeof tabs[number]>('Mentors');
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMentors()
      .then((data) => {
        if (!active) return;
        const ranked = data.map((user, idx) => {
          const calculatedScore = Math.round((user.rating || 4.8) * 900 + (user.sessions || 10) * 45 + (user.reviews || 5) * 12);
          return {
            id: user.id,
            rank: idx + 1,
            name: user.name,
            avatar: user.avatar,
            score: calculatedScore,
            badge: user.badge === 'Top Contributor' ? '🏆' : user.badge === 'Verified Mentor' ? '🎖️' : '⭐',
            expertise: user.expertise,
          };
        }).sort((a, b) => b.score - a.score).map((u, i) => ({ ...u, rank: i + 1 }));

        setRealUsers(ranked);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard load error:', err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const top3 = realUsers.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Trophy className="w-7 h-7 text-amber-500 fill-amber-400" />
          <span>SkillSwap Leaderboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Top-rated community mentors, active learners, and trending skill exchange topics.
        </p>
      </div>

      {/* Live Podium Card Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-4">
            ✨ Live Top Contributor Podium
          </span>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-4 sm:gap-8 pt-4">
              {podiumOrder.map((user, i) => {
                if (!user) return null;
                const isFirst = user.rank === 1;
                const podiumHeights = ['h-24', 'h-36', 'h-20'];

                return (
                  <div key={user.name + i} className="flex flex-col items-center flex-1 max-w-[140px]">
                    {isFirst && <Crown className="w-7 h-7 text-amber-400 fill-amber-400 mb-1 animate-bounce" />}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={`rounded-2xl border-4 ${isFirst ? 'border-amber-400 w-16 h-16 sm:w-20 sm:h-20 shadow-lg shadow-amber-400/30' : 'border-white/40 w-12 h-12 sm:w-14 sm:h-14'} bg-slate-100 object-cover`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-white mt-2 truncate w-full text-center">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-semibold text-purple-200">
                      {user.score} pts
                    </span>

                    <div className={`w-full ${podiumHeights[i % 3]} mt-2 rounded-t-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center`}>
                      <span className="text-lg font-extrabold text-white">#{user.rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
        {tabs.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
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

      {/* Leaderboard Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab !== 'Skills' ? (
          <div className="space-y-3">
            {realUsers.map((m) => (
              <div
                key={m.name + m.rank}
                onClick={() => router.navigate({ to: `/profile/$id`, params: { id: m.id } })}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/40 border border-slate-100 transition-colors flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className={`w-8 text-center text-sm font-extrabold ${
                    m.rank === 1 ? 'text-amber-500' : m.rank === 2 ? 'text-slate-400' : m.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{m.rank}
                  </span>

                  <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-xl bg-white border object-cover shrink-0" />

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{m.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate">{m.expertise}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                    {m.score} pts
                  </span>
                  <span className="text-lg">{m.badge}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { name: 'Python & AI Machine Learning', growth: '+42% this week' },
              { name: 'React & TypeScript Engineering', growth: '+38% this week' },
              { name: 'UI/UX Design & Figma Prototyping', growth: '+31% this week' },
              { name: 'Node.js & Cloud Backend Services', growth: '+25% this week' },
            ].map((s, i) => (
              <div key={s.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-400">#{i + 1}</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{s.name}</span>
                </div>

                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{s.growth}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Your Unlocked Badges</span>
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            { e: '📚', l: 'Fast Learner' },
            { e: '🎯', l: 'Session Master' },
            { e: '🚀', l: 'Explorer' },
          ].map((b) => (
            <div key={b.l} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-3xl block mb-1">{b.e}</span>
              <span className="text-xs font-bold text-slate-800">{b.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
