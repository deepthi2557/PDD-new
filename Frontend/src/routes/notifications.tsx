import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { notifications } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  component: Notifs,
  head: () => ({ meta: [{ title: "Notifications — SkillSwap" }] }),
});

function Notifs() {
  return (
    <div className="px-5 pt-12">
      <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-5">Notifications</h1>

      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl gradient-hero flex items-center justify-center text-lg">
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{n.time} ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
