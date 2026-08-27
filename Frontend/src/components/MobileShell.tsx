import React, { useState, useEffect } from 'react';
import { useRouter, useLocation } from '@tanstack/react-router';
import { supabase } from '../lib/supabase';
import { 
  Sparkles, 
  Home, 
  Users, 
  Activity, 
  Trophy, 
  Bell, 
  User, 
  LogOut, 
  BookOpen, 
  Search,
  Menu,
  X
} from 'lucide-react';

export function MobileShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    router.navigate({ to: '/login' });
  };

  const navItems = [
    { label: 'Explore', path: '/home', icon: Home },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Activity', path: '/activity', icon: Activity },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Bookings', path: '/book', icon: BookOpen },
    { label: 'Profile', path: '/profile/me', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/profile/me') {
      return pathname.startsWith('/profile');
    }
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Web / Desktop Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => router.navigate({ to: '/home' })}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent block leading-none">
                SkillSwap
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block mt-0.5">
                Peer-to-Peer
              </span>
            </div>
          </button>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => router.navigate({ to: item.path as any })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-purple-50 text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account / Logout Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
                <button
                  onClick={() => router.navigate({ to: '/profile/me' })}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-purple-700 transition-colors"
                >
                  <img
                    src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-purple-200 bg-purple-50 object-cover"
                  />
                  <span className="max-w-[100px] truncate">{currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.navigate({ to: '/login' })}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors"
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.navigate({ to: item.path as any });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    active ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={currentUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.email}`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border"
                    />
                    <span className="text-sm font-bold text-slate-800">{currentUser.user_metadata?.full_name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => router.navigate({ to: '/login' })}
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-center text-sm"
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Responsive Body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
