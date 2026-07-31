import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { mentors } from "@/lib/data";

export const Route = createFileRoute("/book")({
  component: Book,
  head: () => ({ meta: [{ title: "Book a session — SkillSwap" }] }),
});

const days = Array.from({ length: 7 }, (_, i) => i);
const times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

function Book() {
  const [skill, setSkill] = useState(mentors[0].tags[0]);
  const [day, setDay] = useState(2);
  const [time, setTime] = useState("3:00 PM");
  const [type, setType] = useState<"Online" | "Offline">("Online");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow mb-6 animate-pulse">
          <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">🎉 Session Booked Successfully</h2>
        <p className="text-muted-foreground text-sm mb-6">We've notified your mentor. See you on {time}.</p>
        <Link to="/activity" className="gradient-primary text-primary-foreground rounded-2xl px-6 py-3 font-semibold shadow-soft">
          View my sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12 pb-10">
      <Link to="/home" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-1">Book a session</h1>
      <p className="text-muted-foreground text-sm mb-6">with Aria Shah</p>

      <Label>Select skill</Label>
      <div className="flex gap-2 flex-wrap mb-5">
        {["Python", "TensorFlow", "Data Science", "ML Basics"].map((s) => (
          <button key={s} onClick={() => setSkill(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${skill === s ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}>
            {s}
          </button>
        ))}
      </div>

      <Label>Select date</Label>
      <div className="grid grid-cols-7 gap-2 mb-5">
        {days.map((i) => {
          const active = i === day;
          return (
            <button key={i} onClick={() => setDay(i)}
              className={`flex flex-col items-center py-3 rounded-2xl transition-all ${
                active ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"
              }`}>
              <span className="text-[10px] opacity-70">{["M","T","W","T","F","S","S"][i]}</span>
              <span className="text-base font-bold">{12 + i}</span>
            </button>
          );
        })}
      </div>

      <Label>Time slot</Label>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {times.map((t) => (
          <button key={t} onClick={() => setTime(t)}
            className={`py-3 rounded-2xl text-sm font-medium ${time === t ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}>
            {t}
          </button>
        ))}
      </div>

      <Label>Session type</Label>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {(["Online", "Offline"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`py-3 rounded-2xl text-sm font-medium ${type === t ? "gradient-primary text-primary-foreground shadow-soft" : "glass-card"}`}>
            {t === "Online" ? "🎥" : "📍"} {t}
          </button>
        ))}
      </div>

      <Label>Notes</Label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
        placeholder="What do you want to focus on?"
        className="w-full glass-card rounded-2xl p-4 text-sm outline-none resize-none mb-6" />

      <button onClick={() => setDone(true)}
        className="w-full gradient-primary text-primary-foreground rounded-2xl py-4 font-semibold shadow-glow">
        Confirm Session
      </button>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold mb-2">{children}</p>;
}
