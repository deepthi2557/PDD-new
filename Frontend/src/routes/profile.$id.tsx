import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Star, MessageCircle, CalendarPlus, UserPlus, Award, Send, CheckCircle2 } from "lucide-react";
import { mentors, reviews } from "@/lib/data";

export const Route = createFileRoute("/profile/$id")({
  component: Profile,
});

function Profile() {
  const { id } = useParams({ from: "/profile/$id" });
  const m = mentors.find((x) => x.id === id) || mentors[0];
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewText, setReviewText] = useState("");

  return (
    <div className="pb-10">
      <div className="relative gradient-hero rounded-b-[40px] px-5 pt-12 pb-20">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      <div className="-mt-16 px-5">
        <div className="glass-card rounded-3xl p-5 shadow-glow">
          <div className="flex items-end gap-4 -mt-12">
            <img src={m.avatar} alt={m.name} className="w-24 h-24 rounded-3xl bg-secondary border-4 border-card shadow-soft" />
            <div className="pb-2 flex-1 min-w-0">
              <h1 className="text-xl font-bold">{m.name}</h1>
              <p className="text-xs text-muted-foreground">{m.expertise}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{m.bio}</p>

          <div className="grid grid-cols-3 gap-2 mt-5">
            <Stat label="Sessions" value={m.sessions} />
            <Stat label="Followers" value={m.followers} />
            <Stat label="Rating" value={m.rating} />
          </div>

          <div className="flex gap-2 mt-5">
            <Link to="/chat/$id" params={{ id: m.id }} className="flex-1 glass rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold">
              <MessageCircle className="w-4 h-4" /> Chat
            </Link>
            <Link to="/book" className="flex-1 gradient-primary text-primary-foreground rounded-2xl py-3 flex items-center justify-center gap-2 text-sm font-semibold shadow-soft">
              <CalendarPlus className="w-4 h-4" /> Book
            </Link>
            <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Section title="Can teach">
          <div className="flex flex-wrap gap-2">
            {m.tags.map((t) => <Chip key={t}>{t}</Chip>)}
          </div>
        </Section>

        <Section title="Wants to learn">
          <div className="flex flex-wrap gap-2">
            <Chip>Product Strategy</Chip><Chip>Spanish</Chip><Chip>Music Theory</Chip>
          </div>
        </Section>

        <Section title="Experience & Certifications">
          <div className="space-y-2">
            <Cert title="ML Engineer · NovaLabs" sub="2021 — Present" />
            <Cert title="Google ML Specialization" sub="Certified · 2022" />
          </div>
        </Section>

        <Section title="Achievements">
          <div className="flex flex-wrap gap-2">
            <Badge>🌟 Top Mentor</Badge>
            <Badge>🔥 Consistent</Badge>
            <Badge>🏆 Skill Expert</Badge>
          </div>
        </Section>

        <Section title="Availability">
          <div className="grid grid-cols-7 gap-1.5">
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-muted-foreground mb-1">{d}</p>
                <div className={`aspect-square rounded-xl flex items-center justify-center text-xs font-semibold ${
                  [1,3,5].includes(i) ? "gradient-primary text-primary-foreground" : "glass"
                }`}>{i+12}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Reviews">
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="glass-card rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <img src={r.avatar} className="w-8 h-8 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{r.user}</p>
                    <p className="text-[10px] text-muted-foreground">{r.date} ago</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-2 text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Leave a review">
          {submitted ? (
            <div className="glass-card rounded-2xl p-4 flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-[var(--online)]" /> Feedback Submitted Successfully
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <div className="flex gap-1 justify-center">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} onClick={() => setRating(n)}>
                    <Star className={`w-7 h-7 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                  </button>
                ))}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..." rows={3}
                className="w-full bg-secondary/50 rounded-2xl p-3 text-sm outline-none resize-none" />
              <button onClick={() => setSubmitted(true)}
                className="w-full gradient-primary text-primary-foreground rounded-2xl py-3 font-semibold flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Submit Review
              </button>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center glass rounded-2xl py-3">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Chip({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1.5 rounded-full glass-card text-xs font-medium">{children}</span>;
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="px-3 py-1.5 rounded-2xl bg-[var(--color-mint)]/40 text-sm font-medium">{children}</span>;
}
function Cert({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
        <Award className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
