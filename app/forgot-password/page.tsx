"use client";

import React, { useState } from 'react';
import { Disc } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Unable to send reset email');
      }

      setMessage('If that email exists, a reset link has been sent.');
      setEmail('');
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

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

      <div className="bg-zinc-900/80 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center z-10 mx-auto mt-24">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-orange-600 p-2 rounded-lg">
            <Disc size={22} className="text-black" strokeWidth={3} />
          </div>
          <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-white">Forgot Password</h2>
        <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
          Enter your email and we&apos;ll send a reset link.
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
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:from-orange-600 hover:to-orange-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <p className="mt-4 text-orange-500 text-sm font-semibold text-center">{message}</p>}

        <div className="mt-6 text-white/40 text-xs text-center space-y-2">
          <p>
            Remembered it?{' '}
            <a href="/login" className="text-orange-500 hover:underline">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}