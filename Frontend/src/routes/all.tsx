import { createFileRoute, Link } from "../lib/router-bridge";

export const Route = createFileRoute("/all")({
  component: AllPages,
  head: () => ({ meta: [{ title: "All Screens — SkillSwap" }] }),
});

const screens = [
  { path: "/", label: "1. Login" },
  { path: "/signup", label: "2. Signup" },
  { path: "/home", label: "3. Explore Skills" },
  { path: "/profile/aria-shah", label: "4. Profile Detail" },
  { path: "/book", label: "5. Book Session" },
  { path: "/chat", label: "6. Messages" },
  { path: "/chat/aria-shah", label: "7. Chat Room" },
  { path: "/activity", label: "8. My Activity" },
  { path: "/notifications", label: "9. Notifications" },
  { path: "/leaderboard", label: "10. Leaderboard" },
  { path: "/community", label: "11. Community" },
  { path: "/admin", label: "12. Admin Dashboard" },
];

function AllPages() {
  return (
    <div className="px-4 pt-10 pb-10">
      <h1 className="text-2xl font-bold mb-1 text-gradient">SkillSwap</h1>
      <p className="text-sm text-muted-foreground mb-6">All {screens.length} screens at a glance</p>

      <div className="grid grid-cols-2 gap-3">
        {screens.map((s) => (
          <Link key={s.path} to={s.path} className="glass-card rounded-2xl overflow-hidden shadow-soft block">
            <div className="bg-white aspect-[9/16] overflow-hidden relative">
              <iframe
                src={s.path}
                title={s.label}
                className="border-0 pointer-events-none"
                style={{
                  width: "390px",
                  height: "693px",
                  transform: "scale(0.5)",
                  transformOrigin: "top left",
                }}
              />
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold truncate">{s.label}</p>
              <p className="text-[10px] text-muted-foreground truncate">{s.path}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
