"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/app/components/LogoutButton";
import StudentSidebar from "@/app/components/StudentSidebar";


export default function QuizPage() {
  const { data: session } = useSession();
  interface Question {
    questionId: string;
    question: string;
    type: "multiple-choice" | "true-false" | "fill-blank";
    options: string[];
    correctAnswer: string;
    explanation: string;
  }

  interface Quiz {
    quizId: string;
    instrument: string;
    level: string;
    title: string;
    description?: string;
    questionCount?: number;
    passingScore?: number;
    questions?: Question[];
  }
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const instruments = ["Guitar", "Piano", "Drums", "Violin", "Flute", "Saxophone", "Trumpet", "Bass"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const defaultQuizzes: Quiz[] = [
    {
      quizId: "guitar-beginner",
      instrument: "Guitar",
      level: "Beginner",
      title: "Guitar Beginner Basics",
      description: "Start with basic chords, tuning, and rhythm for the guitar.",
      passingScore: 70,
      questions: [
        {
          questionId: "guitar-beginner-1",
          question: "Which of these is the standard tuning for a guitar from lowest pitch to highest?",
          type: "multiple-choice",
          options: ["E A D G B E", "A D G C E A", "D G C F A D", "E B G D A E"],
          correctAnswer: "E A D G B E",
          explanation: "Standard guitar tuning is E-A-D-G-B-E from the lowest to highest string.",
        },
        {
          questionId: "guitar-beginner-2",
          question: "Which chord shape is an open C major chord?",
          type: "multiple-choice",
          options: ["0-3-2-0-1-0", "0-2-2-1-0-0", "3-2-0-0-0-3", "0-0-2-2-2-0"],
          correctAnswer: "0-3-2-0-1-0",
          explanation: "The open C major chord uses strings 5-4-3-2-1 with the fretting pattern 0-3-2-0-1-0.",
        },
      ],
    },
    {
      quizId: "guitar-intermediate",
      instrument: "Guitar",
      level: "Intermediate",
      title: "Guitar Chords & Rhythm",
      description: "Learn barre chords, rhythm patterns, and scale shapes for guitar.",
      passingScore: 75,
      questions: [
        {
          questionId: "guitar-intermediate-1",
          question: "What does a barre chord allow you to do?",
          type: "multiple-choice",
          options: ["Play open chords only", "Play chords without using fingers", "Use one finger to press multiple strings", "Tune the guitar automatically"],
          correctAnswer: "Use one finger to press multiple strings",
          explanation: "A barre chord uses one finger to press multiple strings across the fretboard.",
        },
        {
          questionId: "guitar-intermediate-2",
          question: "Which scale is commonly used for improvising in rock and blues?",
          type: "multiple-choice",
          options: ["Major scale", "Minor pentatonic scale", "Chromatic scale", "Whole-tone scale"],
          correctAnswer: "Minor pentatonic scale",
          explanation: "The minor pentatonic scale is widely used in rock and blues solos.",
        },
      ],
    },
    {
      quizId: "guitar-advanced",
      instrument: "Guitar",
      level: "Advanced",
      title: "Guitar Solo Techniques",
      description: "Master advanced guitar techniques like bending, tapping, and hybrid picking.",
      passingScore: 80,
      questions: [
        {
          questionId: "guitar-advanced-1",
          question: "Which technique uses the picking hand to fret notes on the fingerboard?",
          type: "multiple-choice",
          options: ["Alternate picking", "Sweep picking", "Tapping", "Palm muting"],
          correctAnswer: "Tapping",
          explanation: "Tapping uses the picking hand to press notes directly on the fretboard.",
        },
        {
          questionId: "guitar-advanced-2",
          question: "What is the purpose of hybrid picking?",
          type: "multiple-choice",
          options: ["To tune the guitar", "To combine pick and fingers for fast phrasing", "To play only open strings", "To mute strings"],
          correctAnswer: "To combine pick and fingers for fast phrasing",
          explanation: "Hybrid picking allows using both a pick and fingers to play complex passages.",
        },
      ],
    },
    {
      quizId: "piano-beginner",
      instrument: "Piano",
      level: "Beginner",
      title: "Piano Beginner Essentials",
      description: "Learn notes, finger numbers, and simple scales on the piano.",
      passingScore: 70,
      questions: [
        {
          questionId: "piano-beginner-1",
          question: "What is the name of the white key immediately to the left of the group of two black keys?",
          type: "multiple-choice",
          options: ["C", "D", "E", "F"],
          correctAnswer: "C",
          explanation: "The white key to the left of the group of two black keys is C.",
        },
        {
          questionId: "piano-beginner-2",
          question: "How many keys are in one octave on a piano?",
          type: "multiple-choice",
          options: ["6", "7", "8", "12"],
          correctAnswer: "12",
          explanation: "One octave contains 12 keys, including 7 white and 5 black keys.",
        },
      ],
    },
    {
      quizId: "piano-intermediate",
      instrument: "Piano",
      level: "Intermediate",
      title: "Piano Chords & Theory",
      description: "Build chord progressions, scales, and sight-reading skills on piano.",
      passingScore: 75,
      questions: [
        {
          questionId: "piano-intermediate-1",
          question: "Which chord is made of the notes C-E-G?",
          type: "multiple-choice",
          options: ["C major", "A minor", "F major", "G major"],
          correctAnswer: "C major",
          explanation: "C major is built from C, E, and G.",
        },
        {
          questionId: "piano-intermediate-2",
          question: "What is the relative minor of C major?",
          type: "multiple-choice",
          options: ["A minor", "D minor", "E minor", "B minor"],
          correctAnswer: "A minor",
          explanation: "A minor is the relative minor to C major.",
        },
      ],
    },
    {
      quizId: "piano-advanced",
      instrument: "Piano",
      level: "Advanced",
      title: "Piano Advanced Harmony",
      description: "Explore advanced chord voicings, modulations, and expressive piano technique.",
      passingScore: 80,
      questions: [
        {
          questionId: "piano-advanced-1",
          question: "Which chord progression is commonly used in jazz?",
          type: "multiple-choice",
          options: ["I-IV-V", "ii-V-I", "vi-ii-V", "I-vi-ii"],
          correctAnswer: "ii-V-I",
          explanation: "The ii-V-I progression is a fundamental jazz harmony sequence.",
        },
        {
          questionId: "piano-advanced-2",
          question: "What does voice leading aim to preserve?",
          type: "multiple-choice",
          options: ["Speed of playing", "Smooth movement between chord tones", "Loudness", "Improvisation skills"],
          correctAnswer: "Smooth movement between chord tones",
          explanation: "Voice leading helps maintain smooth transitions between chords.",
        },
      ],
    },
    {
      quizId: "drums-beginner",
      instrument: "Drums",
      level: "Beginner",
      title: "Drums Beginner Rhythm",
      description: "Learn basic drum sounds, counting, and simple beats.",
      passingScore: 70,
      questions: [
        {
          questionId: "drums-beginner-1",
          question: "What is the steady beat played on the hi-hat in a basic rock pattern?",
          type: "multiple-choice",
          options: ["Quarter notes", "Whole notes", "Eighth notes", "Sixteenth notes"],
          correctAnswer: "Eighth notes",
          explanation: "In basic rock patterns, the hi-hat often plays steady eighth notes.",
        },
        {
          questionId: "drums-beginner-2",
          question: "Which drum is typically played with the foot pedal?",
          type: "multiple-choice",
          options: ["Snare drum", "Bass drum", "Tom-tom", "Ride cymbal"],
          correctAnswer: "Bass drum",
          explanation: "The bass drum is usually operated with a foot pedal.",
        },
      ],
    },
    {
      quizId: "drums-intermediate",
      instrument: "Drums",
      level: "Intermediate",
      title: "Drums Groove & Coordination",
      description: "Master drum grooves, fills, and limb independence.",
      passingScore: 75,
      questions: [
        {
          questionId: "drums-intermediate-1",
          question: "What does 'paradiddle' refer to on drums?",
          type: "multiple-choice",
          options: ["A type of cymbal", "A sticking pattern", "A bass drum beat", "A hi-hat rhythm"],
          correctAnswer: "A sticking pattern",
          explanation: "A paradiddle is a common drum sticking pattern for coordination.",
        },
        {
          questionId: "drums-intermediate-2",
          question: "What is a drum fill used for?",
          type: "multiple-choice",
          options: ["To end the song", "To transition between sections", "To tune the drums", "To keep time"],
          correctAnswer: "To transition between sections",
          explanation: "A fill helps move the groove from one section to another.",
        },
      ],
    },
    {
      quizId: "drums-advanced",
      instrument: "Drums",
      level: "Advanced",
      title: "Drums Advanced Technique",
      description: "Apply advanced drum concepts like odd meters, polyrhythms, and dynamics.",
      passingScore: 80,
      questions: [
        {
          questionId: "drums-advanced-1",
          question: "What is a polyrhythm?",
          type: "multiple-choice",
          options: ["Two rhythms played together", "A slow drum fill", "A cymbal technique", "A genre of music"],
          correctAnswer: "Two rhythms played together",
          explanation: "Polyrhythms combine two or more different rhythmic patterns simultaneously.",
        },
        {
          questionId: "drums-advanced-2",
          question: "Which meter is considered odd time?",
          type: "multiple-choice",
          options: ["4/4", "3/4", "7/8", "2/4"],
          correctAnswer: "7/8",
          explanation: "7/8 is an example of an odd meter not grouped in fours or threes.",
        },
      ],
    },
    {
      quizId: "violin-beginner",
      instrument: "Violin",
      level: "Beginner",
      title: "Violin Beginner Basics",
      description: "Learn posture, bow grip, and open string tuning on the violin.",
      passingScore: 70,
      questions: [
        {
          questionId: "violin-beginner-1",
          question: "Which string is the highest pitch on the violin?",
          type: "multiple-choice",
          options: ["G", "D", "A", "E"],
          correctAnswer: "E",
          explanation: "The E string is the highest pitch string on a standard violin.",
        },
        {
          questionId: "violin-beginner-2",
          question: "What is the tool used to tighten violin strings called?",
          type: "multiple-choice",
          options: ["Rosin", "Tuner", "Peg", "Bridge"],
          correctAnswer: "Peg",
          explanation: "Violin strings are tuned using the pegs at the top of the instrument.",
        },
      ],
    },
    {
      quizId: "violin-intermediate",
      instrument: "Violin",
      level: "Intermediate",
      title: "Violin Fingerings & Phrasing",
      description: "Develop finger placement, shifting, and expressive bow control.",
      passingScore: 75,
      questions: [
        {
          questionId: "violin-intermediate-1",
          question: "Which finger is used for first position on the A string?",
          type: "multiple-choice",
          options: ["Index", "Middle", "Ring", "Pinky"],
          correctAnswer: "Index",
          explanation: "The index finger plays the first position note on the A string.",
        },
        {
          questionId: "violin-intermediate-2",
          question: "What is vibrato used for on violin?",
          type: "multiple-choice",
          options: ["Tuning the string", "Adding warmth and expression", "Changing rhythm", "Speeding bowing"],
          correctAnswer: "Adding warmth and expression",
          explanation: "Vibrato adds warmth and expressiveness to sustained notes.",
        },
      ],
    },
    {
      quizId: "violin-advanced",
      instrument: "Violin",
      level: "Advanced",
      title: "Violin Advanced Performance",
      description: "Master shifting, double stops, and advanced bowing techniques.",
      passingScore: 80,
      questions: [
        {
          questionId: "violin-advanced-1",
          question: "What is a double stop on violin?",
          type: "multiple-choice",
          options: ["Playing two notes at once", "Tuning two strings", "Switching bows", "Using two violins"],
          correctAnswer: "Playing two notes at once",
          explanation: "A double stop is playing two strings simultaneously on the violin.",
        },
        {
          questionId: "violin-advanced-2",
          question: "What technique shifts the left hand to a higher position?",
          type: "multiple-choice",
          options: ["Vibrato", "Shifting", "Pizzicato", "Spiccato"],
          correctAnswer: "Shifting",
          explanation: "Shifting moves the left hand to higher positions on the fingerboard.",
        },
      ],
    },
    {
      quizId: "flute-beginner",
      instrument: "Flute",
      level: "Beginner",
      title: "Flute Beginner Fundamentals",
      description: "Learn flute posture, breathing, and basic fingerings.",
      passingScore: 70,
      questions: [
        {
          questionId: "flute-beginner-1",
          question: "Which part of the flute do you blow across?",
          type: "multiple-choice",
          options: ["Foot joint", "Headjoint", "Body", "Key mechanism"],
          correctAnswer: "Headjoint",
          explanation: "You blow across the embouchure hole in the flute's headjoint.",
        },
        {
          questionId: "flute-beginner-2",
          question: "What is the first note produced on the flute using all fingers down?",
          type: "multiple-choice",
          options: ["C", "D", "E", "F"],
          correctAnswer: "C",
          explanation: "The first standard note with all finger holes covered is low C.",
        },
      ],
    },
    {
      quizId: "flute-intermediate",
      instrument: "Flute",
      level: "Intermediate",
      title: "Flute Breath & Tone",
      description: "Build breath support, tone quality, and intermediate fingering patterns.",
      passingScore: 75,
      questions: [
        {
          questionId: "flute-intermediate-1",
          question: "What is the main focus for producing a clean flute tone?",
          type: "multiple-choice",
          options: ["Strong fingers", "Loose embouchure", "Steady air stream", "Fast tonguing"],
          correctAnswer: "Steady air stream",
          explanation: "A steady air stream is essential for a clean flute tone.",
        },
        {
          questionId: "flute-intermediate-2",
          question: "Which articulation style uses a single, clean tongued attack?",
          type: "multiple-choice",
          options: ["Legato", "Staccato", "Accent", "Marcatto"],
          correctAnswer: "Staccato",
          explanation: "Staccato uses a short, clean tongued attack for detached notes.",
        },
      ],
    },
    {
      quizId: "flute-advanced",
      instrument: "Flute",
      level: "Advanced",
      title: "Flute Advanced Techniques",
      description: "Explore advanced flute control, dynamics, and extended range.",
      passingScore: 80,
      questions: [
        {
          questionId: "flute-advanced-1",
          question: "What does 'altissimo' refer to on the flute?",
          type: "multiple-choice",
          options: ["Very soft playing", "Extended high register", "Slow tempo", "Double tonguing"],
          correctAnswer: "Extended high register",
          explanation: "Altissimo refers to the extended high register of the flute.",
        },
        {
          questionId: "flute-advanced-2",
          question: "Which technique uses two different tonguing syllables in rapid succession?",
          type: "multiple-choice",
          options: ["Double tonguing", "Vibrato", "Flutter tonguing", "Glissando"],
          correctAnswer: "Double tonguing",
          explanation: "Double tonguing uses alternating syllables for fast articulation.",
        },
      ],
    },
    {
      quizId: "saxophone-beginner",
      instrument: "Saxophone",
      level: "Beginner",
      title: "Saxophone Beginner Setup",
      description: "Learn how to assemble, hold, and produce your first sounds on saxophone.",
      passingScore: 70,
      questions: [
        {
          questionId: "saxophone-beginner-1",
          question: "Which reed strength is easiest for beginners to play?",
          type: "multiple-choice",
          options: ["1.5", "2", "2.5", "3"],
          correctAnswer: "1.5",
          explanation: "A softer reed like 1.5 is easier for beginners.",
        },
        {
          questionId: "saxophone-beginner-2",
          question: "What is the correct mouth shape for saxophone embouchure?",
          type: "multiple-choice",
          options: ["Wide smile", "Firm lower lip with relaxed top lip", "Pursed lips", "Open mouth"],
          correctAnswer: "Firm lower lip with relaxed top lip",
          explanation: "A firm lower lip and relaxed top lip help control the saxophone sound.",
        },
      ],
    },
    {
      quizId: "saxophone-intermediate",
      instrument: "Saxophone",
      level: "Intermediate",
      title: "Saxophone Tone & Technique",
      description: "Improve saxophone tone, breath control, and basic jazz phrasing.",
      passingScore: 75,
      questions: [
        {
          questionId: "saxophone-intermediate-1",
          question: "Which octave key on saxophone helps play higher notes?",
          type: "multiple-choice",
          options: ["Palm key", "Octave key", "Side key", "Whisper key"],
          correctAnswer: "Octave key",
          explanation: "The octave key allows saxophonists to play in the upper register.",
        },
        {
          questionId: "saxophone-intermediate-2",
          question: "What is a good practice for consistent saxophone tone?",
          type: "multiple-choice",
          options: ["Fast tonguing", "Breath control and support", "Loose posture", "No reed"],
          correctAnswer: "Breath control and support",
          explanation: "Consistent tone depends on steady breath support.",
        },
      ],
    },
    {
      quizId: "saxophone-advanced",
      instrument: "Saxophone",
      level: "Advanced",
      title: "Saxophone Jazz & Expression",
      description: "Explore jazz phrasing, altissimo, and expressive saxophone playing.",
      passingScore: 80,
      questions: [
        {
          questionId: "saxophone-advanced-1",
          question: "What is a common feature of jazz saxophone phrasing?",
          type: "multiple-choice",
          options: ["Strict metronome feel", "Swing rhythm and syncopation", "Only whole notes", "No dynamics"],
          correctAnswer: "Swing rhythm and syncopation",
          explanation: "Jazz phrasing often includes swing rhythms and syncopated accents.",
        },
        {
          questionId: "saxophone-advanced-2",
          question: "What does altissimo on saxophone require?",
          type: "multiple-choice",
          options: ["Lighter reed", "No breath", "Different embouchure and fingerings", "Faster tonguing"],
          correctAnswer: "Different embouchure and fingerings",
          explanation: "Altissimo uses a special embouchure and fingerings for very high notes.",
        },
      ],
    },
    {
      quizId: "trumpet-beginner",
      instrument: "Trumpet",
      level: "Beginner",
      title: "Trumpet Beginner Fundamentals",
      description: "Learn how to buzz, hold the trumpet, and play basic notes.",
      passingScore: 70,
      questions: [
        {
          questionId: "trumpet-beginner-1",
          question: "What is the correct way to buzz on trumpet?",
          type: "multiple-choice",
          options: ["Using throat pressure", "Relaxed lips vibrating against the mouthpiece", "Tight teeth", "Closed lips"],
          correctAnswer: "Relaxed lips vibrating against the mouthpiece",
          explanation: "Trumpet sound begins with relaxed lips buzzing against the mouthpiece.",
        },
        {
          questionId: "trumpet-beginner-2",
          question: "Which valve combination plays the note C on trumpet?",
          type: "multiple-choice",
          options: ["No valves", "First valve", "Second valve", "First and second valves"],
          correctAnswer: "No valves",
          explanation: "Open valves produce the concert C harmonic series on trumpet.",
        },
      ],
    },
    {
      quizId: "trumpet-intermediate",
      instrument: "Trumpet",
      level: "Intermediate",
      title: "Trumpet Range & Articulation",
      description: "Develop clean articulation, valve technique, and mid-range control.",
      passingScore: 75,
      questions: [
        {
          questionId: "trumpet-intermediate-1",
          question: "What does tonguing do on trumpet?",
          type: "multiple-choice",
          options: ["Change pitch", "Start and separate notes cleanly", "Increase volume", "Tune the instrument"],
          correctAnswer: "Start and separate notes cleanly",
          explanation: "Tonguing helps begin and separate notes with clarity.",
        },
        {
          questionId: "trumpet-intermediate-2",
          question: "Which fingering is used for a low G on trumpet?",
          type: "multiple-choice",
          options: ["Open", "First valve", "Second valve", "First and second valves"],
          correctAnswer: "First and second valves",
          explanation: "Low G is typically played with the first and second valve combination.",
        },
      ],
    },
    {
      quizId: "trumpet-advanced",
      instrument: "Trumpet",
      level: "Advanced",
      title: "Trumpet Advanced Control",
      description: "Master high range, flexibility, and expressive trumpet performance.",
      passingScore: 80,
      questions: [
        {
          questionId: "trumpet-advanced-1",
          question: "What is needed for strong upper register trumpet playing?",
          type: "multiple-choice",
          options: ["Soft air", "Constant lips", "Firm breath support and embouchure control", "Open throat"],
          correctAnswer: "Firm breath support and embouchure control",
          explanation: "Upper register trumpet playing requires strong breath support and embouchure control.",
        },
        {
          questionId: "trumpet-advanced-2",
          question: "Which technique helps create smooth slurs on trumpet?",
          type: "multiple-choice",
          options: ["Fast tonguing", "Legato tonguing and airflow", "Mouthpiece pressure", "No breath"],
          correctAnswer: "Legato tonguing and airflow",
          explanation: "Smooth slurs rely on legato tonguing plus steady airflow.",
        },
      ],
    },
    {
      quizId: "bass-beginner",
      instrument: "Bass",
      level: "Beginner",
      title: "Bass Beginner Groove",
      description: "Learn bass fingerings, open strings, and simple grooves.",
      passingScore: 70,
      questions: [
        {
          questionId: "bass-beginner-1",
          question: "What are the standard open strings on a 4-string bass from lowest to highest?",
          type: "multiple-choice",
          options: ["E A D G", "A D G C", "D G C F", "E B G D"],
          correctAnswer: "E A D G",
          explanation: "Standard 4-string bass tuning is E-A-D-G.",
        },
        {
          questionId: "bass-beginner-2",
          question: "Which finger technique is common for basic bass lines?",
          type: "multiple-choice",
          options: ["Pick only", "Slap only", "Index and middle fingers alternating", "Thumb only"],
          correctAnswer: "Index and middle fingers alternating",
          explanation: "Alternating index and middle fingers is a common bass technique.",
        },
      ],
    },
    {
      quizId: "bass-intermediate",
      instrument: "Bass",
      level: "Intermediate",
      title: "Bass Groove & Timing",
      description: "Improve timing, walking bass lines, and interaction with drums.",
      passingScore: 75,
      questions: [
        {
          questionId: "bass-intermediate-1",
          question: "What is a walking bass line usually based on?",
          type: "multiple-choice",
          options: ["Chord tones and passing notes", "Random notes", "Open strings only", "Single repeated note"],
          correctAnswer: "Chord tones and passing notes",
          explanation: "Walking bass lines use chord tones plus passing notes to connect harmony.",
        },
        {
          questionId: "bass-intermediate-2",
          question: "Why is locking in with the drummer important for bass players?",
          type: "multiple-choice",
          options: ["To play louder", "To keep the groove tight", "To avoid singing", "To tune faster"],
          correctAnswer: "To keep the groove tight",
          explanation: "The bass and drums working together keep the rhythmic groove solid.",
        },
      ],
    },
    {
      quizId: "bass-advanced",
      instrument: "Bass",
      level: "Advanced",
      title: "Bass Advanced Techniques",
      description: "Master advanced bass lines, slapping, and melodic soloing.",
      passingScore: 80,
      questions: [
        {
          questionId: "bass-advanced-1",
          question: "What is slapping on bass?",
          type: "multiple-choice",
          options: ["Using a pick", "Hitting the string with the thumb", "Plucking with the thumb only", "Tapping on the body"],
          correctAnswer: "Hitting the string with the thumb",
          explanation: "Slapping uses the thumb to strike the string and produce a percussive sound.",
        },
        {
          questionId: "bass-advanced-2",
          question: "What is a good way to play melodic bass solos?",
          type: "multiple-choice",
          options: ["Random notes", "Stay on one string", "Use strong phrasing and scale choices", "Only open strings"],
          correctAnswer: "Use strong phrasing and scale choices",
          explanation: "Melodic bass solos rely on phrasing and appropriate scale choices.",
        },
      ],
    },
  ];

  const getFallbackQuizzes = () => defaultQuizzes
    .filter((quiz) => {
      return (
        (selectedInstrument === "all" || quiz.instrument === selectedInstrument) &&
        (selectedLevel === "all" || quiz.level === selectedLevel)
      );
    })
    .map((quiz) => ({
      ...quiz,
      questionCount: quiz.questions?.length ?? 0,
    }));

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/quizzes?";
      if (selectedInstrument !== "all") {
        url += `instrument=${selectedInstrument}&`;
      }
      if (selectedLevel !== "all") {
        url += `level=${selectedLevel}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const data = await res.json();
      const fetchedQuizzes = Array.isArray(data.quizzes) ? data.quizzes : [];
      setQuizzes(fetchedQuizzes.length > 0 ? fetchedQuizzes : getFallbackQuizzes());
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes(getFallbackQuizzes());
    }
    setLoading(false);
  }, [selectedInstrument, selectedLevel]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return (
    <div className="min-h-screen bg-[#111111] text-slate-300 font-sans antialiased">
      <main className="pl-20 max-w-[1440px] mx-auto">
        <StudentSidebar />
        {/* Header */}
        <header className="fixed top-0 left-20 right-0 z-40 h-20 px-12 flex items-center justify-between border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-4 text-sm font-medium tracking-tight">
            <span className="text-slate-600">Virtuoso</span>
            <span className="text-slate-800">/</span>
            <span className="text-slate-200">Quiz</span>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-sm font-semibold text-slate-200">
              {session?.user?.name || "User"}
            </p>
            <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10 flex items-center justify-center">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="Avatar" className="grayscale w-full h-full object-cover" />
              ) : (
                <span className="text-lg text-white font-bold">
                  {session?.user?.name ? session.user.name[0] : "U"}
                </span>
              )}
            </div>
            <LogoutButton />
          </div>
        </header>

        <div className="pt-32 px-12 pb-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Music Quizzes</h1>
            <p className="text-slate-400">Test your knowledge and improve your musical skills</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Filter by Instrument</label>
              <select 
                value={selectedInstrument} 
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none hover:border-white/20 focus:border-[#ff5a00] transition-colors"
              >
                <option value="all">All Instruments</option>
                {instruments.map(inst => (
                  <option key={inst} value={inst}>{inst}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300 mb-2 block">Filter by Level</label>
              <select 
                value={selectedLevel} 
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white outline-none hover:border-white/20 focus:border-[#ff5a00] transition-colors"
              >
                <option value="all">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No quizzes available yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Link key={quiz.quizId} href={`/dashboard/student/quiz/${quiz.quizId}`}>
                  <div className="bg-[#1a1a1a] border border-white/10 rounded-lg p-6 hover:border-[#ff5a00] transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#ff5a00] transition-colors mb-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">{quiz.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-block px-3 py-1 bg-[#ff5a00]/20 text-[#ff5a00] text-xs font-semibold rounded">
                        {quiz.instrument}
                      </span>
                      <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded">
                        {quiz.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={14} />
                        <span>{quiz.questionCount || 0} questions</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-[#ff5a00] transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
