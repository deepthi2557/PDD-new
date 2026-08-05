import { Mentor } from './data';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://pdd-new.onrender.com';

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

export async function fetchMentors(filters?: { name?: string; level?: string; mode?: string; tag?: string }): Promise<Mentor[]> {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.name) params.append('name', filters.name);
    if (filters.level && filters.level !== 'All') params.append('level', filters.level);
    if (filters.mode && filters.mode !== 'All') params.append('mode', filters.mode);
    if (filters.tag && filters.tag !== 'All') params.append('tag', filters.tag);
  }

  const response = await fetch(`${API_BASE_URL}/api/mentors?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch mentors');
  }
  const data = await response.json();
  return data.map((u: any) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${u.name}&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff`,
    expertise: u.expertise || 'Expertise pending',
    level: u.level || 'Intermediate',
    teaches: u.teaches || u.tags?.length || 0,
    rating: u.rating || 5.0,
    reviews: u.reviews || 0,
    status: u.status || 'offline',
    tags: u.tags || [],
    badge: u.badge || 'Verified Mentor',
    mode: u.mode || 'Online',
    confidence: u.confidence || 'Medium',
    bio: u.bio || '',
    trustScore: u.trustScore || 100,
    completion: u.attendanceRate || 100,
    positive: u.positive || 100,
    followers: u.followers || 0,
    sessions: u.sessionsCompleted || 0,
  }));
}

export async function fetchMentorById(id: string): Promise<Mentor> {
  const targetId = mapIdToUuid(id);
  const response = await fetch(`${API_BASE_URL}/api/mentors/${targetId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch mentor details');
  }
  const u = await response.json();
  return {
    id: u.id,
    name: u.name,
    avatar: u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${u.name}&backgroundColor=c4b5fd,bfdbfe,a7f3d0,e9d5ff`,
    expertise: u.expertise || 'Expertise pending',
    level: u.level || 'Intermediate',
    teaches: u.teaches || u.tags?.length || 0,
    rating: u.rating || 5.0,
    reviews: u.reviews || 0,
    status: u.status || 'offline',
    tags: u.tags || [],
    badge: u.badge || 'Verified Mentor',
    mode: u.mode || 'Online',
    confidence: u.confidence || 'Medium',
    bio: u.bio || '',
    trustScore: u.trustScore || 100,
    completion: u.attendanceRate || 100,
    positive: u.positive || 100,
    followers: u.followers || 0,
    sessions: u.sessionsCompleted || 0,
  };
}
