import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { Heart, MessageSquare, Sparkles, Plus, ThumbsUp, ExternalLink, X } from 'lucide-react';
import { community as initialFeed } from '../lib/data';

interface Submission {
  id: number;
  author: string;
  title: string;
  link: string;
  votes: number;
  userVoted: boolean;
}

export const Route = createFileRoute('/community')({
  component: Community,
});

export default function Community() {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: 1, author: 'Tara L.', title: 'Interactive Figma Landing Page', link: 'figma.com/file/1234', votes: 12, userVoted: false },
    { id: 2, author: 'Jamal R.', title: 'Figma Auto-Layout Portfolio template', link: 'figma.com/file/5678', votes: 8, userVoted: false },
  ]);

  const [feed, setFeed] = useState(initialFeed);

  const toggleVote = (subId: number) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === subId) {
        return {
          ...sub,
          votes: sub.userVoted ? sub.votes - 1 : sub.votes + 1,
          userVoted: !sub.userVoted
        };
      }
      return sub;
    }));
  };

  const toggleLike = (postId: number) => {
    setFeed(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || !newLink.trim()) return;
    setSubmissions(prev => [
      ...prev,
      {
        id: Date.now(),
        author: 'You (Alex)',
        title: newTitle.trim(),
        link: newLink.trim().replace(/^(https?:\/\/)?(www\.)?/, ''),
        votes: 1,
        userVoted: true
      }
    ]);
    setNewTitle('');
    setNewLink('');
    setShowSubmitModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peer Community
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Join weekly challenges, ask questions, and share project portfolios with learners.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Join Challenge</span>
        </button>
      </div>

      {/* Weekly Challenge Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Weekly Design Challenge</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Build a 1-min Portfolio in Figma
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
            {142 + (submissions.length - 2)} peers actively participating this week.
          </p>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
          >
            <span>Submit Your Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>
      </div>

      {/* Challenge Submissions Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Challenge Submissions ({submissions.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 hover:border-purple-200 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{sub.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">by {sub.author} · {sub.link}</p>
              </div>

              <button
                onClick={() => toggleVote(sub.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1 transition-all ${
                  sub.userVoted
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                }`}
              >
                <span>▲</span>
                <span>{sub.votes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['All', 'Discussions', 'Challenges', 'Posts', 'Q&A'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeFilter === f
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="space-y-4">
        {feed.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.author} className="w-10 h-10 rounded-full border bg-slate-100 object-cover" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{p.author}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{p.time} ago</span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                {p.tag}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {p.title}
            </p>

            <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
              <button
                onClick={() => toggleLike(p.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
              >
                <Heart className="w-4 h-4 text-purple-500 hover:fill-purple-500" />
                <span>{p.likes}</span>
              </button>

              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>{p.comments} Comments</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Project Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Submit Challenge Project</h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Figma Landing Page"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Figma / Portfolio URL
                </label>
                <input
                  type="text"
                  placeholder="figma.com/file/..."
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-xl border text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 shadow-sm"
                >
                  Submit Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
