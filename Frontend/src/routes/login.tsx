import { createFileRoute } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Sparkles, ArrowRight, Zap, AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: Login,
});

export default function Login(props: any) {
  const hookNavigation = useNavigation<any>();
  const navigation = props?.navigation || hookNavigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (!email.trim()) {
      setEmailError(true);
      setErrorMessage('Please enter your email address');
      return;
    }
    if (!password) {
      setPasswordError(true);
      setErrorMessage('Please enter your password');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (navigation && navigation.navigate) {
        navigation.navigate('Main');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const bypassToApp = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Main');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-950 p-4 md:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-400 text-white shadow-lg shadow-purple-500/30 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            SkillSwap
          </h1>
          <p className="text-sm font-medium text-purple-200/80 mt-1">
            Learn • Teach • Grow Together
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 border border-white/40">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email or Username
              </label>
              <div className={`flex items-center rounded-2xl border px-3.5 py-3 transition-all duration-200 ${
                emailError ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50 focus-within:border-purple-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/10'
              }`}>
                <Mail className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError(false);
                    setErrorMessage('');
                  }}
                  disabled={loading}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className={`flex items-center rounded-2xl border px-3.5 py-3 transition-all duration-200 ${
                passwordError ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50 focus-within:border-purple-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/10'
              }`}>
                <Lock className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                    setErrorMessage('');
                  }}
                  disabled={loading}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Quick Demo Bypass Button */}
            <button
              type="button"
              onClick={bypassToApp}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Explore App (Demo Mode)</span>
            </button>
          </form>

          {/* Footer Signup Redirect */}
          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigation && navigation.navigate('Signup')}
              className="text-purple-600 font-bold hover:underline ml-1"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
