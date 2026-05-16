"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  ArrowLeft, Bell, Lock, User, Palette, Eye, LogOut, ChevronRight, 
  Upload, Mail, Zap, Shield, Smartphone, Globe,
  Download
} from "lucide-react";
import StudentSidebar from "@/app/components/StudentSidebar";
import { LogoutButton } from "@/app/components/LogoutButton";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    instrument: "Guitar",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Settings saved:", formData);
  };

  const tabs = [
    { id: "account", label: "Account", icon: User, color: "from-blue-500 to-cyan-500" },
    { id: "preferences", label: "Preferences", icon: Palette, color: "from-purple-500 to-pink-500" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "from-orange-500 to-red-500" },
    { id: "security", label: "Security", icon: Shield, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <StudentSidebar />
      
      {/* Animated gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff5a00]/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/student" 
            className="p-2 rounded-lg bg-white/5 hover:bg-[#ff5a00]/20 text-slate-400 hover:text-[#ff5a00] transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-[#ff5a00] to-transparent rounded-full" />
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Dashboard</p>
              <p className="text-sm font-bold text-white">Settings</p>
            </div>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="pl-20 pt-24 px-12 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-3">Settings</h1>
            <p className="text-slate-400 text-lg">Customize your learning experience and account preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {tabs.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  activeTab === id
                    ? "bg-[#1a1a1a] border-[#ff5a00]/50 shadow-lg shadow-[#ff5a00]/10"
                    : "bg-[#1a1a1a] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5"
                }`}
              >
                {activeTab === id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                      activeTab === id 
                        ? `bg-gradient-to-br ${color}` 
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon 
                      size={24} 
                      className={activeTab === id ? "text-white" : "text-slate-400 group-hover:text-white"}
                    />
                  </div>
                  <p className={`text-sm font-semibold transition-colors duration-300 ${
                    activeTab === id ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`}>
                    {label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-white">Account Settings</h2>
                </div>

                {/* Profile Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
                  <div className="flex items-start gap-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#ff5a00] to-orange-600 flex items-center justify-center border-4 border-white/10 shadow-xl">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="Avatar" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <span className="text-5xl font-bold text-white">
                            {session?.user?.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <button className="absolute bottom-0 right-0 p-3 bg-[#ff5a00] hover:bg-[#ff5a00]/90 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
                        <Upload size={18} className="text-white" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{session?.user?.name || "User"}</h3>
                      <p className="text-slate-400 mb-6">Musician • Learning Journey</p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-500" />
                          <span className="text-slate-400">{session?.user?.email}</span>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-[#ff5a00] hover:bg-[#ff5a00]/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#ff5a00]/20 hover:scale-105">
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <User size={16} className="text-slate-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#ff5a00]/20 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Mail size={16} className="text-slate-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed opacity-50"
                    />
                    <p className="text-xs text-slate-500 mt-2">Email address cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-slate-500" />
                    Primary Instrument
                  </label>
                  <select
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ff5a00]/20 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option>Guitar</option>
                    <option>Piano</option>
                    <option>Drums</option>
                    <option>Violin</option>
                    <option>Flute</option>
                    <option>Bass</option>
                    <option>Saxophone</option>
                  </select>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#ff5a00] to-orange-600 hover:from-[#ff5a00]/90 hover:to-orange-600/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#ff5a00]/20 hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <div className="space-y-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-white">Learning Preferences</h2>
                </div>

                {/* Theme Selection */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Palette size={20} /> Theme Preference
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["Dark", "Light", "Auto"].map((theme) => (
                      <button
                        key={theme}
                        className="p-4 rounded-xl border border-white/10 hover:border-purple-500/50 bg-[#1a1a1a] hover:bg-purple-500/10 text-slate-300 hover:text-white font-medium transition-all duration-300"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe size={20} /> Language
                  </h3>
                  <select className="w-full bg-white/5 border border-white/10 hover:border-pink-500/50 focus:border-pink-500/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all duration-300">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                {/* Learning Level */}
                <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap size={20} /> Learning Level
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <button
                        key={level}
                        className="p-4 rounded-xl border border-white/10 hover:border-rose-500/50 bg-[#1a1a1a] hover:bg-rose-500/10 text-slate-300 hover:text-white font-medium transition-all duration-300"
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 hover:scale-105">
                  Save Preferences
                </button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-white">Notification Settings</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Lesson Reminders", desc: "Get notified about upcoming lessons", icon: Bell, enabled: true },
                    { title: "Achievements", desc: "Celebrate when you unlock badges", icon: Zap, enabled: true },
                    { title: "Messages", desc: "Receive replies from instructors", icon: Mail, enabled: true },
                    { title: "Weekly Report", desc: "Summary of your learning progress", icon: Globe, enabled: false },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 hover:border-orange-500/50 p-6 rounded-2xl hover:bg-orange-500/15 transition-all duration-300 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all">
                            <Icon size={20} className="text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{item.title}</p>
                            <p className="text-sm text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                        <div
                          className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                            item.enabled ? "bg-gradient-to-r from-[#ff5a00] to-orange-600" : "bg-white/10"
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
                              item.enabled ? "right-1" : "left-1"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/20 hover:scale-105">
                  Save Notifications
                </button>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="space-y-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-10 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-white">Security Settings</h2>
                </div>

                {/* Password Change */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Lock size={20} /> Change Password
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full bg-white/5 border border-white/10 hover:border-green-500/50 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full bg-white/5 border border-white/10 hover:border-green-500/50 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="w-full bg-white/5 border border-white/10 hover:border-green-500/50 focus:border-green-500/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                    <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20 hover:scale-105">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/50 rounded-xl transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 group-hover:bg-emerald-500/30 rounded-lg transition-all">
                        <Download size={18} className="text-emerald-400" />
                      </div>
                      <span className="text-white font-semibold">Download Your Data</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 group-hover:bg-red-500/30 rounded-lg transition-all">
                        <LogOut size={18} className="text-red-400" />
                      </div>
                      <span className="text-red-400 group-hover:text-red-300 font-semibold transition-colors">Delete Account</span>
                    </div>
                    <ChevronRight size={18} className="text-red-400 group-hover:text-red-300 transition-colors" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
