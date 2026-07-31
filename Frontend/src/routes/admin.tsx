import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, Star, TrendingUp, Flag, MessageSquare, Activity as ActIcon, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — SkillSwap" }] }),
});

function Admin() {
  return (
    <div className="px-5 pt-12">
      <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      <h1 className="text-2xl font-bold mb-5">Overview</h1>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Stat icon={Users} label="Total Users" value="12,480" trend="+8.2%" />
        <Stat icon={Calendar} label="Active Sessions" value="342" trend="+3.1%" />
        <Stat icon={Star} label="Avg Rating" value="4.78" trend="+0.04" />
        <Stat icon={TrendingUp} label="User Growth" value="+12%" trend="this month" />
      </div>

      <div className="glass-card rounded-3xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Engagement</h3>
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex items-end gap-2 h-32">
          {[40, 65, 50, 78, 60, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full gradient-primary rounded-t-xl shadow-soft" style={{ height: `${h}%` }} />
              <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-5 mb-5">
        <h3 className="font-semibold mb-3">Popular skills</h3>
        {[
          { name: "AI & ML", pct: 86 },
          { name: "UI/UX", pct: 72 },
          { name: "Coding", pct: 64 },
          { name: "Public Speaking", pct: 41 },
        ].map((s) => (
          <div key={s.name} className="mb-3 last:mb-0">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">{s.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full gradient-primary rounded-full" style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold mb-3">Manage</h3>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {[
          { icon: Users, label: "Users", count: 12480 },
          { icon: Calendar, label: "Sessions", count: 8412 },
          { icon: Flag, label: "Reports", count: 14 },
          { icon: Star, label: "Reviews", count: 6291 },
          { icon: MessageSquare, label: "Community", count: 932 },
          { icon: ActIcon, label: "Categories", count: 28 },
        ].map((m) => (
          <button key={m.label} className="glass-card rounded-2xl p-4 text-left">
            <m.icon className="w-5 h-5 text-primary mb-2" />
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-lg font-bold">{m.count.toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; trend: string }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 text-primary-foreground" />
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-[var(--online)] mt-0.5">{trend}</p>
    </div>
  );
}
