import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { chats } from "@/lib/data";

export const Route = createFileRoute("/chat/")({
  component: ChatList,
  head: () => ({ meta: [{ title: "Messages — SkillSwap" }] }),
});

function ChatList() {
  return (
    <div className="px-5 pt-12">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3 mb-4">
        <Search className="w-5 h-5 text-muted-foreground" />
        <input placeholder="Search conversations" className="bg-transparent flex-1 outline-none text-sm" />
      </div>

      <div className="space-y-2">
        {chats.map((c) => (
          <Link key={c.id} to="/chat/$id" params={{ id: c.id }} className="glass-card rounded-2xl p-3 flex items-center gap-3">
            <div className="relative">
              <img src={c.avatar} className="w-12 h-12 rounded-2xl bg-secondary" />
              {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--online)] rounded-full border-2 border-card" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.time}</p>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-xs text-muted-foreground truncate">{c.last}</p>
                {c.unread > 0 && (
                  <span className="ml-2 min-w-5 h-5 px-1.5 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
