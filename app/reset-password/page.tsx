"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Disc } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token') ?? '';
  const emailFromQuery = searchParams.get('email') ?? '';

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to reset password');
      }

      setMessage('Password updated. Redirecting to login...');
      setTimeout(() => router.replace('/login'), 1200);
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage((error as Error).message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center z-10 mx-auto mt-24 text-center">
        <h2 className="text-2xl font-bold mb-2 text-white">Invalid Reset Link</h2>
        <p className="text-white/50 text-sm mb-6">This password reset link is missing a token.</p>
        <a href="/forgot-password" className="text-orange-500 hover:underline text-sm">
          Request a new reset link
        </a>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center z-10 mx-auto mt-24">
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-orange-600 p-2 rounded-lg">
          <Disc size={22} className="text-black" strokeWidth={3} />
        </div>
        <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-white">Reset Password</h2>
      <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
        Choose a new password for your account.
      </p>

      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Email"
          className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="New password"
          className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={event => setConfirmPassword(event.target.value)}
          placeholder="Confirm new password"
          className="bg-zinc-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 transition-colors"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      {message && <p className="mt-4 text-orange-500 text-sm font-semibold text-center">{message}</p>}

      <div className="mt-6 text-white/40 text-xs text-center space-y-2">
        <p>
          <a href="/login" className="text-orange-500 hover:underline">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>

      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}