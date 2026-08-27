import { createFileRoute, useRouter } from '@tanstack/react-router';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2, Calendar, Clock, Video, MapPin, Sparkles } from 'lucide-react';
import { mentors, type Mentor } from '../lib/data';
import { fetchMentors, fetchMentorById } from '../lib/api';
import { supabase } from '../lib/supabase';
import { VITE_API_URL } from '../lib/env';

export const Route = createFileRoute('/book')({
  component: Book,
});

const days = Array.from({ length: 7 }, (_, i) => i);
const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM'];

export default function Book() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  let targetMentorId = route?.params?.id;
  if (!targetMentorId && typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    targetMentorId = searchParams.get('id') || localStorage.getItem('selected_mentor_id');
  }

  const [skill, setSkill] = useState('');
  const [targetMentor, setTargetMentor] = useState<Mentor | null>(null);
  const [loadingMentor, setLoadingMentor] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingMentor(true);
    
    const load = async () => {
      try {
        if (targetMentorId) {
          const mData = await fetchMentorById(targetMentorId);
          if (active) {
            setTargetMentor(mData);
            if (mData.tags && mData.tags.length > 0) {
              setSkill(mData.tags[0]);
            }
          }
        } else {
          const mList = await fetchMentors();
          if (active && mList.length > 0) {
            setTargetMentor(mList[0]);
            if (mList[0].tags && mList[0].tags.length > 0) {
              setSkill(mList[0].tags[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading mentor for booking:', err);
        const fallback = mentors.find(x => x.id === targetMentorId) || mentors[0];
        if (active) {
          setTargetMentor(fallback);
          if (fallback.tags && fallback.tags.length > 0) {
            setSkill(fallback.tags[0]);
          }
        }
      } finally {
        if (active) setLoadingMentor(false);
      }
    };
    
    load();
    return () => { active = false; };
  }, [targetMentorId]);

  const [day, setDay] = useState(2);
  const [time, setTime] = useState('3:00 PM');
  const [type, setType] = useState<'Online' | 'Offline'>('Online');
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetMentor) return;
    setSubmitting(true);

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + (day - 2));
    const dateString = bookingDate.toISOString().split('T')[0];

    try {
      const { data: userData } = await supabase.auth.getUser();
      const learnerId = userData?.user?.id;
      if (learnerId) {
        await supabase
          .from('bookings')
          .insert([
            {
              learner_id: learnerId,
              mentor_id: targetMentor.id,
              skill: skill,
              date: dateString,
              time_slot: time,
              type: type,
              notes: notes,
              status: 'UPCOMING'
            }
          ]);
      }
    } catch (err) {
      console.warn('Supabase insert fail:', err);
    }

    try {
      const localBookings = JSON.parse(localStorage.getItem('my_bookings') || '[]');
      const newBooking = {
        id: Math.random().toString(36).substring(2),
        skill: skill || 'General Swap',
        with: targetMentor.name,
        time: `${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]} · ${time}`,
        rating: 5,
        status: 'upcoming'
      };
      localBookings.push(newBooking);
      localStorage.setItem('my_bookings', JSON.stringify(localBookings));

      const localNotifs = JSON.parse(localStorage.getItem('my_notifications') || '[]');
      localNotifs.unshift({
        id: Date.now(),
        type: 'booking',
        title: `Session request sent to ${targetMentor.name} for ${skill}`,
        time: '1s ago',
        icon: '📩'
      });
      localStorage.setItem('my_notifications', JSON.stringify(localNotifs));
    } catch (err) {
      console.error('LocalStorage booking sync error:', err);
    }

    setSubmitting(false);
    setDone(true);
  };

  if (loadingMentor || !targetMentor) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Preparing Booking Calendar...</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">🎉 Session Booked!</h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            We've notified <strong>{targetMentor.name}</strong> for <strong>{skill}</strong> on {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]} at {time}.
          </p>
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => router.navigate({ to: '/activity' })}
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              View My Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.navigate({ to: '/home' })}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={targetMentor.avatar} alt={targetMentor.name} className="w-8 h-8 rounded-full border bg-slate-100 object-cover" />
          <span className="text-xs font-bold text-slate-800">{targetMentor.name}</span>
        </div>
      </div>

      {/* Main Booking Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Book a Skill Swap Session</h1>
          <p className="text-xs sm:text-sm text-purple-700 font-semibold mt-0.5">
            with {targetMentor.name} ({targetMentor.expertise})
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-6">
          
          {/* Select Skill */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Select Skill to Learn
            </label>
            <div className="flex flex-wrap gap-2">
              {(targetMentor.tags && targetMentor.tags.length > 0 ? targetMentor.tags : ['General Swap']).map((s) => {
                const active = skill === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSkill(s)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Day */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Select Date
            </label>
            <div className="grid grid-cols-7 gap-2">
              {days.map((i) => {
                const active = i === day;
                const dayName = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i];
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDay(i)}
                    className={`py-3 rounded-2xl border text-center transition-all ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                        : 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] font-bold block ${active ? 'text-purple-200' : 'text-slate-400'}`}>
                      {dayName}
                    </span>
                    <span className="text-base font-extrabold block mt-0.5">
                      {12 + i}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Time Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Select Time Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {times.map((t) => {
                const active = time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Format */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              4. Session Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Online', 'Offline'] as const).map((t) => {
                const active = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      active
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'Online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    <span>{t} Session</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              5. Session Notes / Goals
            </label>
            <textarea
              rows={3}
              placeholder="What topics or questions do you want to focus on during this swap?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 transition-all"
            />
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Confirm Swap Booking</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
