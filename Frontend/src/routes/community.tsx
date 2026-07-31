import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageSquare, Sparkles, Plus } from "lucide-react";
import { community } from "@/lib/data";

export const Route = createFileRoute("/community")({
  component: Community,
  head: () => ({ meta: [{ title: "Community — SkillSwap" }] }),
});

function Community() {
  return (
    <div className="px-5 pt-12">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Community</h1>
        <button className="w-11 h-11 gradient-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-soft">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="glass-card rounded-3xl p-5 mb-5 gradient-hero">
        <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4" /><p className="text-xs font-semibold">Weekly Challenge</p></div>
        <h3 className="font-bold text-lg leading-tight">Build a 1-min portfolio in Figma</h3>
        <p className="text-xs text-muted-foreground mt-1">142 students participating</p>
        <button className="mt-3 bg-white/70 backdrop-blur rounded-2xl px-4 py-2 text-xs font-semibold">Join challenge</button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-5 px-5">
        {["All", "Discussions", "Challenges", "Posts", "Q&A"].map((f, i) => (
          <button key={f} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {community.map((p) => (
          <div key={p.id} className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <img src={p.avatar} className="w-9 h-9 rounded-xl bg-secondary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.author}</p>
                <p className="text-[10px] text-muted-foreground">{p.time} ago</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[var(--color-mint)]/40 text-[10px] font-semibold">{p.tag}</span>
            </div>
            <p className="text-sm font-medium leading-snug">{p.title}</p>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <button className="flex items-center gap-1"><Heart className="w-4 h-4" /> {p.likes}</button>
              <button className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {p.comments}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
