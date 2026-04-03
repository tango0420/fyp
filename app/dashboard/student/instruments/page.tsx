"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import StudentSidebar from "@/app/components/StudentSidebar";


const instruments = [
  { name: "Guitar", type: "Electric / Acoustic", image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=800&auto=format&fit=crop" },
  { name: "Piano", type: "Grand / Digital", image: "https://cdn.pixabay.com/photo/2023/03/31/18/44/piano-7890735_1280.jpg" },
  { name: "Drums", type: "Percussion", image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?q=80&w=800&auto=format&fit=crop" },
  { name: "Violin", type: "Classical", image: "https://www.sweetwater.com/sweetcare/media/2022/12/10_Violin-Playing-Position.jpg" },
  { name: "Flute", type: "Woodwind", image: "https://phamoxmusic.com/wp-content/uploads/2022/09/Flute_PIC_6475_800.jpg" },
  { name: "Saxophone", type: "Woodwind / Jazz", image: "https://thumbs.dreamstime.com/b/musical-instrument-sax-close-up-saxophone-hands-young-guy-playing-jazz-79509943.jpg" },
  { name: "Trumpet", type: "Brass", image: "https://playthetunes.com/wp-content/uploads/2022/09/The-Trumpet-1024x642.jpg" },
  { name: "Bass", type: "Electric / Acoustic", image: "https://tse2.mm.bing.net/th/id/OIP.AGO0BuyYnn_g4L1JVrKLHgHaFs?pid=Api&P=0&h=220" },
  { name: "Cello", type: "Classical / Strings", image: "https://musicalinstrumenthire.com/wp-content/uploads/2018/02/cello-player.jpg" },
  { name: "Ukulele", type: "String / Acoustic", image: "https://mixingaband.com/wp-content/uploads/2023/04/ukulele-1024x683.jpg" },
  { name: "Clarinet", type: "Woodwind", image: "https://cdn.britannica.com/39/19239-050-DA406938/Clarinet.jpg" },
  { name: "Trombone", type: "Brass", image: "https://wallpapercosmos.com/w/full/4/c/8/1174157-1875x2500-iphone-hd-trombone-background-photo.jpg" },
  { name: "Harp", type: "Classical / Strings", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop" },
  { name: "Harmonica", type: "Woodwind / Blues", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop" },
  { name: "Banjo", type: "String / Folk", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop" },
  { name: "Mandolin", type: "String / Folk", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800&auto=format&fit=crop" },
  { name: "French Horn", type: "Brass", image: "https://images.unsplash.com/photo-1478178143585-9373e7907176?q=80&w=800&auto=format&fit=crop" },
  { name: "Oboe", type: "Woodwind", image: "https://images.unsplash.com/photo-1517049290392-f2b2316c0fa8?q=80&w=800&auto=format&fit=crop" },
  { name: "Percussion", type: "Mallets / Vibraphone", image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?q=80&w=800&auto=format&fit=crop" },
  { name: "Tuba", type: "Brass / Low", image: "https://images.unsplash.com/photo-1478178143585-9373e7907176?q=80&w=800&auto=format&fit=crop" },
  { name: "Viola", type: "Classical / Strings", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop" },
  { name: "Acoustic Bass", type: "String / Jazz", image: "https://images.unsplash.com/photo-1487856671538-e7e516e484c7?q=80&w=800&auto=format&fit=crop" },
  { name: "Synthesizer", type: "Electronic / Digital", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop" },
  { name: "Organ", type: "Electronic / Classical", image: "https://cdn.pixabay.com/photo/2023/03/31/18/44/piano-7890735_1280.jpg" },
];

export default function InstrumentsPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      <main className="pl-20 max-w-[1440px] mx-auto">
        <StudentSidebar />
        {/* 2. Header - Simple & Clean */}
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
             <span className="text-slate-600">Virtuoso</span>
             <span className="text-slate-800">/</span>
             <span className="text-slate-200">Instruments</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-200">
  {session?.user?.name || "User"}
</p>
<div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10 flex items-center justify-center">
  {session?.user?.image ? (
    <img src={session.user.image} alt="Avatar" className="grayscale w-full h-full object-cover" />
  ) : (
    <span className="text-lg text-white font-bold">
      {session?.user?.name ? session.user.name[0] : "U"}
    </span>
  )}
</div>
                <LogoutButton />
            </div>
          </div>
        </header>

        <div className="pt-32 px-12 py-12">
          
          {/* Main Content */}
          <section className="space-y-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Instrument Archive</h1>
                <p className="text-slate-400">Explore and learn from {instruments.length} different instruments</p>
              </div>
              <Link href="/dashboard/student" className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-[#ff5a00] transition-all">
                <ArrowLeft size={18} />
                <span className="text-xs font-semibold uppercase tracking-widest">Back to Dashboard</span>
              </Link>
            </div>

            {/* Instruments Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {instruments.map((inst) => {
                const instrumentPath = inst.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={inst.name} href={`/dashboard/student/${instrumentPath}`} className="group cursor-pointer block">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-[#1a1a1a] border border-white/5 hover:border-[#ff5a00]/50 transition-all shadow-lg hover:shadow-xl">
                      <img 
                        src={inst.image} 
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                        alt={inst.name} 
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-200 truncate group-hover:text-[#ff5a00] transition-colors">{inst.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{inst.type}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
