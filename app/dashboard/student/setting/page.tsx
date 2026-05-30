/* eslint-disable react-hooks/static-components */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import {
  Lock, User, ChevronRight, Upload, Mail, Shield, Globe, Download, Music,
  Mic, Eye, Calendar, Volume2, Sliders, ChevronDown, Plus, X, CheckCircle,
  AlertCircle, Trash2
} from "lucide-react";
import DashboardShell from "../../../components/DashboardShell";
import { toast, Toaster } from "react-hot-toast";

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

function Toggle({ enabled, onToggle, disabled = false }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${enabled ? "bg-[#ff5a00]" : "bg-white/10"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

function SaveButton({ gradient, children, onClick, isLoading = false }: { gradient: string; children: React.ReactNode; onClick?: () => void; isLoading?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`px-8 py-3 bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? "Saving..." : children}
    </button>
  );
}

const apiService = {
  async saveSettings(endpoint: string, data: any) {
    const response = await fetch(`/api/settings/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save settings');
    return response.json();
  },

  async fetchSettings(endpoint: string) {
    const response = await fetch(`/api/settings/${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/settings/avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to upload avatar');
    }

    return response.json();
  },

  async savePassword(currentPassword: string, newPassword: string) {
    const response = await fetch('/api/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to update password');
    }

    return response.json();
  },

  async deleteAccount(password: string) {
    const response = await fetch('/api/settings/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || 'Failed to delete account');
    }

    return response.json();
  },
};

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(session?.user?.image || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    instrument: "Guitar",
    timezone: "Asia/Kathmandu",
    avatarUrl: "",
  });
  const [secondaryInstruments, setSecondaryInstruments] = useState<string[]>(["Piano"]);

  const [micSensitivity, setMicSensitivity] = useState(75);
  const [inputGain, setInputGain] = useState(60);
  const [micDevice, setMicDevice] = useState("default");
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [tuningA4, setTuningA4] = useState(440);
  const [temperament, setTemperament] = useState("Equal");
  const [metronomeBPM, setMetronomeBPM] = useState(120);
  const [metronomeVolume, setMetronomeVolume] = useState(80);
  const [beatSubdivision, setBeatSubdivision] = useState("Quarter");
  const [visualCue, setVisualCue] = useState(true);

  
  const [accessibility, setAccessibility] = useState({
    captions: false,
    reducedMotion: false,
    highContrast: false,
  });
  const [fontSize, setFontSize] = useState("Medium");

  const [activeSessions, setActiveSessions] = useState([
    { id: "1", device: "Chrome · Windows", location: "Kathmandu, NP", time: "Now", current: true },
    { id: "2", device: "Safari · iPhone 15", location: "Kathmandu, NP", time: "2 days ago", current: false },
  ]);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (status === 'authenticated') {
      loadAllSettings();
    }
  }, [status]);

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session?.user?.image]);

  useEffect(() => {
    if (activeTab === 'security') {
      setPasswordData({ current: '', new: '', confirm: '' });
    }
  }, [activeTab]);

  const loadAllSettings = async () => {
    try {
      const endpoints = ['account', 'audio', 'security'];
      const results = await Promise.allSettled(
        endpoints.map(endpoint => apiService.fetchSettings(endpoint))
      );

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          switch (endpoints[index]) {
            case 'account':
              setFormData(prev => ({ ...prev, ...data }));
              if (data.secondaryInstruments) setSecondaryInstruments(data.secondaryInstruments);
              if (data.avatarUrl) {
                setAvatarUrl(data.avatarUrl);
                setFormData(prev => ({ ...prev, avatarUrl: data.avatarUrl }));
              }
              break;
            case 'audio':
              setMicSensitivity(data.micSensitivity || 75);
              setInputGain(data.inputGain || 60);
              setMicDevice(data.micDevice || "default");
              setTuningA4(data.tuningA4 || 440);
              setTemperament(data.temperament || "Equal");
              setMetronomeBPM(data.metronomeBPM || 120);
              setMetronomeVolume(data.metronomeVolume || 80);
              setBeatSubdivision(data.beatSubdivision || "Quarter");
              setVisualCue(data.visualCue ?? true);
              break;
            case 'security':
              break;
          }
        }
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAccessibility = (key: keyof typeof accessibility) => setAccessibility(p => ({ ...p, [key]: !p[key] }));
  const removeSecondary = (inst: string) => setSecondaryInstruments(prev => prev.filter(i => i !== inst));
  const addSecondary = () => {
    const opts = ["Violin", "Bass", "Drums", "Saxophone", "Flute", "Ukulele", "Cello"];
    const available = opts.find(o => !secondaryInstruments.includes(o) && o !== formData.instrument);
    if (available) setSecondaryInstruments(prev => [...prev, available]);
    else toast.error("No more instruments available to add");
  };

  const testMicrophone = async () => {
    setIsTestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      toast.success("Microphone is working! Check your levels.");
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      }, 3000);
    } catch (error) {
      toast.error("Unable to access microphone. Please check permissions.");
    } finally {
      setIsTestingMic(false);
    }
  };

  const saveSettings = async (section: string, data: any) => {
    setIsLoading(true);
    try {
      await apiService.saveSettings(section, data);
      await update?.();
      await loadAllSettings();
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
      return true;
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await apiService.savePassword(passwordData.current, passwordData.new);
      toast.success("Password updated successfully");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error((error as Error).message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
    toast.success("Session revoked successfully");
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const data = await apiService.uploadAvatar(file);
      const newAvatarUrl = data.avatarUrl || '';
      setAvatarUrl(newAvatarUrl);
      setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
      toast.success('Avatar updated successfully');
      await update?.();
      await loadAllSettings();
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await apiService.deleteAccount(deletePassword);
      
      toast.success("Account deleted successfully. Redirecting...");
      
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 1500);
      
    } catch (error) {
      console.error('Account deletion failed:', error);
      setDeleteError((error as Error).message || "Failed to delete account. Please check your password and try again.");
      setIsDeleting(false);
    }
  };

  return (
    <DashboardShell eyebrow="Dashboard" title="Settings">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff' } }} />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff5a00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Customize your learning experience and account preferences</p>
      </div>

      <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        {[
          { id: "account", label: "Account", icon: User, color: "from-blue-500 to-cyan-500" },
          { id: "audio", label: "Audio", icon: Mic, color: "from-violet-500 to-purple-600" },
          { id: "security", label: "Security", icon: Shield, color: "from-green-500 to-emerald-500" },
        ].map(({ id, label, icon: Icon, color }) => (
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

      <div className="bg-[#111] border border-white/[0.08] rounded-3xl p-8 md:p-12 shadow-2xl">
        {activeTab === "account" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-blue-500 to-cyan-500" title="Account Settings" />
            <Card className="bg-gradient-to-br from-blue-500/8 to-cyan-500/8 border-blue-500/20">
              <div className="flex items-start gap-8 flex-wrap">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#ff5a00] to-orange-600 flex items-center justify-center border-4 border-white/10 shadow-xl overflow-hidden">
                    {avatarUrl || session?.user?.image ? (
                      <Image src={avatarUrl || session?.user?.image || ""} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-white">{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2.5 bg-[#ff5a00] hover:bg-[#ff6b1a] rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
                    disabled={avatarUploading}
                  >
                    <Upload size={14} className="text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={avatarUploading}
                    onChange={handleAvatarChange}
                  />
                  {avatarUploading && <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div></div>}
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
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell tutors a little about yourself…"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#ff5a00]/60 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#ff5a00]/15 transition-all resize-none"
                />
              </div>
              <div>
                <FieldLabel>Primary Instrument</FieldLabel>
                <Select name="instrument" value={formData.instrument} onChange={handleInputChange}>
                  {[
                    "Guitar","Piano","Drums","Violin","Flute","Bass","Saxophone","Cello","Ukulele"
                  ].map(i => <option key={i}>{i}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel>Timezone</FieldLabel>
                <Select name="timezone" value={formData.timezone} onChange={handleInputChange}>
                  {[
                    "Asia/Kathmandu","UTC","America/New_York","America/Los_Angeles","Europe/London","Europe/Berlin","Asia/Tokyo","Australia/Sydney"
                  ].map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
            </div>

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

            <SaveButton
              gradient="from-[#ff5a00] to-orange-600"
              onClick={() => saveSettings('account', { ...formData, secondaryInstruments, avatarUrl })}
              isLoading={isLoading || avatarUploading}
            >
              {avatarUploading ? 'Uploading avatar...' : 'Save Account'}
            </SaveButton>
          </div>
        )}

        {activeTab === "audio" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-violet-500 to-purple-600" title="Audio & Device Settings" />
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
                <div>
                  <FieldLabel>Input Sensitivity</FieldLabel>
                  <input type="range" min={0} max={100} value={micSensitivity} onChange={e => setMicSensitivity(Number(e.target.value))} className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1 text-xs text-slate-600"><span>0%</span><span>100%</span></div>
                </div>
                <div>
                  <FieldLabel>Input Gain</FieldLabel>
                  <input type="range" min={0} max={100} value={inputGain} onChange={e => setInputGain(Number(e.target.value))} className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1 text-xs text-slate-600"><span>0%</span><span>100%</span></div>
                </div>
                <button
                  onClick={testMicrophone}
                  disabled={isTestingMic}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 text-sm font-medium transition-all disabled:opacity-50"
                >
                  {isTestingMic ? "Testing..." : "Test Microphone"}
                </button>
              </div>
            </Card>

            <Card>
              <CardTitle icon={Sliders}>Tuner Settings</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <FieldLabel>Reference Pitch (A4)</FieldLabel>
                    <span className="text-sm text-[#ff5a00] font-mono">{tuningA4} Hz</span>
                  </div>
                  <input type="range" min={430} max={450} value={tuningA4} onChange={e => setTuningA4(Number(e.target.value))} className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1 text-xs text-slate-600"><span>430 Hz</span><span>450 Hz</span></div>
                </div>
                <div>
                  <FieldLabel>Temperament</FieldLabel>
                  <Select value={temperament} onChange={e => setTemperament(e.target.value)}>
                    {['Equal','Just','Pythagorean','Meantone','Kirnberger III'].map(v => <option key={v}>{v}</option>)}
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
                <div>
                  <FieldLabel>Default BPM</FieldLabel>
                  <input type="range" min={40} max={240} value={metronomeBPM} onChange={e => setMetronomeBPM(Number(e.target.value))} className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1 text-xs text-slate-600"><span>40</span><span>240</span></div>
                </div>
                <div>
                  <FieldLabel>Volume</FieldLabel>
                  <input type="range" min={0} max={100} value={metronomeVolume} onChange={e => setMetronomeVolume(Number(e.target.value))} className="w-full accent-[#ff5a00]" />
                  <div className="flex justify-between mt-1 text-xs text-slate-600"><span>0%</span><span>100%</span></div>
                </div>
                <div>
                  <FieldLabel>Beat Subdivision</FieldLabel>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {['Whole','Half','Quarter','Eighth','Sixteenth','Triplet'].map(b => (
                      <button key={b} onClick={() => setBeatSubdivision(b)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${beatSubdivision === b ? "bg-[#ff5a00]/10 border-[#ff5a00]/50 text-[#ff5a00]" : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20"}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <SaveButton
              gradient="from-violet-500 to-purple-600"
              onClick={() => saveSettings('audio', { micSensitivity, inputGain, micDevice, tuningA4, temperament, metronomeBPM, metronomeVolume, beatSubdivision, visualCue })}
              isLoading={isLoading}
            >
              Save Audio Settings
            </SaveButton>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8">
            <SectionHeader gradient="from-green-500 to-emerald-500" title="Security Settings" />
            
            <Card>
              <CardTitle icon={Lock}>Change Password</CardTitle>
              <div className="space-y-3 max-w-md">
                <Input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={e => setPasswordData(p => ({ ...p, current: e.target.value }))}
                />
                <Input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="New Password"
                  value={passwordData.new}
                  onChange={e => setPasswordData(p => ({ ...p, new: e.target.value }))}
                />
                <Input
                  type="password"
                  name="confirmNewPassword"
                  autoComplete="new-password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirm}
                  onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))}
                />
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </Card>

            {/* <Card>
              <CardTitle icon={Download}>Active Sessions</CardTitle>
              <div className="space-y-2.5">
                {activeSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white flex items-center gap-2">
                        {s.device}
                        {s.current && <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.location} · {s.time}</p>
                    </div>
                    {!s.current && (
                      <button
                        onClick={() => handleRevokeSession(s.id)}
                        className="px-3 py-1.5 text-xs font-medium border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card> */}

            {/* Updated Delete Account Section */}
            <div className="space-y-3">
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-400 font-semibold text-base mb-1">Danger Zone</h4>
                    <p className="text-sm text-slate-400 mb-4">
                      Once you delete your account, there is no going back. All your data, 
                      progress, and associated information will be permanently removed.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 text-sm font-semibold rounded-xl transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Updated Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>
            
            <p className="text-slate-400 mb-4">
              This action cannot be undone. All your data, including:
            </p>
            
            <ul className="space-y-1 mb-4 text-sm text-slate-500">
              <li className="flex items-center gap-2">• Personal information and settings</li>
              <li className="flex items-center gap-2">• Lesson progress and achievements</li>
              <li className="flex items-center gap-2">• Booking history and messages</li>
              <li className="flex items-center gap-2">• Uploaded audio files and feedback</li>
            </ul>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
              <p className="text-yellow-400 text-xs">
                ⚠️ Warning: This action is permanent and irreversible. All your data will be lost.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Enter your password to confirm
              </label>
              <Input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  setDeleteError("");
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleDeleteAccount()}
                autoFocus
              />
              {deleteError && (
                <p className="text-red-400 text-xs mt-2">{deleteError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || !deletePassword}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-500/20"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </span>
                ) : (
                  "Permanently Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}