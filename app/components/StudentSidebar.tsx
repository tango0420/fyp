"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disc, Layers, Music, BarChart3, Volume2, Settings } from "lucide-react";

export default function StudentSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-20 z-50 border-r border-white/5 bg-[#1a1a1a] flex flex-col items-center py-10">
      <div className="mb-12">
        <Disc size={24} className="text-[#ff5a00]" />
      </div>
      <nav className="flex flex-col gap-10 text-slate-600">
        <Link 
          href="/dashboard/student" 
          className={`hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center ${isActive("/dashboard/student") && !pathname.includes("/dashboard/student/") ? "text-[#ff5a00]" : "text-slate-500"}`}
        >
          <Layers size={22} />
        </Link>
        <Link 
          href="/dashboard/student/instruments" 
          className={`hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center ${isActive("/dashboard/student/instruments") ? "text-[#ff5a00]" : "text-slate-500"}`}
        >
          <Music size={22} />
        </Link>
        <Link 
          href="/dashboard/student/quiz" 
          className={`hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center ${isActive("/dashboard/student/quiz") ? "text-[#ff5a00]" : "text-slate-500"}`}
        >
          <BarChart3 size={22} />
        </Link>
        <Link 
          href="/dashboard/student/tuner" 
          className={`hover:text-[#ff5a00] transition-colors inline-flex items-center justify-center ${isActive("/dashboard/student/tuner") ? "text-[#ff5a00]" : "text-slate-500"}`}
        >
          <Volume2 size={22} />
        </Link>
        <button className="hover:text-[#ff5a00] transition-colors cursor-pointer inline-flex items-center justify-center text-slate-500">
          <Settings size={22} />
        </button>
      </nav>
    </aside>
  );
}
