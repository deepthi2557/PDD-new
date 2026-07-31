import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Bell, ChevronDown, Star, MessageCircle, CalendarPlus, ShieldCheck, Flame, Trophy } from "lucide-react";
import { mentors, categories, sortOptions, searchSuggestions, type Mentor } from "@/lib/data";

export const Route = createFileRoute("/home")({
  component: Home,
  head: () => ({ meta: [{ title: "Explore Skills — SkillSwap" }] }),
});

function Home() {
  const [cat, setCat] = useState("Programming");
  const [sort, setSort] = useState("Top Rated");
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <div className="px-5 pt-12">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground">Hi, Alex 👋</p>
          <h1 className="text-2xl font-bold">Explore Skills</h1>
        </div>
        <Link to="/notifications" className="relative w-11 h-11 glass-card rounded-2xl flex items-center justify-center">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
        </Link>
      </header>

      <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 mb-3">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input placeholder="Search skills, mentors..." className="bg-transparent flex-1 outline-none text-sm" />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 -mx-5 px-5">
        {searchSuggestions.map((s) => (
          <button key={s} className="shrink-0 px-3 py-1.5 rounded-full glass-card text-xs font-medium">{s}</button>
        ))}
      </div>

      <div className="relative mb-4">
        <button onClick={() => setSortOpen(!sortOpen)} className="glass-card rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm font-medium">
          Sort: <span className="text-primary">{sort}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {sortOpen && (
          <div className="absolute z-20 mt-2 w-56 glass-card rounded-2xl p-2 shadow-glow">
            {sortOptions.map((o) => (
              <button key={o} onClick={() => { setSort(o); setSortOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${sort === o ? "gradient-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                {o}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-5 px-5">
        {categories.map((c) => {
          const active = c === cat;
          return (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"
              }`}>{c}</button>
          );
        })}
      </div>

      <div className="space-y-4">
        {mentors.map((m) => <MentorCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

const statusColor = { online: "bg-[var(--online)]", busy: "bg-[var(--busy)]", offline: "bg-[var(--offline)]" };
const badgeIcon = { "Verified Mentor": ShieldCheck, "Top Contributor": Trophy, "Trending Mentor": Flame };

export function MentorCard({ m }: { m: Mentor }) {
  const Icon = badgeIcon[m.badge];
  const unavailable = m.status === "offline";
  return (
    <div className="glass-card rounded-3xl p-4 shadow-card">
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img src={m.avatar} alt={m.name} className="w-16 h-16 rounded-2xl bg-secondary" />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${statusColor[m.status]}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{m.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{m.expertise} · {m.level}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{m.rating}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Teaches {m.teaches} skills · {m.reviews} reviews</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {m.tags.map((t) => (
          <span key={t} className="px-2.5 py-1 rounded-full bg-[var(--color-soft-purple)]/40 text-[10px] font-medium text-secondary-foreground">{t}</span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 text-[11px]">
        <span className="px-2 py-1 rounded-full bg-[var(--color-mint)]/40 font-medium flex items-center gap-1">
          <Icon className="w-3 h-3" /> {m.badge}
        </span>
        <span className="px-2 py-1 rounded-full bg-[var(--color-pastel-blue)]/50 font-medium">
          {m.mode === "Online" ? "🎥" : m.mode === "Offline" ? "📍" : "🔄"} {m.mode}
        </span>
        <span className="px-2 py-1 rounded-full bg-[var(--color-lavender)]/40 font-medium">{m.confidence}</span>
      </div>

      {unavailable ? (
        <div className="mt-3 rounded-2xl p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
          ⚠️ Currently Unavailable
        </div>
      ) : null}

      <div className="flex gap-2 mt-3">
        <Link to="/profile/$id" params={{ id: m.id }} className="flex-1 glass-card rounded-2xl py-2.5 text-center text-sm font-semibold">
          View Profile
        </Link>
        <Link to="/chat/$id" params={{ id: m.id }} className="w-11 h-11 glass-card rounded-2xl flex items-center justify-center">
          <MessageCircle className="w-4 h-4" />
        </Link>
        <Link to="/book"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center ${unavailable ? "bg-muted text-muted-foreground pointer-events-none" : "gradient-primary text-primary-foreground shadow-soft"}`}>
          <CalendarPlus className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
