import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Phone, Video, Smile, Paperclip, Mic, Send } from "lucide-react";
import { mentors } from "@/lib/data";

export const Route = createFileRoute("/chat/$id")({
  component: ChatRoom,
});

const initialMsgs = [
  { from: "them", text: "Hey! Excited about our session tomorrow 🚀", time: "10:24" },
  { from: "me", text: "Same here! Quick question — should I prep anything?", time: "10:25" },
  { from: "them", text: "Just have a notebook ready. We'll build a tiny model together.", time: "10:26" },
  { from: "me", text: "Sounds perfect — see you then!", time: "10:27" },
];

function ChatRoom() {
  const { id } = useParams({ from: "/chat/$id" });
  const m = mentors.find((x) => x.id === id) || mentors[0];
  const [msgs, setMsgs] = useState(initialMsgs);
  const [text, setText] = useState("");
  const [typing] = useState(true);

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { from: "me", text, time: "now" }]);
    setText("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass sticky top-0 z-20 px-5 py-3 flex items-center gap-3">
        <Link to="/chat" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <img src={m.avatar} className="w-10 h-10 rounded-2xl bg-secondary" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{m.name}</p>
          <p className="text-[10px] text-[var(--online)] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--online)]" /> Online
          </p>
        </div>
        <button className="w-10 h-10 glass-card rounded-2xl flex items-center justify-center"><Phone className="w-4 h-4" /></button>
        <button className="w-10 h-10 gradient-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-soft"><Video className="w-4 h-4" /></button>
      </header>

      <div className="flex-1 px-5 py-4 space-y-3 overflow-y-auto">
        {msgs.map((m, i) => {
          const me = m.from === "me";
          return (
            <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-3xl text-sm ${
                me ? "gradient-primary text-primary-foreground rounded-br-md shadow-soft" : "glass-card rounded-bl-md"
              }`}>
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1 ${me ? "opacity-70" : "text-muted-foreground"}`}>{m.time}</p>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex justify-start">
            <div className="glass-card rounded-3xl rounded-bl-md px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:.3s]" />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 px-3 pb-24 pt-2">
        <div className="glass-card rounded-3xl px-2 py-2 flex items-center gap-1 shadow-soft">
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center text-muted-foreground"><Smile className="w-5 h-5" /></button>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center text-muted-foreground"><Paperclip className="w-5 h-5" /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message..." className="flex-1 bg-transparent outline-none text-sm px-2" />
          {text ? (
            <button onClick={send} className="w-10 h-10 gradient-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-soft">
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button className="w-10 h-10 gradient-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-soft">
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
