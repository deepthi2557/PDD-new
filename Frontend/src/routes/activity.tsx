import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Clock, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { activity, mentors } from "@/lib/data";

export const Route = createFileRoute("/activity")({
  component: Activity,
  head: () => ({ meta: [{ title: "My Activity — SkillSwap" }] }),
});

const tabs = ["Learning", "Teaching", "Upcoming", "Completed"] as const;

function Activity() {
  const [tab, setTab] = useState<typeof tabs[number]>("Learning");

  const getItems = () => {
    if (tab === "Learning") return activity.learning;
    if (tab === "Teaching") return activity.teaching;
    if (tab === "Upcoming") return [...activity.learning, ...activity.teaching].filter((x) => x.status === "upcoming");
    return [...activity.learning, ...activity.teaching].filter((x) => x.status === "completed");
  };

  return (
    <div className="px-5 pt-12">
      <h1 className="text-2xl font-bold mb-4">My Activity</h1>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Trust score</p>
          <p className="text-2xl font-bold text-gradient">96</p>
          <p className="text-[10px] text-[var(--online)] mt-1">⭐ Top tier</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Attendance</p>
          <p className="text-2xl font-bold">98%</p>
          <p className="text-[10px] text-muted-foreground mt-1">0 missed sessions</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-1.5 flex gap-1 mb-5 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              tab === t ? "gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {getItems().map((it) => (
          <div key={it.id} className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              it.status === "upcoming" ? "gradient-primary text-primary-foreground" : "bg-[var(--color-mint)]/50"
            }`}>
              {it.status === "upcoming" ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5 text-[var(--online)]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{it.skill}</p>
              <p className="text-xs text-muted-foreground truncate">with {it.with}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{it.time}</p>
            </div>
            {it.rating > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-amber-700">{it.rating}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="font-semibold mt-8 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" /> Suggested for you
      </h2>
      <div className="space-y-2">
        {mentors.slice(0, 2).map((m) => (
          <div key={m.id} className="glass-card rounded-2xl p-3 flex items-center gap-3">
            <img src={m.avatar} className="w-10 h-10 rounded-xl bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">Matches your interest in {m.tags[0]}</p>
            </div>
            <button className="text-xs font-semibold text-primary">View</button>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-4 mt-6 mb-4 border border-amber-200 bg-amber-50/60">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-900">Reliability reminder</p>
            <p className="text-xs text-amber-800 mt-0.5">Missing 3+ sessions flags your profile as low reliability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
