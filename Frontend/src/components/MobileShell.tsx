import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, MessageCircle, Trophy, User } from "lucide-react";

const items = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/activity", icon: Calendar, label: "Activity" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/leaderboard", icon: Trophy, label: "Rank" },
  { to: "/profile/me", icon: User, label: "Profile" },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const hideNav = path === "/" || path === "/signup";

  return (
    <div className="min-h-screen w-full max-w-md mx-auto relative pb-24">
      {children}
      {!hideNav && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
          <div className="glass-card rounded-3xl px-2 py-2 flex items-center justify-around shadow-glow">
            {items.map((it) => {
              const active = path.startsWith(it.to) || (it.to === "/profile/me" && path.startsWith("/profile"));
              const Icon = it.icon;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all ${
                    active ? "gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{it.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
