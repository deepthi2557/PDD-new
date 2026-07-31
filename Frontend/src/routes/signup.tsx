import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Lock, GraduationCap, BookOpen, Brain, Award } from "lucide-react";

export const Route = createFileRoute("/signup")({
  component: Signup,
  head: () => ({ meta: [{ title: "SkillSwap — Sign up" }] }),
});

const roles = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "mentor", label: "Mentor", icon: Award },
  { id: "learner", label: "Learner", icon: BookOpen },
  { id: "expert", label: "Expert", icon: Brain },
];

function Signup() {
  const nav = useNavigate();
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-screen px-6 pt-12 pb-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h2 className="text-3xl font-bold mb-1">Create account</h2>
      <p className="text-muted-foreground mb-6">Start your skill exchange journey</p>

      <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/home" }); }} className="space-y-3">
        {[
          { icon: User, ph: "Full name", type: "text" },
          { icon: Phone, ph: "Phone number", type: "tel" },
          { icon: Mail, ph: "Email", type: "email" },
          { icon: Lock, ph: "Password", type: "password" },
          { icon: Lock, ph: "Confirm password", type: "password" },
        ].map((f, i) => (
          <div key={i} className="glass-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <f.icon className="w-5 h-5 text-muted-foreground" />
            <input type={f.type} placeholder={f.ph} className="bg-transparent flex-1 outline-none text-sm" />
          </div>
        ))}

        <div className="pt-3">
          <p className="text-sm font-semibold mb-3">I'm joining as</p>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => {
              const active = role === r.id;
              const Icon = r.icon;
              return (
                <button type="button" key={r.id} onClick={() => setRole(r.id)}
                  className={`rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${
                    active ? "gradient-primary text-primary-foreground shadow-glow" : "glass-card"
                  }`}>
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" className="w-full gradient-primary text-primary-foreground rounded-2xl py-4 font-semibold shadow-glow mt-6">
          Create account
        </button>
      </form>
    </div>
  );
}
