"use client";

import { QUESTION_MAX_CHARS } from "@/lib/constants";

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
}

export default function Textarea({
  value,
  onChange,
  placeholder,
  disabled,
  error,
}: TextareaProps) {
  const count = value.length;
  const isOverLimit = count > QUESTION_MAX_CHARS;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
        Your Doubt
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={4}
          className={`w-full resize-none rounded-lg border px-4 py-3 pb-7 text-sm text-slate-800 shadow-sm transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-200"
              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-200"
          }`}
        />
        <span
          className={`absolute bottom-3 right-3 text-xs ${
            isOverLimit ? "font-semibold text-red-500" : "text-slate-400"
          }`}
        >
          {count} / {QUESTION_MAX_CHARS}
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
