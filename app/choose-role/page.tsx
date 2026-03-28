"use client";


import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Disc, BookOpen, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

const roles = [
  {
    key: 'student',
    title: "Student",
    description: 'Learn instruments, take courses, and improve your skills.',
    button: 'Start Learning',
    icon: BookOpen,
  },
  {
    key: 'teacher',
    title: "Teacher",
    description: 'Teach lessons, create courses, and share your expertise.',
    button: 'Start Teaching',
    icon: Users,
  },
];

export default function ChooseRolePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (!session) {
    return null;
  }


  const handleRoleSelect = async (role: string) => {
    if (!session?.user?.email) {
      alert("You must be logged in to select a role.");
      return;
    }
    setIsLoading(true);
    try {
      await fetch('/api/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email: session.user.email }),
      });
      if (role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop" 
          alt="Music Studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Simple Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <Disc size={24} className="text-white" strokeWidth={1.5} />
            <span className="text-xl font-semibold text-white">Virtuoso</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome
          </h1>
          <p className="text-white/70 text-lg">
            Choose how you'd like to get started
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.key}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all"
              >
                <Icon size={32} className="text-white mb-4" strokeWidth={1.5} />
                <h2 className="text-xl font-semibold text-white mb-2">
                  {role.title}
                </h2>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {role.description}
                </p>
                <button
                  onClick={() => handleRoleSelect(role.key)}
                  disabled={isLoading}
                  className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Loading...' : role.button}
                </button>
              </div>
            );
          })}
        </div>

        {/* Skip Link */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-white/60 text-sm hover:text-white transition-colors"
          >
            Not sure? Skip for now →
          </button>
        </div>
      </main>
    </div>
  );
}