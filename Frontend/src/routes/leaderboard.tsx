import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trophy, TrendingUp, Crown } from "lucide-react";
import { leaderboard } from "@/lib/data";

export const Route = createFileRoute("/leaderboard")({
  component: Board,
  head: () => ({ meta: [{ title: "Leaderboard — SkillSwap" }] }),
});

const tabs = ["Mentors", "Learners", "Skills"] as const;

function Board() {
  const [tab, setTab] = useState<typeof tabs[number]>("Mentors");
  return (
    <div className="px-5 pt-12">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      <div className="glass-card rounded-3xl p-5 mb-5 gradient-hero">
        <p className="text-xs font-medium opacity-80">This week</p>
        <div className="flex items-end justify-around mt-4 gap-2">
          {leaderboard.mentors.slice(0, 3).map((m, i) => {
            const heights = ["h-20", "h-28", "h-16"];
            const order = [1, 0, 2];
            const idx = order[i];
            const mentor = leaderboard.mentors[idx];
            return (
              <div key={mentor.rank} className="flex flex-col items-center flex-1">
                {idx === 0 && <Crown className="w-5 h-5 text-amber-500 mb-1" />}
                <img src={mentor.avatar} className="w-14 h-14 rounded-2xl border-2 border-white shadow-soft bg-secondary" />
                <p className="text-[11px] font-semibold mt-1 text-center truncate w-full">{mentor.name.split(" ")[0]}</p>
                <p className="text-[10px] text-muted-foreground">{mentor.score}</p>
                <div className={`w-full ${heights[i]} glass rounded-t-2xl mt-1 flex items-start justify-center pt-1 text-xs font-bold`}>
                  #{mentor.rank}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-1.5 flex gap-1 mb-4">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold ${tab === t ? "gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab !== "Skills" ? (
        <div className="space-y-2">
          {leaderboard.mentors.map((m) => (
            <div key={m.rank} className="glass-card rounded-2xl p-3 flex items-center gap-3">
              <span className="w-7 text-center font-bold text-sm text-muted-foreground">#{m.rank}</span>
              <img src={m.avatar} className="w-10 h-10 rounded-xl bg-secondary" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.score} pts</p>
              </div>
              {m.badge && <span className="text-lg">{m.badge}</span>}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.skills.map((s, i) => (
            <div key={s.name} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              <span className="w-7 text-center font-bold text-sm text-muted-foreground">#{i+1}</span>
              <p className="flex-1 font-semibold text-sm">{s.name}</p>
              <span className="flex items-center gap-1 text-xs font-semibold text-[var(--online)]">
                <TrendingUp className="w-3 h-3" /> {s.growth}
              </span>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mt-8 mb-3">Your badges</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { e: "📚", l: "Fast Learner" },
          { e: "🎯", l: "Session Master" },
          { e: "🚀", l: "Explorer" },
        ].map((b) => (
          <div key={b.l} className="glass-card rounded-2xl p-3 text-center">
            <div className="text-3xl mb-1">{b.e}</div>
            <p className="text-[10px] font-medium">{b.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
