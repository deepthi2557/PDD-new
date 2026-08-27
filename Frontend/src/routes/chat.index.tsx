import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Sparkles } from 'lucide-react';
import { fetchMentors } from '../lib/api';

export const Route = createFileRoute('/chat/')({
  component: ChatList,
});

export default function ChatList() {
  const router = useRouter();
  const [chatsList, setChatsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchMentors()
      .then((users) => {
        if (!active) return;
        const realChatUsers = users.map((u, idx) => ({
          id: u.id,
          name: u.name,
          avatar: u.avatar,
          last: u.expertise ? `Available for ${u.expertise} skill swap session` : "Let's connect and swap skills!",
          time: `${(idx % 5) + 1}h ago`,
          unread: idx % 3 === 0 ? 1 : 0,
          online: u.status === 'online' || idx % 2 === 0,
        }));

        setChatsList(realChatUsers);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Chat load error:', err);
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const filteredChats = chatsList.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.last.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-purple-600 fill-purple-100" />
          <span>Messages & Skill Swaps</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Direct messaging with your mentors and learning peers.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex items-center gap-2">
        <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
        <input
          type="text"
          placeholder="Search messages by mentor or skill title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-2 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none font-medium bg-transparent"
        />
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
          Active Conversations ({filteredChats.length})
        </h2>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            No conversations found matching your search.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((c) => (
              <div
                key={c.id}
                onClick={() => router.navigate({ to: `/chat/$id`, params: { id: c.id } })}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 transition-colors flex items-center gap-4 cursor-pointer group"
              >
                <div className="relative shrink-0">
                  <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-2xl border bg-white object-cover" />
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {c.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-500 truncate pr-2 font-medium">{c.last}</p>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
