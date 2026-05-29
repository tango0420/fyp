/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Bell, Lock, User, Palette, LogOut, ChevronRight,
  Upload, Mail, Zap, Shield, Globe, Download, Music,
  Mic, Clock, Calendar, Headphones, Eye, Link2,
  BookOpen, Target, Volume2, Sliders, Wifi, FileText,
  Smartphone, Key, MonitorSmartphone, Trash2, ChevronDown, Plus, X
} from "lucide-react";
import DashboardShell from "@/app/components/DashboardShell";

// ── Reusable primitives ────────────────────────────────────────────────────

function SectionHeader({ gradient, title }: { gradient: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className={`h-10 w-1 bg-gradient-to-b ${gradient} rounded-full`} />
      <h2 className="text-3xl font-bold text-white">{title}</h2>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/[0.03] border border-white/10 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
      <Icon size={17} className="text-slate-400" />
      {children}
    </h3>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-300 mb-2">{children}</label>;
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#ff5a00]/15 transition-all duration-200 ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full bg-[#111] border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/60 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-200 appearance-none cursor-pointer pr-10 ${className}`}
      >
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${enabled ? "bg-[#ff5a00]" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

function SaveButton({ gradient, children }: { gradient: string; children: React.ReactNode }) {
  return (
    <button className={`px-8 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}>
      {children}
    </button>
  );
}

function RangeSlider({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <FieldLabel>{label}</FieldLabel>
        <span className="text-sm text-[#ff5a00] font-mono font-medium">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff5a00] [&::-webkit-slider-thumb]:cursor-pointer accent-[#ff5a00]"
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">{min}{unit}</span>
        <span className="text-xs text-slate-600">{max}{unit}</span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState("account");

  // Account
  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    instrument: "Guitar",
    timezone: "Asia/Kathmandu",
    language: "English",
  });
  const [secondaryInstruments, setSecondaryInstruments] = useState<string[]>(["Piano"]);

  // Practice Goals
  const [practiceGoal, setPracticeGoal] = useState(30);
  const [weeklyDays, setWeeklyDays] = useState(5);
  const [streakReminder, setStreakReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("18:00");

  // Lesson Preferences
  const [lessonLength, setLessonLength] = useState("45");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [learningStyle, setLearningStyle] = useState("Classical");

  // Audio Settings
  const [micSensitivity, setMicSensitivity] = useState(75);
  const [inputGain, setInputGain] = useState(60);
  const [micDevice, setMicDevice] = useState("default");

  // Tuner & Metronome
  const [tuningA4, setTuningA4] = useState(440);
  const [temperament, setTemperament] = useState("Equal");
  const [metronomeBPM, setMetronomeBPM] = useState(120);
  const [metronomeVolume, setMetronomeVolume] = useState(80);
  const [beatSubdivision, setBeatSubdivision] = useState("Quarter");
  const [visualCue, setVisualCue] = useState(true);

  // Tutor Preferences
  const [tutorLanguage, setTutorLanguage] = useState("English");
  const [tutorMinRating, setTutorMinRating] = useState(4);
  const [priceRange, setPriceRange] = useState("$20–$60/hr");
  const [availability, setAvailability] = useState<string[]>(["Weekdays", "Evenings"]);

  // Notifications
  const [notifs, setNotifs] = useState({
    lessonReminders: true,
    achievements: true,
    messages: true,
    weeklyReport: false,
    practiceStreak: true,
    newTutors: false,
    promotions: false,
  });
  const [notifChannels, setNotifChannels] = useState({
    email: true,
    inApp: true,
    push: false,
    sms: false,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    sharePractice: false,
    researchConsent: true,
  });

  // Accessibility
  const [accessibility, setAccessibility] = useState({
    captions: false,
    reducedMotion: false,
    highContrast: false,
  });
  const [fontSize, setFontSize] = useState("Medium");

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [activeSessions] = useState([
    { device: "Chrome · Windows", location: "Kathmandu, NP", time: "Now", current: true },
    { device: "Safari · iPhone 15", location: "Kathmandu, NP", time: "2 days ago", current: false },
  ]);

  // Integrations
  const [integrations, setIntegrations] = useState({
    googleCalendar: false,
    outlookCalendar: false,
    googleDrive: false,
    dropbox: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleNotif = (key: keyof typeof notifs) => setNotifs(p => ({ ...p, [key]: !p[key] }));
  const toggleChannel = (key: keyof typeof notifChannels) => setNotifChannels(p => ({ ...p, [key]: !p[key] }));
  const togglePrivacy = (key: keyof typeof privacy) => setPrivacy(p => ({ ...p, [key]: !p[key] }));
  const toggleAccessibility = (key: keyof typeof accessibility) => setAccessibility(p => ({ ...p, [key]: !p[key] }));
  const toggleIntegration = (key: keyof typeof integrations) => setIntegrations(p => ({ ...p, [key]: !p[key] }));

  const toggleAvailability = (v: string) =>
    setAvailability(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const removeSecondary = (inst: string) =>
    setSecondaryInstruments(prev => prev.filter(i => i !== inst));
  const addSecondary = () => {
    const opts = ["Violin", "Bass", "Drums", "Saxophone", "Flute", "Ukulele", "Cello"];
    const available = opts.find(o => !secondaryInstruments.includes(o) && o !== formData.instrument);
    if (available) setSecondaryInstruments(prev => [...prev, available]);
  };

  const tabs = [
    { id: "account",       label: "Account",        icon: User,         color: "from-blue-500 to-cyan-500" },
    { id: "music",         label: "Music",           icon: Music,        color: "from-[#ff5a00] to-orange-500" },
    { id: "audio",         label: "Audio",           icon: Mic,          color: "from-violet-500 to-purple-600" },
    { id: "tutor",         label: "Tutor",           icon: BookOpen,     color: "from-teal-500 to-emerald-500" },
    { id: "notifications", label: "Notifications",   icon: Bell,         color: "from-orange-500 to-red-500" },
    { id: "privacy",       label: "Privacy",         icon: Eye,          color: "from-pink-500 to-rose-600" },
    { id: "integrations",  label: "Integrations",    icon: Link2,        color: "from-indigo-500 to-blue-600" },
    { id: "security",      label: "Security",        icon: Shield,       color: "from-green-500 to-emerald-500" },
  ];

  const ToggleRow = ({
    title, desc, icon: Icon, iconColor, enabled, onToggle
  }: { title: string; desc: string; icon: React.ElementType; iconColor: string; enabled: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );

  return (
    <DashboardShell eyebrow="Dashboard" title="Settings">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff5a00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your learning experience and account preferences</p>
      </div>

      {/* Tab Navigation — scrollable 8-tab grid */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        {tabs.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`group relative p-4 rounded-2xl border transition-all duration-300 overflow-hidden ${
              activeTab === id
                ? "bg-[#1a1a1a] border-[#ff5a00]/40 shadow-lg shadow-[#ff5a00]/10"
                : "bg-[#1a1a1a] border-white/8 hover:border-white/20"
            }`}
          >
            {activeTab === id && <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={`p-2 rounded-xl transition-all duration-300 ${activeTab === id ? `bg-gradient-to-br ${color}` : "bg-white/5 group-hover:bg-white/10"}`}>
                <Icon size={18} className={activeTab === id ? "text-white" : "text-slate-400 group-hover:text-white"} />
              </div>
              <p className={`text-xs font-semibold transition-colors duration-300 ${activeTab === id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>
                {label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-[#111] border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl">

        {/* ── ACCOUNT ── */}
        {activeTab === "account" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-blue-500 to-cyan-500" title="Account Settings" />

            {/* Profile Card */}
            <Card className="bg-gradient-to-br from-blue-500/8 to-cyan-500/8 border-blue-500/20">
              <div className="flex items-start gap-8 flex-wrap">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#ff5a00] to-orange-600 flex items-center justify-center border-4 border-white/10 shadow-xl overflow-hidden">
                    {session?.user?.image ? (
                      <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-white">{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-2.5 bg-[#ff5a00] hover:bg-[#ff6b1a] rounded-full shadow-lg transition-all hover:scale-110">
                    <Upload size={14} className="text-white" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white">{session?.user?.name || "User"}</h3>
                  <p className="text-slate-400 text-sm mt-1">Musician · Student</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Mail size={14} className="text-slate-500" />
                    <span className="text-slate-400 text-sm">{session?.user?.email}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" />
              </div>
              <div>
                <FieldLabel>Email Address</FieldLabel>
                <Input name="email" value={formData.email} disabled className="opacity-40 cursor-not-allowed" />
                <p className="text-xs text-slate-600 mt-1.5">Email cannot be changed</p>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Bio</FieldLabel>
                <textarea
                  name="bio" value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell tutors a little about yourself…"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#ff5a00]/15 transition-all resize-none"
                />
              </div>
              <div>
                <FieldLabel>Primary Instrument</FieldLabel>
                <Select name="instrument" value={formData.instrument} onChange={handleInputChange}>
                  {["Guitar","Piano","Drums","Violin","Flute","Bass","Saxophone","Cello","Ukulele"].map(i => <option key={i}>{i}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <Select name="timezone" value={formData.timezone} onChange={handleInputChange}>
                  {["Asia/Kathmandu","UTC","America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Tokyo","Australia/Sydney"].map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
            </div>

            {/* Secondary instruments */}
            <div>
              <FieldLabel>Secondary Instruments</FieldLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {secondaryInstruments.map(inst => (
                  <span key={inst} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300">
                    {inst}
                    <button onClick={() => removeSecondary(inst)} className="text-slate-500 hover:text-red-400 transition-colors">
                      <X size={13} />
                    </button>
                  </span>
                ))}
                <button onClick={addSecondary} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff5a00]/10 border border-[#ff5a00]/30 rounded-full text-sm text-[#ff5a00] hover:bg-[#ff5a00]/20 transition-all">
                  <Plus size={13} /> Add
                </button>
              </div>
            </div>

            <SaveButton gradient="from-[#ff5a00] to-orange-600">Save Account</SaveButton>
          </div>
        )}

        {/* ── MUSIC ── */}
        {activeTab === "music" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-[#ff5a00] to-orange-500" title="Music & Practice" />

            {/* Practice Goals */}
            <Card>
              <CardTitle icon={Target}>Practice Goals</CardTitle>
              <div className="space-y-6">
                <RangeSlider label="Daily Practice Target" value={practiceGoal} min={5} max={120} unit=" min" onChange={setPracticeGoal} />
                <RangeSlider label="Weekly Practice Days" value={weeklyDays} min={1} max={7} unit=" days" onChange={setWeeklyDays} />
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-sm font-semibold text-white">Streak Reminder</p>
                    <p className="text-xs text-slate-500">Remind me to practice before my streak breaks</p>
                  </div>
                  <Toggle enabled={streakReminder} onToggle={() => setStreakReminder(p => !p)} />
                </div>
              </div>
            </Card>

            {/* Practice Schedule */}
            <Card>
              <CardTitle icon={Clock}>Practice Schedule & Reminders</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Daily Reminder Time</FieldLabel>
                  <Input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} />
                </div>
                <div>
                  <FieldLabel>Preferred Practice Days</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                      <button
                        key={d}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                          border-white/10 text-slate-500 hover:border-[#ff5a00]/50 hover:text-[#ff5a00]"
                      >{d}</button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Lesson Preferences */}
            <Card>
              <CardTitle icon={BookOpen}>Lesson Preferences</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <FieldLabel>Lesson Length</FieldLabel>
                  <Select value={lessonLength} onChange={e => setLessonLength(e.target.value)}>
                    {["15","30","45","60","90"].map(v => <option key={v} value={v}>{v} min</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Difficulty Level</FieldLabel>
                  <Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    {["Beginner","Intermediate","Advanced","Expert"].map(v => <option key={v}>{v}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Genre / Style</FieldLabel>
                  <Select value={learningStyle} onChange={e => setLearningStyle(e.target.value)}>
                    {["Classical","Jazz","Pop","Rock","Blues","Folk","Electronic","R&B"].map(v => <option key={v}>{v}</option>)}
                  </Select>
                </div>
              </div>
              <div className="mt-5">
                <FieldLabel>Learning Path Focus</FieldLabel>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  {["Technique","Theory","Improvisation","Ear Training","Composition","Performance"].map(p => (
                    <button key={p} className="p-3 text-sm rounded-xl border border-white/10 hover:border-[#ff5a00]/40 hover:bg-[#ff5a00]/5 text-slate-400 hover:text-white transition-all">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <SaveButton gradient="from-[#ff5a00] to-orange-600">Save Music Settings</SaveButton>
          </div>
        )}

        {/* ── AUDIO ── */}
        {activeTab === "audio" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-violet-500 to-purple-600" title="Audio & Device Settings" />

            {/* Mic */}
            <Card>
              <CardTitle icon={Mic}>Microphone Input</CardTitle>
              <div className="space-y-5">
                <div>
                  <FieldLabel>Input Device</FieldLabel>
                  <Select value={micDevice} onChange={e => setMicDevice(e.target.value)}>
                    <option value="default">System Default Microphone</option>
                    <option value="builtin">Built-in Microphone</option>
                    <option value="usb">USB Audio Interface</option>
                    <option value="bluetooth">Bluetooth Headset</option>
                  </Select>
                </div>
                <RangeSlider label="Input Sensitivity" value={micSensitivity} min={0} max={100} unit="%" onChange={setMicSensitivity} />
                <RangeSlider label="Input Gain" value={inputGain} min={0} max={100} unit="%" onChange={setInputGain} />
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 text-sm font-medium transition-all">
                  <Zap size={15} /> Test Microphone
                </button>
              </div>
            </Card>

            {/* Tuner & Metronome */}
            <Card>
              <CardTitle icon={Sliders}>Tuner Settings</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <FieldLabel>Reference Pitch (A4)</FieldLabel>
                    <span className="text-sm text-[#ff5a00] font-mono">{tuningA4} Hz</span>
                  </div>
                  <input type="range" min={430} max={450} value={tuningA4} onChange={e => setTuningA4(Number(e.target.value))}
                    className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-600">430 Hz</span>
                    <span className="text-xs text-slate-600">450 Hz</span>
                  </div>
                </div>
                <div>
                  <FieldLabel>Temperament</FieldLabel>
                  <Select value={temperament} onChange={e => setTemperament(e.target.value)}>
                    {["Equal","Just","Pythagorean","Meantone","Kirnberger III"].map(v => <option key={v}>{v}</option>)}
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mt-4">
                <div>
                  <p className="text-sm font-semibold text-white">Visual Tuning Cue</p>
                  <p className="text-xs text-slate-500">Show animated needle alongside pitch detection</p>
                </div>
                <Toggle enabled={visualCue} onToggle={() => setVisualCue(p => !p)} />
              </div>
            </Card>

            <Card>
              <CardTitle icon={Volume2}>Metronome Settings</CardTitle>
              <div className="space-y-5">
                <RangeSlider label="Default BPM" value={metronomeBPM} min={40} max={240} unit=" bpm" onChange={setMetronomeBPM} />
                <RangeSlider label="Volume" value={metronomeVolume} min={0} max={100} unit="%" onChange={setMetronomeVolume} />
                <div>
                  <FieldLabel>Beat Subdivision</FieldLabel>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {["Whole","Half","Quarter","Eighth","Sixteenth","Triplet"].map(b => (
                      <button key={b} onClick={() => setBeatSubdivision(b)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${beatSubdivision === b ? "bg-[#ff5a00]/10 border-[#ff5a00]/50 text-[#ff5a00]" : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <SaveButton gradient="from-violet-500 to-purple-600">Save Audio Settings</SaveButton>
          </div>
        )}

        {/* ── TUTOR ── */}
        {activeTab === "tutor" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-teal-500 to-emerald-500" title="Tutor & Lesson Matching" />

            <Card>
              <CardTitle icon={Globe}>Language & Communication</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Preferred Language</FieldLabel>
                  <Select value={tutorLanguage} onChange={e => setTutorLanguage(e.target.value)}>
                    {["English","Spanish","French","German","Japanese","Mandarin","Hindi","Portuguese","Nepali"].map(l => <option key={l}>{l}</option>)}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Price Range</FieldLabel>
                  <Select value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                    {["Under $15/hr","$15–$30/hr","$20–$60/hr","$50–$100/hr","$100+/hr","No preference"].map(p => <option key={p}>{p}</option>)}
                  </Select>
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle icon={Calendar}>Availability</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Weekday Mornings","Weekday Afternoons","Evenings","Weekdays","Weekends","Saturday","Sunday","Any time"].map(slot => (
                  <button key={slot} onClick={() => toggleAvailability(slot)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      availability.includes(slot)
                        ? "bg-teal-500/10 border-teal-500/50 text-teal-400"
                        : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20"
                    }`}>
                    {slot}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle icon={Zap}>Quality Preferences</CardTitle>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <FieldLabel>Minimum Tutor Rating</FieldLabel>
                    <span className="text-sm text-[#ff5a00] font-mono">{"★".repeat(tutorMinRating)} ({tutorMinRating}.0+)</span>
                  </div>
                  <input type="range" min={1} max={5} value={tutorMinRating} onChange={e => setTutorMinRating(Number(e.target.value))}
                    className="w-full accent-[#ff5a00]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Trial lessons first", "Start with a 15-min trial before committing"],
                    ["Verified tutors only", "Only show tutors with verified credentials"],
                    ["Video lessons preferred", "Prioritize tutors with HD video setups"],
                    ["Native speaker only", "Lessons in your native language"],
                  ].map(([title, desc]) => (
                    <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <input type="checkbox" className="mt-0.5 accent-[#ff5a00]" />
                      <div>
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <SaveButton gradient="from-teal-500 to-emerald-500">Save Tutor Preferences</SaveButton>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-orange-500 to-red-500" title="Notification Settings" />

            <Card>
              <CardTitle icon={Bell}>Notification Types</CardTitle>
              <div className="space-y-2.5">
                <ToggleRow title="Lesson Reminders" desc="Get notified before upcoming lessons" icon={Clock} iconColor="bg-orange-500/20" enabled={notifs.lessonReminders} onToggle={() => toggleNotif("lessonReminders")} />
                <ToggleRow title="Achievements" desc="Celebrate when you unlock badges and milestones" icon={Zap} iconColor="bg-yellow-500/20" enabled={notifs.achievements} onToggle={() => toggleNotif("achievements")} />
                <ToggleRow title="Messages" desc="Replies and messages from your tutors" icon={Mail} iconColor="bg-blue-500/20" enabled={notifs.messages} onToggle={() => toggleNotif("messages")} />
                <ToggleRow title="Weekly Progress Report" desc="A summary of practice time and progress" icon={FileText} iconColor="bg-purple-500/20" enabled={notifs.weeklyReport} onToggle={() => toggleNotif("weeklyReport")} />
                <ToggleRow title="Practice Streak Alerts" desc="Reminders to keep your streak alive" icon={Target} iconColor="bg-red-500/20" enabled={notifs.practiceStreak} onToggle={() => toggleNotif("practiceStreak")} />
                <ToggleRow title="New Tutor Matches" desc="When new tutors matching your preferences join" icon={User} iconColor="bg-teal-500/20" enabled={notifs.newTutors} onToggle={() => toggleNotif("newTutors")} />
                <ToggleRow title="Promotions & Offers" desc="Discounts and platform news" icon={Globe} iconColor="bg-slate-500/20" enabled={notifs.promotions} onToggle={() => toggleNotif("promotions")} />
              </div>
            </Card>

            <Card>
              <CardTitle icon={Smartphone}>Delivery Channels</CardTitle>
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["email",  "Email",    Mail,        "Send to " + (session?.user?.email || "your email")],
                  ["inApp",  "In-App",   Bell,        "Notifications inside Virtuoso"],
                  ["push",   "Push",     Smartphone,  "Mobile / browser push notifications"],
                  ["sms",    "SMS",      Wifi,        "Text messages to your phone"],
                ] as const).map(([key, label, Icon, desc]) => (
                  <div key={key} className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notifChannels[key] ? "border-[#ff5a00]/40 bg-[#ff5a00]/5" : "border-white/[0.06] bg-white/[0.02]"
                  }`} onClick={() => toggleChannel(key)}>
                    <div className="flex items-center justify-between mb-2">
                      <Icon size={16} className={notifChannels[key] ? "text-[#ff5a00]" : "text-slate-500"} />
                      <Toggle enabled={notifChannels[key]} onToggle={() => toggleChannel(key)} />
                    </div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            <SaveButton gradient="from-orange-500 to-red-500">Save Notifications</SaveButton>
          </div>
        )}

        {/* ── PRIVACY ── */}
        {activeTab === "privacy" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-pink-500 to-rose-600" title="Privacy & Sharing" />

            <Card>
              <CardTitle icon={Eye}>Profile Visibility</CardTitle>
              <div className="space-y-2.5">
                <ToggleRow title="Public Profile" desc="Allow other students and tutors to view your profile" icon={Globe} iconColor="bg-blue-500/20" enabled={privacy.publicProfile} onToggle={() => togglePrivacy("publicProfile")} />
                <ToggleRow title="Share Practice Results" desc="Let tutors see your practice activity and progress" icon={Music} iconColor="bg-pink-500/20" enabled={privacy.sharePractice} onToggle={() => togglePrivacy("sharePractice")} />
                <ToggleRow title="Research Consent" desc="Allow anonymised data to improve Virtuoso's AI features" icon={Zap} iconColor="bg-purple-500/20" enabled={privacy.researchConsent} onToggle={() => togglePrivacy("researchConsent")} />
              </div>
            </Card>

            {/* Accessibility */}
            <Card>
              <CardTitle icon={Palette}>Accessibility & Playback</CardTitle>
              <div className="space-y-2.5 mb-5">
                <ToggleRow title="Closed Captions" desc="Show captions on lesson videos" icon={FileText} iconColor="bg-blue-500/20" enabled={accessibility.captions} onToggle={() => toggleAccessibility("captions")} />
                <ToggleRow title="Reduced Motion" desc="Minimise animations throughout the app" icon={Zap} iconColor="bg-slate-500/20" enabled={accessibility.reducedMotion} onToggle={() => toggleAccessibility("reducedMotion")} />
                <ToggleRow title="High Contrast Mode" desc="Increase colour contrast for readability" icon={Eye} iconColor="bg-yellow-500/20" enabled={accessibility.highContrast} onToggle={() => toggleAccessibility("highContrast")} />
              </div>
              <div>
                <FieldLabel>Font Size</FieldLabel>
                <div className="flex gap-2 mt-1">
                  {["Small","Medium","Large","X-Large"].map(s => (
                    <button key={s} onClick={() => setFontSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm border transition-all ${fontSize === s ? "bg-pink-500/10 border-pink-500/50 text-pink-400" : "border-white/10 text-slate-400 hover:border-white/20"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Data */}
            <Card>
              <CardTitle icon={Download}>Your Data</CardTitle>
              <div className="space-y-3">
                {[
                  { icon: Download, label: "Export Progress (CSV)", color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10" },
                  { icon: FileText, label: "Export Progress (JSON)", color: "text-blue-400 border-blue-500/30 hover:bg-blue-500/10" },
                  { icon: Headphones, label: "Export Lesson Recordings", color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10" },
                ].map(({ icon: Icon, label, color }) => (
                  <button key={label} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-white/[0.02] ${color} text-sm font-medium transition-all`}>
                    <span className="flex items-center gap-2"><Icon size={15} />{label}</span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            </Card>

            <SaveButton gradient="from-pink-500 to-rose-600">Save Privacy Settings</SaveButton>
          </div>
        )}

        {/* ── INTEGRATIONS ── */}
        {activeTab === "integrations" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-indigo-500 to-blue-600" title="Integrations & Exports" />

            <Card>
              <CardTitle icon={Calendar}>Calendar Sync</CardTitle>
              <div className="space-y-3">
                {([
                  ["googleCalendar", "Google Calendar", "Sync lessons and reminders to Google Calendar"],
                  ["outlookCalendar", "Outlook / Office 365", "Sync lessons to your Microsoft calendar"],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {integrations[key] && <span className="text-xs text-emerald-400 font-medium">Connected</span>}
                      <Toggle enabled={integrations[key]} onToggle={() => toggleIntegration(key)} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle icon={MonitorSmartphone}>Cloud Storage & DAW</CardTitle>
              <div className="space-y-3">
                {([
                  ["googleDrive", "Google Drive", "Auto-save lesson recordings to your Drive"],
                  ["dropbox",     "Dropbox",       "Sync recorded sessions to Dropbox"],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {integrations[key] && <span className="text-xs text-emerald-400 font-medium">Connected</span>}
                      <Toggle enabled={integrations[key]} onToggle={() => toggleIntegration(key)} />
                    </div>
                  </div>
                ))}
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center">
                  <p className="text-sm text-slate-500">More integrations (Ableton, Logic, GarageBand) coming soon</p>
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle icon={Download}>Progress Exports</CardTitle>
              <p className="text-sm text-slate-500 mb-4">Download your full learning history in various formats.</p>
              <div className="grid grid-cols-2 gap-3">
                {["CSV Export","JSON Export","PDF Report","MIDI Recordings"].map(f => (
                  <button key={f} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-sm text-slate-300 hover:border-indigo-500/40 hover:text-white hover:bg-indigo-500/5 transition-all">
                    <Download size={14} />{f}
                  </button>
                ))}
              </div>
            </Card>

            <SaveButton gradient="from-indigo-500 to-blue-600">Save Integrations</SaveButton>
          </div>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "security" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-green-500 to-emerald-500" title="Security Settings" />

            {/* Two-factor */}
            <Card className="bg-gradient-to-br from-green-500/8 to-emerald-500/8 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white flex items-center gap-2"><Shield size={16} className="text-green-400" />Two-Factor Authentication</p>
                  <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account</p>
                  {twoFactor && <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">● Enabled</span>}
                </div>
                <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(p => !p)} />
              </div>
            </Card>

            {/* Change Password */}
            <Card>
              <CardTitle icon={Lock}>Change Password</CardTitle>
              <div className="space-y-3 max-w-md">
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
                <Input type="password" placeholder="Confirm New Password" />
                <button className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-[1.02]">
                  Update Password
                </button>
              </div>
            </Card>

            {/* Connected accounts */}
            <Card>
              <CardTitle icon={Key}>Connected Accounts</CardTitle>
              <div className="space-y-2.5">
                {[
                  { provider: "Google", email: session?.user?.email, connected: true },
                  { provider: "GitHub", email: null, connected: false },
                  { provider: "Apple", email: null, connected: false },
                ].map(({ provider, email, connected }) => (
                  <div key={provider} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white">{provider}</p>
                      {email && <p className="text-xs text-slate-500 mt-0.5">{email}</p>}
                    </div>
                    <button className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      connected
                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    }`}>
                      {connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active sessions */}
            <Card>
              <CardTitle icon={MonitorSmartphone}>Active Sessions</CardTitle>
              <div className="space-y-2.5">
                {activeSessions.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        {s.device}
                        {s.current && <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button className="px-3 py-1.5 text-xs font-medium border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Danger zone */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-white/[0.02] hover:bg-emerald-500/8 border border-white/[0.06] hover:border-emerald-500/30 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Download size={16} className="text-emerald-400" /></div>
                  <span className="text-white text-sm font-semibold">Download Your Data</span>
                </div>
                <ChevronRight size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Trash2 size={16} className="text-red-400" /></div>
                  <div>
                    <span className="text-red-400 text-sm font-semibold">Delete Account</span>
                    <p className="text-xs text-slate-600">This action is permanent and cannot be undone</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-red-500 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}