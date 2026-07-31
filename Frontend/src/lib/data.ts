export type Mentor = {
  id: string;
  name: string;
  avatar: string;
  expertise: string;
  level: "Expert" | "Intermediate" | "Beginner Friendly";
  teaches: number;
  rating: number;
  reviews: number;
  status: "online" | "busy" | "offline";
  tags: string[];
  badge: "Verified Mentor" | "Top Contributor" | "Trending Mentor";
  mode: "Online" | "Offline" | "Hybrid";
  confidence: "High" | "Medium" | "Beginner Friendly";
  bio: string;
  trustScore: number;
  completion: number;
  positive: number;
  followers: number;
  sessions: number;
};

const avatars = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff`;

export const mentors: Mentor[] = [
  {
    id: "aria-shah", name: "Aria Shah", avatar: avatars("Aria"),
    expertise: "AI & Machine Learning", level: "Expert", teaches: 6,
    rating: 4.9, reviews: 184, status: "online",
    tags: ["Python", "TensorFlow", "Data Science"],
    badge: "Top Contributor", mode: "Hybrid", confidence: "High",
    bio: "ML researcher helping students break into AI. I love turning complex ideas into intuitive lessons.",
    trustScore: 98, completion: 99, positive: 97, followers: 1240, sessions: 312,
  },
  {
    id: "leo-park", name: "Leo Park", avatar: avatars("Leo"),
    expertise: "UI/UX Design", level: "Expert", teaches: 4,
    rating: 4.8, reviews: 142, status: "busy",
    tags: ["Figma", "Prototyping", "Design Systems"],
    badge: "Verified Mentor", mode: "Online", confidence: "Medium",
    bio: "Product designer at a fintech startup. Sharing real-world workflows.",
    trustScore: 94, completion: 96, positive: 95, followers: 890, sessions: 201,
  },
  {
    id: "maya-iyer", name: "Maya Iyer", avatar: avatars("Maya"),
    expertise: "Full-Stack Coding", level: "Intermediate", teaches: 5,
    rating: 4.7, reviews: 98, status: "online",
    tags: ["React", "Node", "TypeScript"],
    badge: "Trending Mentor", mode: "Online", confidence: "Beginner Friendly",
    bio: "Self-taught developer. I make code feel approachable.",
    trustScore: 92, completion: 94, positive: 96, followers: 540, sessions: 156,
  },
  {
    id: "noah-fields", name: "Noah Fields", avatar: avatars("Noah"),
    expertise: "Public Speaking", level: "Expert", teaches: 3,
    rating: 4.9, reviews: 211, status: "offline",
    tags: ["Communication", "Debate", "Storytelling"],
    badge: "Top Contributor", mode: "Hybrid", confidence: "High",
    bio: "Debate coach with 10+ years guiding students to nationals.",
    trustScore: 96, completion: 98, positive: 98, followers: 1502, sessions: 401,
  },
  {
    id: "sara-kim", name: "Sara Kim", avatar: avatars("Sara"),
    expertise: "Mathematics", level: "Intermediate", teaches: 4,
    rating: 4.6, reviews: 76, status: "online",
    tags: ["Calculus", "Linear Algebra", "Stats"],
    badge: "Verified Mentor", mode: "Online", confidence: "Beginner Friendly",
    bio: "Math TA who makes proofs click.",
    trustScore: 90, completion: 92, positive: 94, followers: 320, sessions: 88,
  },
  {
    id: "ravi-mehta", name: "Ravi Mehta", avatar: avatars("Ravi"),
    expertise: "Video Editing", level: "Expert", teaches: 3,
    rating: 4.8, reviews: 154, status: "busy",
    tags: ["Premiere", "After Effects", "DaVinci"],
    badge: "Trending Mentor", mode: "Online", confidence: "Medium",
    bio: "Editor for indie creators. Workflow obsessed.",
    trustScore: 93, completion: 95, positive: 96, followers: 720, sessions: 178,
  },
];

export const categories = ["Programming", "Design", "Business", "Communication", "Mathematics", "AI", "Languages"];
export const sortOptions = ["Top Rated", "Newest", "Most Active", "Popular Skills", "Nearby Mentors"];
export const searchSuggestions = ["Coding", "UI/UX", "Mathematics", "Video Editing", "AI & ML", "Public Speaking"];

export const reviews = [
  { id: 1, user: "Tara L.", avatar: avatars("Tara"), rating: 5, date: "2d", text: "Best session I've had. Concepts finally clicked." },
  { id: 2, user: "Jamal R.", avatar: avatars("Jamal"), rating: 5, date: "1w", text: "Patient, thorough, and incredibly kind." },
  { id: 3, user: "Eve C.", avatar: avatars("Eve"), rating: 4, date: "2w", text: "Great pacing. Would book again." },
];

export const activity = {
  learning: [
    { id: 1, skill: "Intro to TensorFlow", with: "Aria Shah", time: "Tomorrow · 4:00 PM", rating: 0, status: "upcoming" },
    { id: 2, skill: "Figma Auto Layout", with: "Leo Park", time: "Fri · 6:30 PM", rating: 0, status: "upcoming" },
    { id: 3, skill: "React Hooks Deep Dive", with: "Maya Iyer", time: "Last week", rating: 5, status: "completed" },
  ],
  teaching: [
    { id: 4, skill: "Python Basics", with: "Sam (learner)", time: "Today · 7:00 PM", rating: 0, status: "upcoming" },
    { id: 5, skill: "Resume Polish", with: "Priya (learner)", time: "2 days ago", rating: 5, status: "completed" },
  ],
};

export const notifications = [
  { id: 1, type: "message", title: "New message from Aria Shah", time: "2m", icon: "💬" },
  { id: 2, type: "booking", title: "Session confirmed with Leo Park", time: "1h", icon: "✅" },
  { id: 3, type: "request", title: "Sam requested a Python session", time: "3h", icon: "📩" },
  { id: 4, type: "review", title: "Maya left you a 5-star review", time: "1d", icon: "⭐" },
  { id: 5, type: "match", title: "3 new mentor matches for AI & ML", time: "2d", icon: "✨" },
];

export const chats = [
  { id: "aria-shah", name: "Aria Shah", avatar: avatars("Aria"), last: "Sounds perfect — see you then!", time: "2m", unread: 2, online: true },
  { id: "leo-park", name: "Leo Park", avatar: avatars("Leo"), last: "I sent the Figma file.", time: "1h", unread: 0, online: false },
  { id: "maya-iyer", name: "Maya Iyer", avatar: avatars("Maya"), last: "Thanks for the review!", time: "3h", unread: 0, online: true },
  { id: "noah-fields", name: "Noah Fields", avatar: avatars("Noah"), last: "Try this exercise first.", time: "1d", unread: 1, online: false },
];

export const leaderboard = {
  mentors: [
    { rank: 1, name: "Noah Fields", score: 4980, avatar: avatars("Noah"), badge: "🏆" },
    { rank: 2, name: "Aria Shah", score: 4720, avatar: avatars("Aria"), badge: "🥈" },
    { rank: 3, name: "Leo Park", score: 4310, avatar: avatars("Leo"), badge: "🥉" },
    { rank: 4, name: "Ravi Mehta", score: 3890, avatar: avatars("Ravi") },
    { rank: 5, name: "Sara Kim", score: 3450, avatar: avatars("Sara") },
  ],
  skills: [
    { name: "AI & ML", growth: "+42%" },
    { name: "UI/UX", growth: "+31%" },
    { name: "Public Speaking", growth: "+24%" },
    { name: "Full-Stack", growth: "+19%" },
  ],
};

export const community = [
  { id: 1, author: "Aria Shah", avatar: avatars("Aria"), time: "2h", title: "Weekend ML Challenge: build a tiny classifier", likes: 84, comments: 23, tag: "AI" },
  { id: 2, author: "Leo Park", avatar: avatars("Leo"), time: "5h", title: "Share your first Figma file — let's give kind feedback", likes: 56, comments: 41, tag: "Design" },
  { id: 3, author: "Noah Fields", avatar: avatars("Noah"), time: "1d", title: "Top 5 storytelling habits I teach every student", likes: 128, comments: 19, tag: "Communication" },
];
