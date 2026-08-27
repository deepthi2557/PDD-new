import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  Star, 
  MessageCircle, 
  CalendarPlus, 
  UserPlus, 
  Award, 
  CheckCircle2, 
  X, 
  Edit3, 
  Sparkles, 
  MapPin, 
  Globe, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Flame, 
  Trophy,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { mentors, getReviewsForMentor, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/profile/$id')({
  component: Profile,
});

export function calculateMatchScore(mentorTags: string[]): number {
  const myInterests = ['Python', 'React', 'Figma', 'Communication', 'Calculus', 'TypeScript', 'TensorFlow'];
  const matches = mentorTags ? mentorTags.filter(tag => myInterests.includes(tag)).length : 0;
  if (matches > 0) {
    return Math.min(65 + matches * 10, 98);
  }
  return 75;
}

const badgesList = [
  { id: 1, name: 'Top Mentor', icon: '🌟', desc: 'Maintained a rating above 4.8 for 50+ completed swap sessions.', color: 'from-amber-400 to-amber-600' },
  { id: 2, name: 'Consistent', icon: '🔥', desc: 'Completed at least 3 swaps per week for 4 consecutive weeks.', color: 'from-orange-500 to-red-600' },
  { id: 3, name: 'Skill Expert', icon: '🏆', desc: 'Highest verified knowledge score in their subject area.', color: 'from-purple-500 to-indigo-600' },
  { id: 4, name: 'Friendly Helper', icon: '🤝', desc: 'Earned 95%+ positive recommendations from learners.', color: 'from-emerald-400 to-teal-600' }
];

