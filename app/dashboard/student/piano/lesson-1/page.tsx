"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProgressRecord {
  lessonId?: string;
  completed?: boolean;
}

export default function PianoLesson1() {
  const { data: session, status } = useSession();

  const [progressPercent, setProgressPercent] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");
  const [quizPassed, setQuizPassed] = useState(false);

  // 🎧 Play sound
  const playNote = (note: string) => {
    const audio = new Audio(`/sounds/${note}.mp3`);
    audio.play().catch(() => {
      // Ignore autoplay-related promise rejections
    });
  };

  const PianoKeys = () => {
    const keys = ["C", "D", "E", "F", "G", "A", "B"];

    return (
      <div className="flex justify-center gap-2 mt-6 flex-wrap">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => playNote(key)}
            className="w-14 h-32 bg-white text-black rounded shadow hover:bg-[#ff5a00] hover:text-white transition"
          >
            {key}
          </button>
        ))}
      </div>
    );
  };

  // 📊 Load progress
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/progress?userId=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data: ProgressRecord[]) => {
          const completed = Array.isArray(data)
            ? data.filter(
                (p: ProgressRecord) =>
                  p.completed &&
                  typeof p.lessonId === "string" &&
                  p.lessonId.startsWith("piano-")
              ).length
            : 0;

          setProgressPercent(Math.round((completed / 4) * 100));
        });
    }
  }, [status, session]);

  // ✅ Mark complete
  const markLessonComplete = async () => {
    if (status === "authenticated" && session?.user?.email) {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.email,
          lessonId: "piano-1",
          completed: true,
        }),
      });
    }
  };

  // 🧠 Quiz check
  const checkAnswer = () => {
    if (quizAnswer.trim().toLowerCase() === "c") {
      setQuizResult("✅ Correct! You found Middle C.");
      setQuizPassed(true);
    } else {
      setQuizResult("❌ Try again! Hint: It's before two black keys.");
    }
  };

  return (
    <div className="bg-[#0d0d0d] text-slate-300 min-h-screen">

      {/* Back */}
      <div className="fixed top-6 left-6">
        <Link href="/dashboard/student/piano" className="flex gap-2 text-slate-400 hover:text-white">
          <ArrowLeft /> Back
        </Link>
      </div>

      <main className="max-w-5xl mx-auto pt-24 px-6 pb-20">

        {/* Title */}
        <h1 className="text-4xl text-white mb-4 font-bold">
          🎹 Lesson 1: Piano Basics
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl">
          In this first lesson, you will learn how the keyboard is organized, how to find
          <span className="text-white font-semibold"> Middle C</span>, and how to start recognizing notes with confidence.
        </p>

        {/* Progress Bar */}
        <div className="mb-10">
          <p className="text-sm mb-2">
            Progress: <span className="text-[#ff5a00]">{progressPercent}%</span>
          </p>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="h-3 bg-[#ff5a00] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Pattern */}
        <section className="mb-10">
          <h2 className="text-2xl text-white mb-4">🔍 Key Pattern</h2>
          <div className="bg-white/5 p-6 rounded-xl text-center text-[#ff5a00] font-mono mb-4">
            2 BLACK KEYS → 3 BLACK KEYS → REPEAT
          </div>
          <p className="text-slate-400 leading-relaxed">
            The piano may look large, but it is actually built from a very simple visual pattern.
            Once you spot the groups of two and three black keys, it becomes much easier to find any note on the keyboard.
          </p>
        </section>

        {/* Middle C */}
        <section className="mb-10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">📍 Find Middle C</h2>
          <ul className="text-slate-400 space-y-2 mb-4">
            <li>👉 Find a group of 2 black keys</li>
            <li>👉 Move to the white key directly on the left</li>
            <li>👉 That note is C</li>
            <li>👉 The C nearest the center of the keyboard is called <strong className="text-white">Middle C</strong></li>
          </ul>
          <p className="text-slate-400 leading-relaxed">
            Middle C is one of the most important reference points for beginners because many simple melodies start there.
          </p>
        </section>

        {/* Musical Alphabet */}
        <section className="mb-10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">🎼 The Musical Alphabet</h2>
          <div className="text-center text-[#ff5a00] font-mono text-lg mb-4">
            C → D → E → F → G → A → B → C
          </div>
          <p className="text-slate-400 leading-relaxed">
            Music uses only seven letter names. After B, the pattern starts again at C in the next octave.
            This repeating cycle is what makes the keyboard predictable and easier to learn over time.
          </p>
        </section>

        {/* Posture */}
        <section className="mb-10 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">✋ Proper Piano Posture</h2>
          <ul className="text-slate-400 space-y-2">
            <li>• Sit up straight and relax your shoulders</li>
            <li>• Keep your elbows loose and wrists level</li>
            <li>• Curve your fingers naturally, like holding a small ball</li>
            <li>• Press the keys gently instead of hitting them</li>
          </ul>
        </section>

        {/* Piano Practice */}
        <section className="mb-12">
          <h2 className="text-xl text-white mb-4">🎹 Try Playing</h2>
          <p className="text-slate-400 mb-4">
            Click the notes below and listen carefully. Try saying each note name out loud as you play it.
          </p>
          <PianoKeys />
        </section>

        {/* Practice Checklist */}
        <section className="mb-12 bg-white/5 p-6 rounded-xl">
          <h2 className="text-xl text-white mb-4">📝 Practice Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4 text-slate-400">
            <div className="bg-black/30 rounded-lg p-4">Find every C on the keyboard.</div>
            <div className="bg-black/30 rounded-lg p-4">Say the musical alphabet from C to B.</div>
            <div className="bg-black/30 rounded-lg p-4">Play C, D, E, F, G slowly with one finger.</div>
            <div className="bg-black/30 rounded-lg p-4">Practice for 5 minutes with relaxed hands.</div>
          </div>
        </section>

        {/* Interactive Keyboard Visualization */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">🎹 Interactive Keyboard Explorer</h2>
          <p className="text-slate-400 mb-6">
            Click on the keyboard below to explore the pattern. Notice how the black keys create groups of 2 and 3 that repeat across the keyboard.
          </p>
          <div className="bg-black/50 p-6 rounded-xl border border-white/10">
            <div className="flex justify-center items-end gap-1 mb-4">
              {/* White keys */}
              {['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'].map((note, i) => (
                <button
                  key={`white-${i}`}
                  className="w-8 h-24 bg-white text-black rounded-b text-xs font-bold hover:bg-[#ff5a00] hover:text-white transition-colors"
                  onClick={() => playNote(note.toLowerCase())}
                >
                  {note}
                </button>
              ))}
            </div>
            <div className="flex justify-center items-end gap-1">
              {/* Black keys positioned over white keys */}
              <div className="w-4"></div>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('c#')}>C#</button>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('d#')}>D#</button>
              <div className="w-8"></div>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('f#')}>F#</button>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('g#')}>G#</button>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('a#')}>A#</button>
              <div className="w-8"></div>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('c#2')}>C#</button>
              <button className="w-6 h-16 bg-black text-white rounded-b text-xs hover:bg-[#ff5a00] transition-colors" onClick={() => playNote('d#2')}>D#</button>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-4 text-center">
            Click any key to hear its sound. Middle C is highlighted in the center.
          </p>
        </section>

        {/* Learning Methods */}
        <section className="mb-12 bg-white/5 p-6 rounded-xl">
          <h2 className="text-2xl text-white mb-4">🧠 Effective Learning Methods</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-2">Pattern Recognition</h3>
              <p className="text-slate-400 text-sm">
                Instead of memorizing every key, learn to recognize the repeating pattern of 2-3 black keys. This makes finding any note intuitive.
              </p>
            </div>
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-2">Landmark Notes</h3>
              <p className="text-slate-400 text-sm">
                Use Middle C as your primary landmark. Once you find it, you can navigate to any other note by counting steps in the musical alphabet.
              </p>
            </div>
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-2">Physical Memory</h3>
              <p className="text-slate-400 text-sm">
                Your fingers will remember the keyboard layout through repetition. Start with just the white keys, then add black keys gradually.
              </p>
            </div>
            <div>
              <h3 className="text-lg text-[#ff5a00] mb-2">Visual Mapping</h3>
              <p className="text-slate-400 text-sm">
                Think of the keyboard as a map. The black keys are like landmarks that help you orient yourself on the white key highway.
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Theory */}
        <section className="mb-12">
          <h2 className="text-2xl text-white mb-4">🎼 Understanding Octaves</h2>
          <p className="text-slate-400 mb-4">
            An octave is the distance between two notes with the same name. Each octave represents a doubling of frequency.
          </p>
          <div className="bg-black/40 p-6 rounded-xl text-center">
            <div className="text-[#ff5a00] font-mono text-lg mb-2">C4 → C5 → C6</div>
            <p className="text-slate-400 text-sm">Middle C is C4. The next C up is C5 (higher octave), the next is C6.</p>
          </div>
        </section>

        {/* Quiz */}
        <section className="mb-12 bg-white/5 p-6 rounded-xl">
          <h2 className="text-xl text-white mb-4">🧠 Quiz</h2>

          <p className="mb-4">Which note comes before two black keys?</p>

          <input
            type="text"
            value={quizAnswer}
            onChange={(e) => setQuizAnswer(e.target.value)}
            className="px-4 py-2 bg-black border border-white/10 rounded mr-4"
          />

          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-[#ff5a00] rounded"
          >
            Check
          </button>

          {quizResult && <p className="mt-3">{quizResult}</p>}
        </section>

        {/* Next */}
        <div className="flex justify-end">
          <Link
            href={quizPassed ? "/dashboard/student/piano/lesson-2" : "#"}
            onClick={(e) => {
              if (!quizPassed) {
                e.preventDefault();
                alert("⚠️ Pass the quiz first!");
              } else {
                markLessonComplete();
              }
            }}
            className={`px-6 py-3 rounded-full ${
              quizPassed
                ? "bg-[#ff5a00] hover:bg-white hover:text-black"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Continue →
          </Link>
        </div>

      </main>
    </div>
  );
}