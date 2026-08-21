import { Mentor } from './data';
import { supabase } from './supabase';

export function mapIdToUuid(id: string): string {
  const map: Record<string, string> = {
    'aria-shah': '11111111-1111-1111-1111-111111111111',
    'leo-park': '22222222-2222-2222-2222-222222222222',
    'maya-iyer': '33333333-3333-3333-3333-333333333333',
    'noah-fields': '44444444-4444-4444-4444-444444444444',
    'sara-kim': '55555555-5555-5555-5555-555555555555',
    'ravi-mehta': '66666666-6666-6666-6666-666666666666',
  };
  return map[id] || id;
}

function getSubTagsForCategory(category: string): string[] {
  switch (category.toLowerCase()) {
    case 'programming':
      return ['Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++'];
    case 'design':
      return ['Figma', 'Prototyping', 'Illustrator', 'Photoshop', 'UI/UX Basics'];
    case 'business':
      return ['Project Management', 'Startup Strategy', 'Marketing', 'Sales'];
    case 'communication':
      return ['Public Speaking', 'Technical Writing', 'Storytelling'];
    case 'mathematics':
      return ['Calculus', 'Linear Algebra', 'Statistics'];
    case 'ai':
      return ['TensorFlow', 'PyTorch', 'Prompt Engineering', 'Machine Learning'];
    case 'languages':
      return ['Spanish', 'French', 'German', 'Japanese'];
    default:
      return [category];
  }
}

export async function fetchMentors(filters?: { name?: string; level?: string; mode?: string; tag?: string }): Promise<Mentor[]> {
  const { data: userData } = await supabase.auth.getUser();
  const currentUserId = userData?.user?.id;

  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_tags (
        tag
      )
    `);

  if (error || !data) {
    console.error('Supabase fetch error:', error);
    throw new Error('Failed to fetch mentors');
  }

  let filtered = data.map((u: any) => {
    const seedString = u.name || u.id || 'mentor';
    const idHash = seedString.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const randReviews = (idHash % 150) + 15;
    const randFollowers = (idHash % 1200) + 100;
    const randSessions = (idHash % 250) + 30;
    const randRating = parseFloat((4.0 + ((idHash % 10) / 10)).toFixed(1));

    return {
      id: u.id,
      name: u.name,
      avatar: u.avatar_url || u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${u.name}&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff`,
      expertise: u.expertise || 'Expertise pending',
      level: u.level || 'Intermediate',
      teaches: u.teaches || u.user_tags?.length || 0,
      rating: u.rating || randRating,
      reviews: u.reviews !== undefined && u.reviews !== null && u.reviews > 0 ? u.reviews : randReviews,
      status: u.status || 'offline',
      tags: u.user_tags ? u.user_tags.map((t: any) => t.tag) : [],
      badge: u.badge || 'Verified Mentor',
      mode: u.mode || 'Online',
      confidence: u.confidence || 'Medium',
      bio: u.bio || '',
      trustScore: u.trustScore || (90 + (idHash % 10)),
      completion: u.attendanceRate || (95 + (idHash % 5)),
      positive: u.positive || (92 + (idHash % 8)),
      followers: u.followers !== undefined && u.followers !== null && u.followers > 0 ? u.followers : randFollowers,
      sessions: u.sessionsCompleted !== undefined && u.sessionsCompleted !== null && u.sessionsCompleted > 0 ? u.sessionsCompleted : randSessions,
    };
  });

  if (currentUserId) {
    filtered = filtered.filter((m: Mentor) => m.id !== currentUserId);
  }

  if (filters) {
    if (filters.name) {
      const searchStr = filters.name.toLowerCase();
      filtered = filtered.filter((m: Mentor) => m.name.toLowerCase().includes(searchStr));
    }
    if (filters.level && filters.level !== 'All') {
      filtered = filtered.filter((m: Mentor) => m.level === filters.level);
    }
    if (filters.mode && filters.mode !== 'All') {
      filtered = filtered.filter((m: Mentor) => m.mode === filters.mode);
    }
    if (filters.tag && filters.tag !== 'All') {
      const subTags = getSubTagsForCategory(filters.tag).map(t => t.toLowerCase());
      filtered = filtered.filter((m: Mentor) => 
        m.tags.some((tag: string) => subTags.includes(tag.toLowerCase()))
      );
    }
  }

  return filtered;
}

export async function fetchMentorById(id: string): Promise<Mentor> {
  const targetId = mapIdToUuid(id);
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_tags (
        tag
      )
    `)
    .eq('id', targetId)
    .single();

  if (error || !data) {
    console.error('Supabase fetch error:', error);
    throw new Error('Failed to fetch mentor details');
  }

  const u = data;
  const seedString = u.name || u.id || 'mentor';
  const idHash = seedString.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const randReviews = (idHash % 150) + 15;
  const randFollowers = (idHash % 1200) + 100;
  const randSessions = (idHash % 250) + 30;
  const randRating = parseFloat((4.0 + ((idHash % 10) / 10)).toFixed(1));

  return {
    id: u.id,
    name: u.name,
    avatar: u.avatar_url || u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${u.name}&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff`,
    expertise: u.expertise || 'Expertise pending',
    level: u.level || 'Intermediate',
    teaches: u.teaches || u.user_tags?.length || 0,
    rating: u.rating || randRating,
    reviews: u.reviews !== undefined && u.reviews !== null && u.reviews > 0 ? u.reviews : randReviews,
    status: u.status || 'offline',
    tags: u.user_tags ? u.user_tags.map((t: any) => t.tag) : [],
    badge: u.badge || 'Verified Mentor',
    mode: u.mode || 'Online',
    confidence: u.confidence || 'Medium',
    bio: u.bio || '',
    trustScore: u.trustScore || (90 + (idHash % 10)),
    completion: u.attendanceRate || (95 + (idHash % 5)),
    positive: u.positive || (92 + (idHash % 8)),
    followers: u.followers !== undefined && u.followers !== null && u.followers > 0 ? u.followers : randFollowers,
    sessions: u.sessionsCompleted !== undefined && u.sessionsCompleted !== null && u.sessionsCompleted > 0 ? u.sessionsCompleted : randSessions,
  };
}
