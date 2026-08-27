import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Star, 
  MessageCircle, 
  CalendarPlus, 
  ShieldCheck, 
  Flame, 
  Trophy, 
  Sparkles, 
  X, 
  SlidersHorizontal,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { categories, sortOptions, searchSuggestions, type Mentor } from '../lib/data';
import { fetchMentors, fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/home')({
  component: Home,
});

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Top Rated');
  const [sortOpen, setSortOpen] = useState(false);
  const [mentorsList, setMentorsList] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        fetchMentorById(user.id)
          .then((profileData) => {
            setCurrentUser(profileData);
          })
          .catch(() => {
            setCurrentUser({
              id: user.id,
              name: user.user_metadata?.full_name || 'Learner',
              avatar: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
            });
          });
      }
    });
  }, []);

  // Double-matching states
  const [doubleMatches, setDoubleMatches] = useState<Mentor[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [myProfile, setMyProfile] = useState<any>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchMentors({
      name: search,
      tag: cat,
    })
      .then((data) => {
        if (active) {
          let sorted = [...data];
          if (sort === 'Top Rated') {
            sorted.sort((a, b) => b.rating - a.rating);
          } else if (sort === 'Newest') {
            sorted.sort((a, b) => b.followers - a.followers);
          } else if (sort === 'Most Active') {
            sorted.sort((a, b) => b.sessions - a.sessions);
          }
          setMentorsList(sorted);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cat, search, sort]);

  // Load my profile & find double matches
  useEffect(() => {
    try {
      let profile = JSON.parse(localStorage.getItem('my_profile') || 'null');
      if (!profile) {
        profile = {
          id: 'my-mock-user',
          name: 'Alex',
          expertise: 'Full-Stack Coding',
          teaches: 2,
          tags: ['React', 'Node', 'TypeScript'],
          interests: ['Python', 'Figma', 'AI', 'Communication']
        };
        localStorage.setItem('my_profile', JSON.stringify(profile));
      }
      setMyProfile(profile);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!myProfile || mentorsList.length === 0) return;
    const myInterests = myProfile.interests || ['Python', 'Figma', 'AI'];
    const myTeaches = myProfile.tags || ['React', 'Node'];

    const matches = mentorsList.filter((m) => {
      const peerTeachesInterest = m.tags ? m.tags.some((tag: string) =>
        myInterests.some((interest: string) => tag.toLowerCase().includes(interest.toLowerCase()))
      ) : false;

      const peerLearningNeeds: Record<string, string[]> = {
        'aria-shah': ['React', 'TypeScript'],
        'leo-park': ['TypeScript', 'Node'],
        'maya-iyer': ['Python', 'Figma'],
        'noah-fields': ['React', 'Node'],
        'sara-kim': ['Figma', 'React'],
        'ravi-mehta': ['TypeScript', 'React']
      };
      
      const needs = peerLearningNeeds[m.id] || ['React', 'TypeScript'];
      const peerWantsMyTeaches = needs.some((n: string) =>
        myTeaches.some((t: string) => t.toLowerCase().includes(n.toLowerCase()))
      );

      return peerTeachesInterest && peerWantsMyTeaches;
    });

    setDoubleMatches(matches);
  }, [myProfile, mentorsList]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Peer-to-Peer Skill Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hi, {currentUser ? currentUser.name : 'Learner'} 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Teach what you know, learn what you need. Connect with top mentors and swap skills directly.
          </p>

          {/* Quick Search Input inside Banner */}
          <div className="mt-6 flex items-center bg-white rounded-2xl p-1.5 shadow-lg max-w-xl border border-white/20">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Search by skill, topic, or mentor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="p-1 text-slate-400 hover:text-slate-600 mr-1">
                <X className="w-4 h-4" />
              </button>
            )}
            <button className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shrink-0 transition-colors shadow-xs">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Double Match Recommendation Banner */}
      {doubleMatches.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Perfect Double-Matches Found!</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                We found {doubleMatches.length} peers who want to learn your skills and can teach yours.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowMatchModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-colors shrink-0"
          >
            View Double-Matches
          </button>
        </div>
      )}

      {/* Filter Chips & Sort Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Category Chips Scroller */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
            {categories.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    active
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
              <span>Sort: <strong className="text-purple-700">{sort}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30">
                {sortOptions.map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setSort(o);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${
                      sort === o ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Suggestions Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="font-semibold text-slate-400 shrink-0">Popular:</span>
          {searchSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => setSearch(s)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 font-medium transition-colors shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Mentor Cards Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Discovering Mentors...</p>
        </div>
      ) : mentorsList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-800">No Mentors Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filter.</p>
          <button
            onClick={() => { setCat('All'); setSearch(''); }}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorsList.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Cover Banner */}
              <div className="h-32 w-full relative bg-slate-100 overflow-hidden">
                <img
                  src={mentor.coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80'}
                  alt="Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  <span>{mentor.rating || 4.9}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 pt-0 flex-1 flex flex-col relative">
                {/* Avatar Badge */}
                <div className="-mt-10 mb-3 flex items-end justify-between">
                  <div className="relative">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl border-4 border-white bg-slate-100 shadow-md object-cover"
                    />
                    <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      mentor.online ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                    {mentor.mode || 'Online'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {mentor.name}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-purple-600 fill-purple-100" />
                  </div>
                  <p className="text-xs font-semibold text-purple-600 mt-0.5">
                    {mentor.expertise}
                  </p>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {mentor.bio || 'Experienced mentor ready to swap knowledge and help you master new skills.'}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {mentor.tags && mentor.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {mentor.tags && mentor.tags.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[11px] font-medium">
                        +{mentor.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => router.navigate({ to: `/profile/$id`, params: { id: mentor.id } })}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => router.navigate({ to: '/book', search: { id: mentor.id } as any })}
                    className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Book Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Double Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Smart Double-Matches</span>
              </h3>
              <button
                onClick={() => setShowMatchModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {doubleMatches.map((peer) => (
                <div key={peer.id} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={peer.avatar} alt={peer.name} className="w-12 h-12 rounded-xl bg-white border object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{peer.name}</h4>
                      <p className="text-xs font-semibold text-purple-600">{peer.expertise}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-purple-100">
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">You Learn:</span>
                      <span className="font-bold text-purple-700">{peer.tags?.slice(0, 2).join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">They Learn:</span>
                      <span className="font-bold text-indigo-700">React, TypeScript</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowMatchModal(false);
                      router.navigate({ to: `/chat/$id`, params: { id: peer.id } });
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Skill Swap</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
