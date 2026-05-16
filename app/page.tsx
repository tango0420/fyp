"use client";

import React, { useState } from 'react';
import { Play, ArrowUpRight, Search, Mic2, Disc, BookOpen, Guitar, Star, Calendar, Clock, MapPin, Users, ChevronRight, Ticket, Globe, Instagram, Youtube, Music2, Award, Zap, Heart, X, LogIn } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Maps each instrument name to its dashboard route
const INSTRUMENT_ROUTES: Record<string, string> = {
  Piano:       '/dashboard/student/piano',
  Guitar:      '/dashboard/student/guitar',
  Violin:      '/dashboard/student/violin',
  Synthesizer: '/dashboard/student/synthesizer',
  Drums:       '/dashboard/student/drums',
  Cello:       '/dashboard/student/cello',
  Flute:       '/dashboard/student/flute',
  Bass:        '/dashboard/student/bass',
  Saxophone:   '/dashboard/student/saxophone',
  Vocal:       '/dashboard/student/vocal',
};

function LoginPromptModal({ instrument, onClose }: { instrument: string; onClose: () => void }) {
  const router = useRouter();
  const destination = INSTRUMENT_ROUTES[instrument] ?? '/dashboard/student';
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition">
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="bg-orange-600 p-2 rounded-lg mb-4">
          <Disc size={22} className="text-black" strokeWidth={3} />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 tracking-tight text-center">
          Start Learning {instrument}
        </h3>
        <p className="text-white/40 text-sm text-center mb-8 leading-relaxed">
          Create a free account or log in to access your lessons, track progress, and get feedback from our Masters.
        </p>

        {/* Email / password login redirect */}
        <button
          onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(destination)}`)}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold uppercase tracking-widest text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all mb-3"
        >
          <LogIn size={14} /> Log In to Continue
        </button>

        {/* Google */}
        <button
          onClick={() => signIn('google', { callbackUrl: destination })}
          className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-100 transition-all mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          Continue with Google
        </button>

        <p className="text-white/30 text-xs">
          No account?{' '}
          <a href={`/signup?callbackUrl=${encodeURIComponent(destination)}`} className="text-orange-500 hover:underline">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AuthenticHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginModal, setLoginModal] = useState<string | null>(null); // holds instrument name

  const handleStartLearning = (instrumentName: string) => {
    if (session) {
      // Already logged in — go straight to dashboard
      // const route = INSTRUMENT_ROUTES[instrumentName] ?? '/dashboard/student';
      router.push('/login');
    } else {
      // Not logged in — show modal
      setLoginModal(instrumentName);
    }
  };

  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30">

      {/* Background Video/Image Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Disc size={22} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
          </div>
          <ul className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-normal text-white/80">
            {['Academy', 'Instruments', 'Masters', 'Events'].map((item) => (
              <li key={item} className="relative group cursor-pointer">
                <a href={`#${item.toLowerCase()}`} className="hover:text-orange-500 transition">{item}</a>
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white transition">Log In</a>
            <a href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm transition-all">Join Lab</a>
            <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 group">
              <span className="block w-6 h-0.5 bg-white mb-1 group-hover:bg-orange-500 transition-all"></span>
              <span className="block w-6 h-0.5 bg-white mb-1 group-hover:bg-orange-500 transition-all"></span>
              <span className="block w-6 h-0.5 bg-white group-hover:bg-orange-500 transition-all"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center w-full px-16 pt-24 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <span className="inline-block px-3 py-1 rounded-full border border-orange-500/30 text-orange-500 text-[10px] uppercase tracking-widest mb-6">
              Est. 2026 • The Future of Sound
            </span>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight">
              Learn the <span className="italic font-serif">spirit</span> of the <br />
              <span className="font-bold">instrument.</span>
            </h1>
          </div>
          <div className="md:col-span-4 pb-2">
            <p className="text-white/50 text-sm leading-relaxed mb-6 border-l border-white/10 pl-4">
              We don't just teach notes. We teach the resonance between the wood,
              the wire, and your soul. From Harps to Modular Synths.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/login')} className="bg-orange-600 hover:bg-orange-500 p-4 rounded-full transition group">
                <Play size={20} fill="currentColor" />
              </button>
              <button onClick={() => router.push('/login')} className="text-xs font-bold uppercase tracking-tighter italic hover:text-orange-500 transition">Watch the Manifesto</button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="w-full px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[220px]">
          <div onClick={() => router.push('/login')} className="md:col-span-2 md:row-span-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
            <div className="z-10">
              <h3 className="text-2xl font-bold">The Grand Piano</h3>
              <p className="text-white/40 text-sm mt-2">Mastering the 88 keys of emotion.</p>
            </div>
            <ArrowUpRight className="absolute top-8 right-8 text-white/20 group-hover:text-orange-500 transition-colors" />
            <img
              src="https://i.pinimg.com/1200x/2b/25/45/2b2545f87724acb4d3bd343e1a056b76.jpg"
              className="absolute bottom-4 right-4 w-48 h-48 object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
            />
          </div>
          <div onClick={() => router.push('/login')} className="md:col-span-2 bg-white text-black rounded-3xl p-8 flex flex-col justify-center cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <Search size={18} />
              <span className="text-sm font-bold uppercase">Find your sound</span>
            </div>
            <div className="border-b border-black/10 py-2 text-xl font-serif italic text-black/30">Violin? Bass? Theremin?</div>
          </div>
          <div onClick={() => router.push('/login')} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-orange-500/30 transition-all">
            <Mic2 className="text-orange-500 mb-2" size={24} />
            <span className="text-2xl font-bold">1-on-1</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Live Coaching</span>
          </div>
          <div onClick={() => router.push('/login')} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-orange-500/30 transition-all">
            <div className="text-2xl font-bold">20+</div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Instruments</span>
          </div>
        </div>
      </section>

      {/* ─── ACADEMY SECTION ─── */}
      <section id="academy" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-orange-500" size={20} />
          <span className="text-[10px] uppercase tracking-widest text-orange-500">Learn</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">The Academy</h2>
        <p className="text-white/50 text-sm mb-12 max-w-xl">
          Structured learning paths built by world-class musicians. Whether you're picking up your first instrument or refining your professional technique — we have a path for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              level: 'Beginner',
              color: 'bg-green-500',
              title: 'Foundations of Music',
              desc: 'Learn to read music, understand rhythm, and play your first melodies. No experience needed.',
              lessons: 24,
              duration: '3 months',
            },
            {
              level: 'Intermediate',
              color: 'bg-orange-500',
              title: 'Theory & Expression',
              desc: 'Dive into music theory, chord progressions, dynamics, and how to develop your unique voice.',
              lessons: 36,
              duration: '5 months',
            },
            {
              level: 'Advanced',
              color: 'bg-red-500',
              title: 'Performance Mastery',
              desc: 'Stage presence, advanced technique, improvisation, and preparing for real-world performances.',
              lessons: 48,
              duration: '8 months',
            },
          ].map((course) => (
            <div
              key={course.title}
              onClick={() => router.push('/login')}
              className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all group cursor-pointer"
            >
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-black mb-4 ${course.color}`}>
                {course.level}
              </span>
              <h3 className="text-lg font-bold mb-2">{course.title}</h3>
              <p className="text-white/40 text-sm mb-6">{course.desc}</p>
              <div className="flex items-center justify-between text-xs text-white/30 border-t border-white/5 pt-4">
                <span className="flex items-center gap-1"><BookOpen size={12} /> {course.lessons} Lessons</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-white/10 rounded-xl py-2 text-xs uppercase tracking-widest text-white/60 group-hover:border-orange-500/50 group-hover:text-orange-500 transition-all">
                Explore Path <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ─── INSTRUMENTS SECTION ─── */}
      <section id="instruments" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <Guitar className="text-orange-500" size={20} />
          <span className="text-[10px] uppercase tracking-widest text-orange-500">Explore</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Instruments</h2>
        <p className="text-white/50 text-sm mb-12 max-w-xl">
          From classical strings to cutting-edge electronic gear — we cover every instrument across every genre. Each path includes history, technique, theory, and performance.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Piano',
              genre: 'Classical · Jazz · Pop',
              difficulty: 'Beginner Friendly',
              diffColor: 'text-green-400 border-green-400/30',
              img: 'https://i.pinimg.com/736x/51/95/5f/51955ff248efb956da7156c6c124a22f.jpg',
              desc: 'The piano is the foundation of all Western music theory. Understanding the keyboard unlocks chords, scales, and harmony for every other instrument.',
              learn: ['Note reading & sight-reading', 'Major & minor scales', 'Classical pieces by Bach & Chopin', 'Jazz chord voicings & improvisation'],
              courses: 14, students: '3.4k',
            },
            {
              name: 'Guitar',
              genre: 'Rock · Folk · Classical · Blues',
              difficulty: 'Beginner Friendly',
              diffColor: 'text-green-400 border-green-400/30',
              img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600',
              desc: 'The most versatile instrument on the planet. Whether you want to strum campfire songs or shred solos, the guitar meets you where you are.',
              learn: ['Open chords & barre chords', 'Fingerpicking patterns', 'Blues licks & pentatonic scales', 'Acoustic & electric techniques'],
              courses: 18, students: '5.1k',
            },
            {
              name: 'Violin',
              genre: 'Orchestral · Folk · Contemporary',
              difficulty: 'Intermediate',
              diffColor: 'text-orange-400 border-orange-400/30',
              img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=600',
              desc: 'The violin demands precision, posture, and patience — but rewards you with one of the most expressive voices in all of music.',
              learn: ['Bow hold & arm technique', 'First & third position', 'Vibrato & dynamics', 'Orchestral repertoire & folk styles'],
              courses: 11, students: '2.2k',
            },
            {
              name: 'Synthesizer',
              genre: 'Electronic · Ambient · Film Score',
              difficulty: 'All Levels',
              diffColor: 'text-purple-400 border-purple-400/30',
              img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
              desc: 'Synthesizers are the paintbrush of modern music. Learn to sculpt sound from scratch — from warm pads to cutting leads to cinematic textures.',
              learn: ['Oscillators, filters & envelopes', 'Subtractive & FM synthesis', 'Modular patching basics', 'Sound design for film & games'],
              courses: 9, students: '1.8k',
            },
            {
              name: 'Drums',
              genre: 'Rock · Jazz · Latin · Funk',
              difficulty: 'Beginner Friendly',
              diffColor: 'text-green-400 border-green-400/30',
              img: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=600',
              desc: 'Rhythm is the heartbeat of music. Drumming builds coordination, timing, and groove — skills that will make every musician around you better.',
              learn: ['Basic rock & jazz grooves', 'Rudiments & hand technique', 'Reading drum notation', 'Playing in a live band context'],
              courses: 10, students: '2.9k',
            },
            {
              name: 'Cello',
              genre: 'Orchestral · Chamber · Solo',
              difficulty: 'Intermediate',
              diffColor: 'text-orange-400 border-orange-400/30',
              img: 'https://i.pinimg.com/736x/08/8c/b0/088cb027e4d7380f123b25251f7eef88.jpg',
              desc: 'Deep, warm, and hauntingly beautiful — the cello occupies a unique emotional register. It speaks where other instruments can only hint.',
              learn: ['Left hand position & shifting', 'Bow distribution & tone', 'Bach Suites repertoire', 'Ensemble & chamber playing'],
              courses: 8, students: '1.1k',
            },
          ].map((inst) => (
            <div key={inst.name} onClick={() => handleStartLearning(inst.name)} className="bg-zinc-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all group cursor-pointer flex flex-col md:flex-row">
              <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                <img src={inst.img} alt={inst.name} className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/60 hidden md:block" />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{inst.name}</h3>
                    <span className={`text-[9px] uppercase tracking-widest border rounded-full px-2 py-0.5 ${inst.diffColor}`}>{inst.difficulty}</span>
                  </div>
                  <p className="text-[10px] text-orange-500/70 uppercase tracking-widest mb-3">{inst.genre}</p>
                  <p className="text-white/40 text-xs leading-relaxed mb-4">{inst.desc}</p>
                  <div className="mb-4">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">What you'll learn</p>
                    <ul className="space-y-1">
                      {inst.learn.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-white/50">
                          <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><BookOpen size={10} /> {inst.courses} courses</span>
                    <span className="flex items-center gap-1"><Users size={10} /> {inst.students} students</span>
                  </div>
                  <button
                    onClick={() => handleStartLearning(inst.name)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-orange-500 group-hover:text-orange-400 transition"
                  >
                    Start Learning <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MASTERS SECTION ─── */}
      <section id="masters" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <Star className="text-orange-500" size={20} />
          <span className="text-[10px] uppercase tracking-widest text-orange-500">Learn from the best</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">The Masters</h2>
        <p className="text-white/50 text-sm mb-12 max-w-xl">
          Our instructors aren't just teachers — they're working professionals, award-winning composers, and touring musicians. Every lesson is drawn from real-world experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Elena Vasquez',
              specialty: 'Classical Piano',
              origin: 'Madrid, Spain',
              badge: 'Featured Master',
              bio: 'Former soloist with the Berlin Philharmonic and two-time recipient of the Royal Musical Association Award. Elena has performed in 40+ countries and believes that technique without emotion is just noise.',
              teaches: ['Piano Foundations', 'Chopin Études Deep Dive', 'Advanced Sight-Reading', 'Piano for Jazz Musicians'],
              accolades: ['Royal Musical Association Award ×2', 'TEDx Speaker on Music & Memory', 'Album: "Nocturnes" — 2M streams'],
              students: '1.2k', rating: '4.9', reviews: 312,
              img: 'https://randomuser.me/api/portraits/women/65.jpg',
            },
            {
              name: 'Marcus Bell',
              specialty: 'Jazz & Blues Guitar',
              origin: 'New Orleans, USA',
              badge: 'Top Rated',
              bio: 'Grammy-nominated guitarist and composer who has toured with legends of jazz and blues. Marcus spent 15 years on the road before returning to teaching — bringing every stage story into the lesson.',
              teaches: ['Blues Guitar from Scratch', 'Jazz Harmony & Chords', 'Improvisation Bootcamp', 'Lead Guitar Techniques'],
              accolades: ['Grammy Nomination — Best Jazz Album', 'Toured with 3 Rock & Roll Hall of Famers', '12 studio albums released'],
              students: '980', rating: '5.0', reviews: 276,
              img: 'https://randomuser.me/api/portraits/men/41.jpg',
            },
            {
              name: 'Yuki Tanaka',
              specialty: 'Electronic Music & Synthesis',
              origin: 'Tokyo, Japan',
              badge: 'Most Popular',
              bio: 'Modular synth pioneer, film composer, and music technologist. Yuki has scored music for international films and video game soundtracks, and runs one of the most-watched synthesis YouTube channels in Asia.',
              teaches: ['Intro to Synthesis', 'Modular Patching Masterclass', 'Sound Design for Film', 'Ambient Music Production'],
              accolades: ['Scored 8 feature films', '200k+ YouTube subscribers', 'Speaker at NAMM & Superbooth'],
              students: '2.1k', rating: '4.8', reviews: 489,
              img: 'https://randomuser.me/api/portraits/women/33.jpg',
            },
            {
              name: 'David Osei',
              specialty: 'Drums & Percussion',
              origin: 'Accra, Ghana',
              badge: 'New Master',
              bio: 'Session drummer and percussionist who blends West African rhythms with modern jazz and funk. David has recorded for major label artists and brings a global perspective to groove, time, and feel.',
              teaches: ['Drum Kit Foundations', 'West African Rhythms', 'Funk & Groove Masterclass', 'Recording Studio Techniques'],
              accolades: ['Performed on 30+ major label albums', 'Residency at the Accra Arts Center', 'Featured in Modern Drummer Magazine'],
              students: '860', rating: '4.9', reviews: 198,
              img: 'https://randomuser.me/api/portraits/men/78.jpg',
            },
          ].map((master) => (
            <div key={master.name} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 hover:border-orange-500/30 transition-all group cursor-pointer">
              {/* Header */}
              <div className="flex items-start gap-4 mb-5">
                <img src={master.img} alt={master.name} className="w-16 h-16 rounded-full border-2 border-orange-500/40 object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-base">{master.name}</p>
                    <span className="text-[8px] uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">{master.badge}</span>
                  </div>
                  <p className="text-orange-500 text-[10px] uppercase tracking-widest mb-1">{master.specialty}</p>
                  <div className="flex items-center gap-3 text-[10px] text-white/30">
                    <span className="flex items-center gap-1"><MapPin size={9} /> {master.origin}</span>
                    <span className="flex items-center gap-1 text-yellow-400">★ {master.rating} <span className="text-white/20">({master.reviews} reviews)</span></span>
                  </div>
                </div>
              </div>
              {/* Bio */}
              <p className="text-white/40 text-xs leading-relaxed mb-5">{master.bio}</p>
              {/* Teaches */}
              <div className="mb-5">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 flex items-center gap-1"><BookOpen size={9} /> Courses taught</p>
                <div className="flex flex-wrap gap-2">
                  {master.teaches.map((course) => (
                    <span key={course} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white/50">{course}</span>
                  ))}
                </div>
              </div>
              {/* Accolades */}
              <div className="mb-5">
                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 flex items-center gap-1"><Award size={9} /> Accolades</p>
                <ul className="space-y-1">
                  {master.accolades.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-[11px] text-white/40">
                      <span className="w-1 h-1 rounded-full bg-orange-500/60 flex-shrink-0"></span>{a}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-3 text-[10px] text-white/25 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Users size={9} /> {master.students} students</span>
                </div>
                <button onClick={() => router.push('/login')} className="flex items-center gap-1 text-[10px] uppercase tracking-widest bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full px-3 py-1.5 hover:bg-orange-500/20 transition">
                  View Profile <ChevronRight size={9} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── EVENTS SECTION ─── */}
      <section id="events" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-orange-500" size={20} />
          <span className="text-[10px] uppercase tracking-widest text-orange-500">Live Experiences</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Upcoming Events</h2>
        <p className="text-white/50 text-sm mb-12 max-w-xl">
          From intimate workshops to large-scale festivals — connect with music and musicians in real life. Every event is designed to spark something new in you.
        </p>
        <div className="grid grid-cols-1 gap-6">
          {[
            {
              type: 'Workshop',
              typeColor: 'bg-orange-500',
              typeBg: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
              title: 'Jazz Improvisation Masterclass',
              host: 'Marcus Bell',
              hostImg: 'https://randomuser.me/api/portraits/men/41.jpg',
              date: 'April 12, 2026',
              time: '3:00 PM – 6:00 PM',
              location: 'Blue Note Club, New York, NY',
              price: '$49 per person',
              spots: '12 spots left',
              spotsUrgent: true,
              desc: 'Join Grammy-nominated guitarist Marcus Bell for an intimate 3-hour workshop on jazz improvisation. You\'ll learn how to break free from scales and start telling real musical stories. Bring your instrument — this is hands-on.',
              includes: ['Live Q&A with Marcus', 'Recorded session replay', 'PDF chord & scale reference sheet', 'Certificate of completion'],
              img: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=800',
            },
            {
              type: 'Concert',
              typeColor: 'bg-purple-500',
              typeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
              title: 'Virtuoso Showcase: Student Recital Night',
              host: 'Virtuoso Lab',
              hostImg: 'https://randomuser.me/api/portraits/lego/1.jpg',
              date: 'April 19, 2026',
              time: '7:00 PM – 10:00 PM',
              location: 'The Wiltern, Los Angeles, CA',
              price: 'Free entry',
              spots: 'Open to all',
              spotsUrgent: false,
              desc: 'Celebrate the achievements of our students at this quarterly recital night. From classical piano solos to original electronic compositions — every genre and level takes the stage. Come support, be inspired, or sign up to perform.',
              includes: ['Live performance by 20+ students', 'Networking mixer after the show', 'Open mic slot available (sign up required)', 'Refreshments included'],
              img: 'https://images.unsplash.com/photo-1501386761578-eaa54b1bffd7?q=80&w=800',
            },
            {
              type: 'Online Webinar',
              typeColor: 'bg-teal-500',
              typeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
              title: 'Modular Synthesis: From Zero to Sound',
              host: 'Yuki Tanaka',
              hostImg: 'https://randomuser.me/api/portraits/women/33.jpg',
              date: 'April 25, 2026',
              time: '2:00 PM – 4:00 PM JST',
              location: 'Live on Zoom (Global)',
              price: '$19 per person',
              spots: '40 spots left',
              spotsUrgent: false,
              desc: 'Yuki Tanaka walks you through the basics of modular synthesis in this beginner-friendly online session. No gear required — just curiosity. You\'ll learn how patches work, how to shape a sound from scratch, and how to get started affordably.',
              includes: ['2-hour live session with Yuki', 'Access to virtual patch simulator', 'Starter gear buying guide PDF', '30-day replay access'],
              img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800',
            },
            {
              type: 'Festival',
              typeColor: 'bg-red-500',
              typeBg: 'bg-red-500/10 border-red-500/20 text-red-400',
              title: 'Soundcraft Music Festival 2026',
              host: 'Multiple Artists · 3 Stages',
              hostImg: 'https://randomuser.me/api/portraits/men/22.jpg',
              date: 'May 3 – 5, 2026',
              time: 'All Day (Gates open 10 AM)',
              location: 'Stubb\'s Amphitheater, Austin, TX',
              price: 'From $89 (Early Bird)',
              spots: 'Early bird pricing ends April 15',
              spotsUrgent: true,
              desc: 'Three days, three stages, and over 60 artists spanning jazz, classical, electronic, and experimental music. Soundcraft 2026 is the flagship Virtuoso live event — featuring our Masters in live performances, panel talks, and open jam sessions.',
              includes: ['3-day festival pass', 'Access to all 3 stages', 'Backstage meet & greet (VIP only)', 'Panel: "The Future of Music Education"'],
              img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800',
            },
          ].map((event) => (
            <div key={event.title} onClick={() => router.push('/login')} className="bg-zinc-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all group cursor-pointer">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-72 h-52 md:h-auto flex-shrink-0 overflow-hidden">
                  <img src={event.img} alt={event.title} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-zinc-900/70 hidden md:block" />
                  <span className={`absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${event.typeBg}`}>
                    {event.type}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Title & Host */}
                    <h3 className="font-bold text-lg mb-1 group-hover:text-orange-100 transition">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <img src={event.hostImg} alt={event.host} className="w-5 h-5 rounded-full object-cover border border-orange-500/30" />
                      <p className="text-white/40 text-xs">Hosted by <span className="text-orange-400">{event.host}</span></p>
                    </div>
                    {/* Description */}
                    <p className="text-white/40 text-xs leading-relaxed mb-4">{event.desc}</p>
                    {/* Includes */}
                    <div className="mb-4">
                      <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2">What's included</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {event.includes.map((item) => (
                          <span key={item} className="flex items-center gap-1.5 text-[11px] text-white/40">
                            <span className="w-1 h-1 rounded-full bg-orange-500/60 flex-shrink-0"></span>{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-4">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] text-white/30 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock size={9} /> {event.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={9} /> {event.location}</span>
                      <span className={`flex items-center gap-1 ${event.spotsUrgent ? 'text-red-400' : 'text-green-400'}`}>● {event.spots}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-white">{event.price}</span>
                      <button onClick={(e) => { e.stopPropagation(); router.push('/login'); }} className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition">
                        <Ticket size={10} /> Register
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Instruments Section */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-white/90 tracking-tight">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div onClick={() => router.push('/login')} className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=400" alt="Violin" className="w-32 h-32 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-2">Violin</h3>
            <p className="text-white/50 text-sm text-center">Expressive, timeless, and the soul of orchestras.</p>
          </div>
          <div onClick={() => router.push('/login')} className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400" alt="Synthesizer" className="w-32 h-32 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-2">Synthesizer</h3>
            <p className="text-white/50 text-sm text-center">Shape the future of sound with endless possibilities.</p>
          </div>
          <div onClick={() => router.push('/login')} className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400" alt="Guitar" className="w-32 h-32 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-2">Guitar</h3>
            <p className="text-white/50 text-sm text-center">From classical to rock, the icon of versatility.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-white/90 tracking-tight">What Musicians Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-2 border-orange-500" />
            <p className="text-white/80 italic mb-2">"Virtuoso changed the way I see music. The coaching is world-class!"</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Alex, Guitarist</span>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-2 border-orange-500" />
            <p className="text-white/80 italic mb-2">"The instrument library is so deep and inspiring. I found my sound!"</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Jamie, Composer</span>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-2 border-orange-500" />
            <p className="text-white/80 italic mb-2">"I love the modern UI and the expert coaching. Highly recommended!"</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Chris, Producer</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-8 pb-24 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">Ready to Master Your Sound?</h2>
        <p className="text-lg text-white/60 mb-8 max-w-2xl">Join thousands of musicians and creators learning, collaborating, and pushing the boundaries of music every day.</p>
        <button
          onClick={() => handleStartLearning('Piano')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-black uppercase tracking-widest shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all"
        >
          Get Started Now
        </button>
      </section>

      {/* ─── LOGIN PROMPT MODAL ─── */}
      {loginModal && (
        <LoginPromptModal
          instrument={loginModal}
          onClose={() => setLoginModal(null)}
        />
      )}

    </main>
  );
}