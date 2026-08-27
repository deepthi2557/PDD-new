import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  PhoneOff, 
  MicOff, 
  MessageSquare, 
  Calendar, 
  Monitor, 
  X, 
  Play, 
  Pause, 
  FileText, 
  Camera, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentorById } from '../lib/api';

export const Route = createFileRoute('/chat/$id')({
  component: ChatRoom,
});

export default function ChatRoom() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  let id = route?.params?.id;
  if (!id && typeof window !== 'undefined') {
    const parts = window.location.pathname.split('/');
    if (parts.length > 2) id = parts[2];
  }

  const [m, setM] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchMentorById(id)
      .then((data) => {
        if (active) {
          setM(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) {
          const fallback = mentors.find((x) => x.id === id) || mentors[0];
          setM(fallback);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const [msgs, setMsgs] = useState<any[]>([
    { from: 'them', text: 'Hey! Excited about our session tomorrow 🚀', time: '10:24 AM' },
    { from: 'me', text: 'Same here! Quick question — should I prep anything?', time: '10:25 AM' },
    { from: 'them', text: "Just have a notebook ready. We'll build a tiny project together.", time: '10:26 AM' },
    { from: 'me', text: 'Sounds perfect — see you then!', time: '10:27 AM' },
  ]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    if (!id) return;
    const localMsgs = localStorage.getItem(`chat_msgs_${id}`);
    if (localMsgs) {
      try {
        setMsgs(JSON.parse(localMsgs));
      } catch (e) {
        console.error(e);
      }
    }
  }, [id]);

  const send = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { from: 'me', text: text.trim(), time: timeNow };
    const updated = [...msgs, newMsg];
    setMsgs(updated);
    if (id) localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(updated));
    setText('');

    // Simulate auto reply after 2 seconds
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replyMsg = {
        from: 'them',
        text: `Thanks for messaging! I'm looking forward to our swap session on ${m?.expertise || 'skills'}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMsgs((prev) => {
        const next = [...prev, replyMsg];
        if (id) localStorage.setItem(`chat_msgs_${id}`, JSON.stringify(next));
        return next;
      });
    }, 2000);
  };

  if (loading || !m) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Opening Chat Room...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[82vh] flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-lg overflow-hidden">
      
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.navigate({ to: '/chat' })}
            className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full border bg-white object-cover" />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">{m.name}</h2>
            <span className="text-[11px] font-semibold text-purple-600 block">{m.expertise}</span>
          </div>
        </div>

        {/* Action Header Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.navigate({ to: '/book', search: { id: m.id } as any })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors border border-purple-200"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Swap</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/30">
        {msgs.map((msg, i) => {
          const me = msg.from === 'me';
          return (
            <div key={i} className={`flex ${me ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs sm:max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium shadow-2xs space-y-1 ${
                  me
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block text-right font-medium ${me ? 'text-purple-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200/80 px-4 py-2.5 rounded-2xl rounded-bl-none text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Message Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white shrink-0">
        <form onSubmit={send} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message to your mentor..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
