"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface PracticeQuestionProps {
  question: string;
  answer: string;
}

export default function PracticeQuestion({
  question,
  answer,
}: PracticeQuestionProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-xl bg-indigo-50 p-5">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
        Practice Question
      </p>
      <p className="mb-4 text-sm leading-relaxed text-slate-700">{question}</p>
      <button
        onClick={() => setRevealed((r) => !r)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            revealed ? "rotate-180" : ""
          }`}
        />
        {revealed ? "Hide Answer" : "Reveal Answer"}
      </button>
      {revealed && (
        <div className="animate-fade-in mt-3 rounded-lg border border-indigo-100 bg-white p-3 text-sm leading-relaxed text-slate-700">
          {answer}
        </div>
      )}
    </div>
  );
}
