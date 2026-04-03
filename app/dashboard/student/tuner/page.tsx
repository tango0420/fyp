"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import StudentSidebar from "@/app/components/StudentSidebar";



const INSTRUMENT_TUNINGS: Record<string, { name: string; strings: Array<{ name: string; frequency: number }> }> = {
  guitar: {
    name: "Guitar",
    strings: [
      { name: "E2", frequency: 82.41 },
      { name: "A2", frequency: 110.0 },
      { name: "D3", frequency: 146.83 },
      { name: "G3", frequency: 196.0 },
      { name: "B3", frequency: 246.94 },
      { name: "E4", frequency: 329.63 },
    ],
  },
  violin: {
    name: "Violin",
    strings: [
      { name: "G3", frequency: 196.0 },
      { name: "D4", frequency: 293.66 },
      { name: "A4", frequency: 440.0 },
      { name: "E5", frequency: 659.25 },
    ],
  },
  ukulele: {
    name: "Ukulele",
    strings: [
      { name: "G4", frequency: 392.0 },
      { name: "C4", frequency: 261.63 },
      { name: "E4", frequency: 329.63 },
      { name: "A4", frequency: 440.0 },
    ],
  },
  bass: {
    name: "Bass",
    strings: [
      { name: "E1", frequency: 41.2 },
      { name: "A1", frequency: 55.0 },
      { name: "D2", frequency: 73.42 },
      { name: "G2", frequency: 98.0 },
    ],
  },
};

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function TunerPage() {
  useSession();

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);

  const [selectedInstrument, setSelectedInstrument] = useState("guitar");
  const [selectedString, setSelectedString] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [note, setNote] = useState("—");
  const [cents, setCents] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const [pulseRing, setPulseRing] = useState(false);

  const instrument = INSTRUMENT_TUNINGS[selectedInstrument];
  const targetFrequency = instrument.strings[selectedString].frequency;

  useEffect(() => {
    if (isListening && Math.abs(cents) <= 5 && frequency > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPulseRing(true);
      const t = setTimeout(() => setPulseRing(false), 700);
      return () => clearTimeout(t);
    }
  }, [cents, isListening, frequency]);

  const getNoteName = (freq: number): string => {
    const a4 = 440;
    const c0 = a4 * Math.pow(2, -4.75);
    const h = 12 * Math.log2(freq / c0);
    const n = h % 12;
    const noteIndex = Math.round(n + 12) % 12;
    return NOTES[noteIndex];
  };

  const calculateCents = (targetFreq: number, detectedFreq: number): number => {
    return Math.round(1200 * Math.log2(detectedFreq / targetFreq));
  };

  const startListening = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const dataArray = new Float32Array(analyser.frequencyBinCount);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      isListeningRef.current = true;
      setIsListening(true);

      const detectPitch = () => {
        analyser.getFloatFrequencyData(dataArray);

        let maxValue = -Infinity;
        let maxIndex = 0;

        for (let i = 5; i < dataArray.length; i++) {
          if (dataArray[i] > maxValue) {
            maxValue = dataArray[i];
            maxIndex = i;
          }
        }

        if (maxValue > -50) {
          const nyquist = audioContext.sampleRate / 2;
          const detectedFreq = (maxIndex * nyquist) / analyser.frequencyBinCount;

          if (detectedFreq > 30 && detectedFreq < 4000) {
            setFrequency(Math.round(detectedFreq * 100) / 100);
            setNote(getNoteName(detectedFreq));
            setCents(calculateCents(targetFrequency, detectedFreq));
          }
        }

        if (isListeningRef.current) {
          animFrameRef.current = requestAnimationFrame(detectPitch);
        }
      };

      detectPitch();
    } catch {
      setError("Microphone access denied. Please allow microphone access.");
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsListening(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    setFrequency(0);
    setNote("—");
    setCents(0);
  };

  const tuningStatus = (): "flat" | "in-tune" | "sharp" => {
    if (!isListening || frequency === 0) return "in-tune";
    if (Math.abs(cents) <= 5) return "in-tune";
    return cents < 0 ? "flat" : "sharp";
  };

  const status = tuningStatus();
  const needlePercent = 50 + Math.max(-50, Math.min(50, cents / 2));
  const statusColor = status === "in-tune" ? "#22c55e" : status === "flat" ? "#60a5fa" : "#f97316";
  const statusLabel = status === "in-tune" ? "In Tune" : status === "flat" ? "Too Flat ↑" : "Too Sharp ↓";

  return (
    <>
      <StudentSidebar />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #0b0b0e; }

        /* ── Sidebar Override ── */
        aside {
          padding-top: 29px !important;
          padding-bottom: 29px !important;
          gap: 24px !important;
        }

        aside > div {
          margin-bottom: 32px !important;
        }

        aside nav {
          gap: 41px !important;
        }

        .t-root {
          font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
          background: #0b0b0e;
          min-height: 100vh;
          color: #c9cdd4;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        /* ── Sidebar ── */
        /* Global sidebar is provided by the layout, no CSS needed here */

        /* ── Header ── */
        .t-header {
          position: fixed;
          top: 0; left: 80px; right: 0;
          height: 80px;
          background: #0b0b0e;
          border-bottom: 1px solid #13131a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          z-index: 40;
        }
        .t-breadcrumb {
          display: flex; align-items: center; gap: 16px;
          font-size: 16px; color: #2d2d38;
        }
        .t-breadcrumb span.current { color: #e2e4e9; font-weight: 600; font-size: 18px; }

        /* ── Main ── */
        .t-main {
          margin-left: 80px;
          margin-top: 80px;
          flex: 1;
          min-height: calc(100vh - 80px);
        }
        .t-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 52px 40px 60px;
        }

        /* ── Page heading ── */
        .t-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2d2d38;
          margin-bottom: 16px;
        }
        .t-heading {
          font-size: 42px;
          font-weight: 300;
          color: #eaedf2;
          letter-spacing: -0.025em;
          margin-bottom: 56px;
          line-height: 1.2;
        }

        /* ── Instrument Pills ── */
        .t-pills {
          display: flex; gap: 6px; flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .t-pill {
          padding: 5px 15px;
          border-radius: 100px;
          font-size: 12.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          border: 1px solid transparent;
          cursor: pointer;
          background: transparent;
          color: #3d3d50;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .t-pill:hover { color: #9ca3af; border-color: #1f1f2a; }
        .t-pill.active {
          background: #141418;
          color: #eaedf2;
          border-color: #22222e;
        }

        /* ── String Buttons ── */
        .t-strings {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .t-string {
          width: 62px; height: 62px;
          border-radius: 14px;
          border: 1px solid #13131a;
          background: #0e0e12;
          cursor: pointer;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 3px;
          transition: all 0.18s;
        }
        .t-string:hover { border-color: #1f1f2a; background: #111116; }
        .t-string.active { border-color: rgba(255,90,0,0.35); background: rgba(255,90,0,0.06); }
        .t-string .sn {
          font-family: 'DM Mono', monospace;
          font-size: 14px; font-weight: 500;
          color: #5a5a72;
          transition: color 0.18s;
        }
        .t-string.active .sn { color: #ff5a00; }
        .t-string .sf {
          font-family: 'DM Mono', monospace;
          font-size: 9px; color: #222230;
          transition: color 0.18s;
        }
        .t-string.active .sf { color: rgba(255,90,0,0.45); }

        /* ── Tuner Card ── */
        .t-card {
          background: #0e0e12;
          border: 1px solid #13131a;
          border-radius: 20px;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 44px;
          margin-bottom: 16px;
        }

        /* ── Orb ── */
        .t-orb-wrap {
          position: relative;
          width: 280px; height: 280px;
        }
        .t-orb-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid #1a1a24;
          transition: border-color 0.4s, box-shadow 0.4s;
          pointer-events: none;
        }
        .t-orb-ring.in-tune {
          border-color: rgba(34,197,94,0.4);
          box-shadow: 0 0 0 0 rgba(34,197,94,0);
        }
        .t-orb-ring.pulse-anim {
          animation: orbPulse 0.7s ease-out forwards;
        }
        @keyframes orbPulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.3); border-color: rgba(34,197,94,0.5); }
          60%  { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); border-color: #1a1a24; }
        }
        .t-orb {
          width: 280px; height: 280px;
          border-radius: 50%;
          background: #0b0b0e;
          border: 1px solid #16161e;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }
        .t-orb-glow {
          position: absolute; inset: 0; border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.5s;
        }
        .t-orb-note {
          font-family: 'DM Mono', monospace;
          font-size: 88px;
          font-weight: 300;
          line-height: 1;
          transition: color 0.3s;
          position: relative; z-index: 1;
          letter-spacing: -0.02em;
        }
        .t-orb-hz {
          font-family: 'DM Mono', monospace;
          font-size: 18px;
          color: #2d2d3e;
          letter-spacing: 0.06em;
          position: relative; z-index: 1;
          transition: color 0.3s;
        }
        .t-orb-status {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          position: relative; z-index: 1;
          transition: color 0.3s;
          margin-top: 4px;
        }

        /* ── Gauge ── */
        .t-gauge-wrap { width: 100%; max-width: 380px; }
        .t-gauge-track {
          position: relative;
          height: 2px;
          background: #141419;
          border-radius: 100px;
          margin-bottom: 14px;
        }
        .t-gauge-fill {
          position: absolute;
          top: 0; height: 100%;
          border-radius: 100px;
          transition: width 0.08s linear, left 0.08s linear, background 0.3s;
        }
        .t-gauge-needle {
          position: absolute;
          top: 50%; transform: translate(-50%, -50%);
          width: 9px; height: 9px;
          border-radius: 50%;
          transition: left 0.08s linear, background 0.3s, box-shadow 0.3s;
        }
        .t-gauge-tick {
          position: absolute;
          top: 50%; transform: translate(-50%, -50%);
          width: 1px;
          background: #1a1a22;
          border-radius: 1px;
        }
        .t-gauge-labels {
          display: flex; justify-content: space-between;
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.1em;
          color: #22222e;
        }
        .t-gauge-labels .cents-val {
          font-size: 11px;
          transition: color 0.3s;
        }

        /* ── Button ── */
        .t-btn {
          display: inline-flex; align-items: center; gap: 12px;
          padding: 16px 40px;
          border-radius: 100px;
          font-size: 16px; font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          border: none; outline: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .t-btn-start {
          background: #ff5a00;
          color: #fff;
        }
        .t-btn-start:hover {
          background: #ff6b1a;
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(255,90,0,0.25);
        }
        .t-btn-stop {
          background: #111116;
          color: #4b5563;
          border: 1px solid #1c1c26;
        }
        .t-btn-stop:hover { background: #141419; color: #9ca3af; }

        /* Live indicator */
        .t-live {
          display: flex; align-items: center; gap: 7px;
          font-family: 'DM Mono', monospace;
          font-size: 10px; color: #2d2d3e;
          letter-spacing: 0.1em;
        }
        .t-live-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #22c55e;
          animation: liveBlink 1.3s ease-in-out infinite;
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        /* Error */
        .t-error {
          font-size: 12px; color: #f87171;
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 10px;
          padding: 10px 18px;
        }

        /* ── Tips ── */
        .t-tips {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .t-tip {
          background: #0e0e12;
          border: 1px solid #13131a;
          border-radius: 14px;
          padding: 18px 20px;
        }
        .t-tip-title {
          font-size: 12px; font-weight: 500;
          color: #6b7280; margin-bottom: 5px;
        }
        .t-tip-desc {
          font-size: 11px; color: #22222e;
          line-height: 1.55;
        }
      `}</style>

      <div className="t-root">
        {/* Header */}
        <header className="t-header">
          <div className="t-breadcrumb">
            <span>Virtuoso</span>
            <span style={{ color: "#1a1a22" }}>/</span>
            <span className="current">Tuner</span>
          </div>
          <LogoutButton />
        </header>

        {/* Main */}
        <main className="t-main">
          <div className="t-content">

            <p className="t-eyebrow">Instrument Tuner</p>
            <h1 className="t-heading">Tune your instrument.</h1>

            {/* Instrument selector */}
            <div className="t-pills">
              {Object.entries(INSTRUMENT_TUNINGS).map(([key, val]) => (
                <button
                  key={key}
                  className={`t-pill${selectedInstrument === key ? " active" : ""}`}
                  onClick={() => { setSelectedInstrument(key); setSelectedString(0); }}
                >
                  {val.name}
                </button>
              ))}
            </div>

            {/* String selector */}
            <div className="t-strings">
              {instrument.strings.map((str, idx) => (
                <button
                  key={idx}
                  className={`t-string${selectedString === idx ? " active" : ""}`}
                  onClick={() => setSelectedString(idx)}
                >
                  <span className="sn">{str.name}</span>
                  <span className="sf">{str.frequency.toFixed(1)}</span>
                </button>
              ))}
            </div>

            {/* Tuner card */}
            <div className="t-card">

              {/* Orb */}
              <div className="t-orb-wrap">
                <div className={`t-orb-ring${status === "in-tune" && isListening && frequency > 0 ? " in-tune" : ""}${pulseRing ? " pulse-anim" : ""}`} />
                <div className="t-orb">
                  <div
                    className="t-orb-glow"
                    style={{
                      background: isListening && frequency > 0
                        ? `radial-gradient(circle at 50% 60%, ${statusColor}14 0%, transparent 70%)`
                        : "none",
                      opacity: isListening && frequency > 0 ? 1 : 0,
                    }}
                  />
                  <span
                    className="t-orb-note"
                    style={{ color: isListening && frequency > 0 ? statusColor : "#1e1e28" }}
                  >
                    {note}
                  </span>
                  <span
                    className="t-orb-hz"
                    style={{ color: isListening && frequency > 0 ? "#2d2d3e" : "#16161e" }}
                  >
                    {frequency > 0 ? `${frequency.toFixed(1)} Hz` : `${targetFrequency.toFixed(1)} Hz`}
                  </span>
                  {isListening && frequency > 0 && (
                    <span className="t-orb-status" style={{ color: statusColor }}>
                      {statusLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Gauge */}
              <div className="t-gauge-wrap">
                <div className="t-gauge-track">
                  {/* tick marks */}
                  {[-50, -25, 0, 25, 50].map(v => (
                    <div
                      key={v}
                      className="t-gauge-tick"
                      style={{
                        left: `${50 + v}%`,
                        height: v === 0 ? 10 : 6,
                        background: v === 0 ? "#1f1f2a" : "#141419",
                      }}
                    />
                  ))}

                  {/* fill */}
                  {isListening && frequency > 0 && status !== "in-tune" && (
                    <div
                      className="t-gauge-fill"
                      style={{
                        left: status === "flat" ? `${needlePercent}%` : "50%",
                        width: `${Math.abs(needlePercent - 50)}%`,
                        background: `${statusColor}30`,
                      }}
                    />
                  )}

                  {/* needle */}
                  {isListening && (
                    <div
                      className="t-gauge-needle"
                      style={{
                        left: `${frequency > 0 ? needlePercent : 50}%`,
                        background: frequency > 0 ? statusColor : "#1f1f2a",
                        boxShadow: frequency > 0 ? `0 0 10px ${statusColor}80` : "none",
                      }}
                    />
                  )}
                </div>

                <div className="t-gauge-labels">
                  <span>FLAT</span>
                  <span className="cents-val" style={{ color: isListening && frequency > 0 ? statusColor : "#22222e" }}>
                    {isListening && frequency > 0 ? `${cents > 0 ? "+" : ""}${cents}¢` : "0¢"}
                  </span>
                  <span>SHARP</span>
                </div>
              </div>

              {/* Error */}
              {error && <div className="t-error">{error}</div>}

              {/* Controls */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                {!isListening ? (
                  <button className="t-btn t-btn-start" onClick={startListening}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="6.5" cy="6.5" r="2.2" fill="currentColor" />
                    </svg>
                    Start Listening
                  </button>
                ) : (
                  <button className="t-btn t-btn-stop" onClick={stopListening}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <rect x="1" y="1" width="9" height="9" rx="2" fill="currentColor" />
                    </svg>
                    Stop
                  </button>
                )}
                {isListening && (
                  <div className="t-live">
                    <div className="t-live-dot" />
                    <span>LISTENING</span>
                  </div>
                )}
              </div>

            </div>

            {/* Tips */}
            <div className="t-tips">
              {[
                ["One note at a time", "Play single strings clearly for the most accurate pitch detection."],
                ["Sustain the note", "Hold for 2–3 seconds to let the reading stabilise."],
                ["Quiet environment", "Background noise reduces accuracy. Tune in a quiet space."],
              ].map(([title, desc]) => (
                <div key={title} className="t-tip">
                  <p className="t-tip-title">{title}</p>
                  <p className="t-tip-desc">{desc}</p>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}