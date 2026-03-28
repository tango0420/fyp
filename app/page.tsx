import React from 'react';
import { Play, ArrowUpRight, Search, Mic2, Disc, Globe2 } from 'lucide-react';

export default function AuthenticHome() {
  return (
    <main className="relative min-h-screen w-full grain selection:bg-orange-500/30">
      {/* Background Video/Image Layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#121214]" />
        {/* Placeholder for a high-quality cinematic video */}
        <img 
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop" 
          alt="Studio Background"
          className="w-full h-full object-cover scale-105 blur-[2px] opacity-40"
        />
      </div>

      {/* Minimalist Navbar with Underline Animation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-orange-600 p-2 rounded-lg">
              <Disc size={22} className="text-black" strokeWidth={3} />
            </div>
            <span className="text-lg font-semibold tracking-tight uppercase italic text-white">Virtuoso.</span>
          </div>
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-normal text-white/80">
            <li className="relative group cursor-pointer">
              <span className="hover:text-orange-500 transition">Academy</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="hover:text-orange-500 transition">Instruments</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="hover:text-orange-500 transition">Masters</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </li>
            <li className="relative group cursor-pointer">
              <span className="hover:text-orange-500 transition">Events</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </li>
          </ul>
          {/* Actions & Hamburger */}
          <div className="flex items-center gap-3">
            <a href="/login" className="hidden sm:block text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white transition">Log In</a>
            <a href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm transition-all">Join Lab</a>
            {/* Hamburger for mobile */}
            <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 group">
              <span className="block w-6 h-0.5 bg-white mb-1 group-hover:bg-orange-500 transition-all"></span>
              <span className="block w-6 h-0.5 bg-white mb-1 group-hover:bg-orange-500 transition-all"></span>
              <span className="block w-6 h-0.5 bg-white group-hover:bg-orange-500 transition-all"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Editorial Style */}
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
              <button className="bg-orange-600 hover:bg-orange-500 p-4 rounded-full transition group">
                <Play size={20} fill="currentColor" />
              </button>
              <span className="text-xs font-bold uppercase tracking-tighter italic">Watch the Manifesto</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Medium Size */}
      <section className="w-full px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[220px]">
          
          {/* Featured Instrument Card */}
          <div className="md:col-span-2 md:row-span-2 bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative">
            <div className="z-10">
              <h3 className="text-2xl font-bold">The Grand Piano</h3>
              <p className="text-white/40 text-sm mt-2">Mastering the 88 keys of emotion.</p>
            </div>
            <ArrowUpRight className="absolute top-8 right-8 text-white/20 group-hover:text-orange-500 transition-colors" />
            <img 
              src="https://images.unsplash.com/photo-1520527053377-ab65b2861c83?q=80&w=500" 
              className="absolute bottom-[-20%] right-[-10%] w-64 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 rotate-12"
            />
          </div>

          {/* Search/Filter Card */}
          <div className="md:col-span-2 bg-white text-black rounded-3xl p-8 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
               <Search size={18} />
               <span className="text-sm font-bold uppercase">Find your sound</span>
             </div>
             <input 
               type="text" 
               placeholder="Violin? Bass? Theremin?" 
               className="bg-transparent border-b border-black/10 py-2 focus:outline-none placeholder:text-black/30 text-xl font-serif italic"
             />
          </div>

          {/* Small Stat Card */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
            <Mic2 className="text-orange-500 mb-2" size={24} />
            <span className="text-2xl font-bold">1-on-1</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Live Coaching</span>
          </div>

          {/* Another Stat Card */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
            <div className="text-2xl font-bold">52+</div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Instruments</span>
          </div>

        </div>
      </section>

      {/* Trending Instruments Section */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-bold mb-8 text-white/90 tracking-tight">Trending Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=400" alt="Violin" className="w-32 h-32 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-2">Violin</h3>
            <p className="text-white/50 text-sm text-center">Expressive, timeless, and the soul of orchestras.</p>
          </div>
          <div className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400" alt="Synthesizer" className="w-32 h-32 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-2">Synthesizer</h3>
            <p className="text-white/50 text-sm text-center">Shape the future of sound with endless possibilities.</p>
          </div>
          <div className="bg-zinc-900/60 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
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
            <p className="text-white/80 italic mb-2">“Virtuoso changed the way I see music. The coaching is world-class!”</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Alex, Guitarist</span>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-2 border-orange-500" />
            <p className="text-white/80 italic mb-2">“The instrument library is so deep and inspiring. I found my sound!”</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Jamie, Composer</span>
          </div>
          <div className="bg-zinc-800/80 rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="User" className="w-16 h-16 rounded-full mb-4 border-2 border-orange-500" />
            <p className="text-white/80 italic mb-2">“I love the modern UI and the expert coaching. Highly recommended!”</p>
            <span className="text-xs text-white/40 uppercase tracking-widest">- Chris, Producer</span>
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="max-w-7xl mx-auto px-8 pb-24 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">Ready to Master Your Sound?</h2>
        <p className="text-lg text-white/60 mb-8 max-w-2xl">Join thousands of musicians and creators learning, collaborating, and pushing the boundaries of music every day.</p>
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-full text-lg font-black uppercase tracking-widest shadow-xl hover:from-orange-600 hover:to-orange-500 transition-all">Get Started Now</button>
      </section>
    </main>
  );
}