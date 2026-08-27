import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, ArrowRight, BookOpen, CheckCircle, Plus, X, Sparkles, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Route = createFileRoute('/profile/setup')({
  component: ProfileSetup,
});

const categoriesWithSkills = {
  "Software & Technology": [
    "Python Software Development",
    "React Front-End Engineering",
    "Node.js Back-End Development",
    "TypeScript Web Programming",
    "Cyber Security & Networking",
    "SQL Database Administration",
    "Docker & Cloud DevOps"
  ],
  "Business & Management": [
    "Agile Product Management",
    "Lean Startup Strategy",
    "Corporate Financial Analysis",
    "Sales & Business Development",
    "Project Management (PMP)"
  ],
  "Creative Arts & Design": [
    "Figma UI/UX Design",
    "Blender 3D Graphics",
    "Adobe Graphic Design",
    "Video Editing & Motion Graphics",
    "Digital Illustration"
  ],
  "Marketing & Writing": [
    "SEO Content Optimization",
    "Growth Hacking & Analytics",
    "Digital Advertising & PPC",
    "Technical Writing",
    "Copywriting & Email Marketing"
  ],
  "Languages & Academics": [
    "ESL English Teaching",
    "Conversational Spanish",
    "Mandarin Chinese",
    "Calculus & Linear Algebra",
    "Statistical Data Analysis"
  ],
  "Health & Wellness": [
    "Yoga & Breathwork Instruction",
    "Strength & Weight Training",
    "Diet & Nutrition Coaching",
    "Mindfulness & Meditation"
  ]
} as const;

type CategoryType = keyof typeof categoriesWithSkills;

export default function ProfileSetup() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Profile Form States
  const [expertise, setExpertise] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [bio, setBio] = useState('');
  const [mode, setMode] = useState<'Online' | 'Offline' | 'Both'>('Online');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Dropdown States
  const [category, setCategory] = useState<CategoryType>("Software & Technology");
  const [subSkill, setSubSkill] = useState<string>(categoriesWithSkills["Software & Technology"][0]);

  useEffect(() => {
    setSubSkill(categoriesWithSkills[category][0]);
  }, [category]);

  const addSkill = () => {
    if (!selectedSkills.includes(subSkill)) {
      setSelectedSkills(prev => [...prev, subSkill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!expertise.trim()) {
      setErrorMessage('Please enter your primary expertise title.');
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage('Please select at least one skill to offer.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('users')
          .update({
            expertise: expertise.trim(),
            level: level,
            bio: bio.trim(),
            mode: mode,
            teaches: selectedSkills.length
          })
          .eq('id', user.id);
      }

      router.navigate({ to: '/home' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Setup Your Mentor Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto font-medium">
            Customize your skills, expertise, and teaching preferences to start swapping knowledge.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Primary Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Expertise Title <span className="text-purple-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Full-Stack Developer or UI/UX Designer"
              value={expertise}
              onChange={(e) => { setExpertise(e.target.value); setErrorMessage(''); }}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
              required
            />
          </div>

          {/* Level & Mode Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Expertise Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50/50 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Swap Format / Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50/50 outline-none"
              >
                <option value="Online">Online Video / Chat</option>
                <option value="Offline">In-Person / Local</option>
                <option value="Both">Both Online & In-Person</option>
              </select>
            </div>
          </div>

          {/* Skill Selector Section */}
          <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-4">
            <h3 className="text-sm font-bold text-purple-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Add Skills You Can Teach</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs font-semibold text-slate-800 bg-white outline-none"
                >
                  {Object.keys(categoriesWithSkills).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Skill Title</label>
                <select
                  value={subSkill}
                  onChange={(e) => setSubSkill(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-xs font-semibold text-slate-800 bg-white outline-none"
                >
                  {categoriesWithSkills[category].map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={addSkill}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill to Profile</span>
            </button>

            {/* Selected Skills List */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-600 block mb-2">Selected Skills ({selectedSkills.length}):</span>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-purple-800 border border-purple-200 text-xs font-bold shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-purple-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              About Yourself & Teaching Goals
            </label>
            <textarea
              rows={4}
              placeholder="Share a short introduction about your background, what you love teaching, and what skills you are eager to learn in exchange..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Profile Setup</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
