"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import StudentSidebar from "./StudentSidebar";
import { LogoutButton } from "./LogoutButton";

export default function DashboardShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <StudentSidebar />

      <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
        <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
          <span className="text-slate-600">Virtuoso</span>
          <span className="text-slate-800">/</span>
          <span className="text-slate-200">{title ?? eyebrow ?? "Dashboard"}</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group border-r border-white/5 pr-8">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm pl-8 outline-none w-48 placeholder:text-slate-700" />
          </div>

          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-slate-200">{session?.user?.name || "User"}</p>
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10 flex items-center justify-center">
              {session?.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="grayscale w-full h-full object-cover" />
              ) : (
                <span className="text-lg text-white font-bold">{session?.user?.name ? session.user.name[0] : "U"}</span>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="pl-20 pt-24 px-12 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
