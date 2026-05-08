"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { RotateCcw, MessageSquarePlus } from "lucide-react";
import PracticeQuestion from "@/components/PracticeQuestion";
import Button from "@/components/ui/Button";
import type { AppState } from "@/lib/types";

interface ParsedAnswer {
  main: string;
  practiceQuestion: string | null;
  practiceAnswer: string | null;
}

function normalizeMathText(markdown: string): string {
  return markdown
    .replace(/\\\(([\s\S]*?)\\\)/g, "$1")
    .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
    .replace(/\$([^$\n]+)\$/g, "$1")
    .replace(/\\times/g, "x")
    .replace(/\\cdot/g, ".")
    .replace(/\\div/g, "/")
    .replace(/\\pi/g, "pi")
    .replace(/\{\s*([^{}]+?)\s*\}/g, "$1");
}

function parseAnswer(markdown: string): ParsedAnswer {
  const cleanMarkdown = normalizeMathText(markdown);
  const sectionParts = cleanMarkdown.split(/\n## Practice Question\n?/i);

  if (sectionParts.length < 2) {
    return {
      main: cleanMarkdown,
      practiceQuestion: null,
      practiceAnswer: null,
    };
  }

  const main = sectionParts[0].trim();
  const practiceSection = sectionParts[1];

  const detailsMatch = practiceSection.match(
    /<details><summary>Reveal Answer<\/summary>([\s\S]*?)<\/details>/
  );
  const practiceAnswer = detailsMatch?.[1]?.trim() ?? null;
  const practiceQuestion = practiceSection
    .replace(/<details>[\s\S]*?<\/details>/, "")
    .trim();

  return {
    main,
    practiceQuestion: practiceQuestion || null,
    practiceAnswer,
  };
}

const mdComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 text-sm font-bold text-indigo-700 first:mt-0">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-slate-700">{children}</p>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-slate-700">
      {children}
    </ol>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
      {children}
    </ul>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-xs text-indigo-700">
      {children}
    </code>
  ),
};

interface AnswerCardProps {
  markdown: string;
  appState: AppState;
  onReset: () => void;
}

export default function AnswerCard({
  markdown,
  appState,
  onReset,
}: AnswerCardProps) {
  const isStreaming = appState === "streaming";
  const isDone = appState === "done";
  const { main, practiceQuestion, practiceAnswer } = parseAnswer(markdown);

  return (
    <div className="animate-slide-in rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-500" />
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Answer
        </p>
      </div>

      <div className="prose-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
          {main}
        </ReactMarkdown>

        {isStreaming && (
          <span className="inline-block h-4 w-0.5 animate-cursor-blink bg-indigo-500" />
        )}
      </div>

      {isDone && practiceQuestion && practiceAnswer && (
        <div className="mt-4">
          <PracticeQuestion
            question={practiceQuestion}
            answer={practiceAnswer}
          />
        </div>
      )}

      {isDone && (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Button variant="secondary" onClick={onReset}>
            <MessageSquarePlus className="h-4 w-4" />
            Ask a Follow-up
          </Button>
          <Button variant="secondary" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            New Question
          </Button>
        </div>
      )}
    </div>
  );
}