export default function Profile() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  let paramId = route?.params?.id;
  if (!paramId && typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/');
    if (parts.length > 2) paramId = parts[2];
  }

  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<{ name: string; desc: string; icon: string } | null>(null);

  const [following, setFollowing] = useState(false);
  const [localFollowers, setLocalFollowers] = useState(0);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Edit Form States
  const [editName, setEditName] = useState('');
  const [editExpertise, setEditExpertise] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLevel, setEditLevel] = useState('Intermediate');
  const [editMode, setEditMode] = useState('Online');
  const [editTagsStr, setEditTagsStr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        setCurrentUserId(user.id);
      }
    });
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const targetId = paramId === 'me' || !paramId ? currentUserId || 'm1' : paramId;

    fetchMentorById(targetId)
      .then((data) => {
        if (active) {
          setM(data);
          setLocalFollowers(data.followers || 0);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          const fallback = mentors.find(item => item.id === targetId) || mentors[0];
          setM(fallback);
          setLocalFollowers(fallback.followers || 0);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [paramId, currentUserId]);

  useEffect(() => {
    if (m) {
      setEditName(m.name || '');
      setEditExpertise(m.expertise || '');
      setEditBio(m.bio || '');
      setEditLevel(m.level || 'Intermediate');
      setEditMode(m.mode || 'Online');
      setEditTagsStr(m.tags ? m.tags.join(', ') : '');
    }
  }, [m]);

  const isOwnProfile = (currentUserId && m && (currentUserId === m.id || paramId === 'me')) || paramId === 'me';

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editName.trim() || !editExpertise.trim() || !editTagsStr.trim()) {
      setEditError('Name, Expertise, and Skills are required.');
      return;
    }
    setSavingProfile(true);
    setEditError('');

    try {
      const skillsArray = editTagsStr.split(',').map(s => s.trim()).filter(Boolean);

      if (m && m.id) {
        await supabase
          .from('users')
          .update({
            name: editName.trim(),
            expertise: editExpertise.trim(),
            bio: editBio.trim(),
            level: editLevel,
            mode: editMode,
            teaches: skillsArray.length
          })
          .eq('id', m.id);
      }

      setM(prev => prev ? {
        ...prev,
        name: editName.trim(),
        expertise: editExpertise.trim(),
        bio: editBio.trim(),
        level: editLevel,
        mode: editMode,
        tags: skillsArray,
        teaches: skillsArray.length,
      } : null);

      setEditModalVisible(false);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleFollow = () => {
    setFollowing(!following);
    setLocalFollowers(prev => (following ? prev - 1 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading Profile...</p>
      </div>
    );
  }

  if (!m) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800">Profile Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The mentor profile you are looking for doesn't exist.</p>
        <button
          onClick={() => router.navigate({ to: '/home' })}
          className="mt-4 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const matchScore = calculateMatchScore(m.tags || []);
  const reviews = getReviewsForMentor(m.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Back Button / Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.navigate({ to: '/home' })}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          {isOwnProfile && (
            <button
              onClick={() => setEditModalVisible(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Cover Photo Banner */}
        <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-purple-700 via-indigo-600 to-slate-900">
          <img
            src={m.coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{matchScore}% Match for you</span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            
            {/* Avatar Badge */}
            <div className="relative">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 border-white bg-slate-100 shadow-md object-cover"
              />
              <span className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                m.mode === 'Online' || m.online ? 'bg-emerald-500' : 'bg-amber-500'
              }`} title={m.mode} />
            </div>

            {/* Action Buttons Header */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={toggleFollow}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                      following
                        ? 'bg-slate-100 text-slate-700 border border-slate-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{following ? 'Following' : 'Follow'}</span>
                  </button>

                  <button
                    onClick={() => router.navigate({ to: `/chat/$id`, params: { id: m.id } })}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs sm:text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => router.navigate({ to: '/book', search: { id: m.id } as any })}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Book Session</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Bio & Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {m.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-purple-600 fill-purple-100 shrink-0" title="Verified Mentor" />
            </div>

            <p className="text-base font-semibold text-purple-700 mt-1">
              {m.expertise}
            </p>

            <p className="text-sm text-slate-600 mt-3 max-w-3xl leading-relaxed">
              {m.bio || 'Passionate mentor and learner dedicated to skill exchange and collaborative growth.'}
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-semibold text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Level: {m.level || 'Intermediate'}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Mode: {m.mode || 'Online'}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Teaches: {m.teaches || m.tags?.length || 0} Skills
              </span>
            </div>
          </div>

          {/* Key Metrics Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-lg">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{m.rating || 4.9}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Rating Score</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-purple-700 font-extrabold text-lg">
                <Users className="w-5 h-5 text-purple-600" />
                <span>{localFollowers}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Followers</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-indigo-700 font-extrabold text-lg">
                <Flame className="w-5 h-5 text-indigo-600" />
                <span>{m.sessions || 42}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Sessions Done</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-extrabold text-lg">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <span>{m.teaches || 5}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400 mt-0.5 block">Skills Offered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section: Skills & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-slate-900">Skills Offered & Expertise</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {m.tags && m.tags.length > 0 ? (
              m.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>{tag}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet.</span>
            )}
          </div>
        </div>

        {/* Badges Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Verified Badges & Achievements</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {badgesList.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-purple-700 transition-colors">
                      {badge.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Click to view criteria</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-lg font-bold text-slate-900">Learner Reviews & Feedback</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {reviews.length} Reviews
          </span>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatar}
                      alt={rev.reviewer}
                      className="w-9 h-9 rounded-full border bg-white object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.reviewer}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed pl-11">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4">No reviews yet for this mentor.</p>
        )}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-5xl mb-3">{selectedBadge.icon}</div>
            <h3 className="text-xl font-extrabold text-slate-900">{selectedBadge.name}</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">{selectedBadge.desc}</p>
            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full py-2.5 bg-purple-600 text-white rounded-xl font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile Details</h3>
              <button
                onClick={() => setEditModalVisible(false)}
                className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Expertise Title
                </label>
                <input
                  type="text"
                  value={editExpertise}
                  onChange={(e) => setEditExpertise(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  About & Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Level
                  </label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Teaching Mode
                  </label>
                  <select
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none bg-white"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Skills Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={editTagsStr}
                  onChange={(e) => setEditTagsStr(e.target.value)}
                  placeholder="e.g. Python, React, UI/UX"
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalVisible(false)}
                  className="flex-1 py-2.5 rounded-xl border text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-sm"
                >
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
