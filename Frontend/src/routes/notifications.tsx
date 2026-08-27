import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell, CheckCircle2, Trash2, Sparkles, MessageCircle } from 'lucide-react';
import { notifications as initialNotifications } from '../lib/data';

export const Route = createFileRoute('/notifications')({
  component: Notifs,
});

export default function Notifs() {
  const router = useRouter();
  const [notifList, setNotifList] = useState<any[]>([]);

  useEffect(() => {
    const localNotifs = localStorage.getItem('my_notifications');
    if (localNotifs) {
      setNotifList(JSON.parse(localNotifs));
    } else {
      setNotifList(initialNotifications);
      localStorage.setItem('my_notifications', JSON.stringify(initialNotifications));
    }
  }, []);

  const clearAll = () => {
    setNotifList([]);
    localStorage.removeItem('my_notifications');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.navigate({ to: '/home' })}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        {notifList.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Main Title Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600 fill-purple-100" />
              <span>Notifications</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Updates on booking requests, chat messages, and skill match alerts.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
            {notifList.length} New
          </span>
        </div>

        {/* Notifications List */}
        {notifList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No notifications yet. You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifList.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-purple-50/30 border border-slate-100 transition-colors flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base shrink-0">
                  {n.icon || '📩'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {n.title}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
