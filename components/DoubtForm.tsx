"use client";

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { CLASSES, SUBJECTS } from "@/lib/constants";
import type { FormState, AppState } from "@/lib/types";

interface DoubtFormProps {
  formState: FormState;
  appState: AppState;
  onChangeField: (
    field: keyof Omit<FormState, "error">,
    value: string
  ) => void;
  onSubmit: () => void;
}

export default function DoubtForm({
  formState,
  appState,
  onChangeField,
  onSubmit,
}: DoubtFormProps) {
  const isLoading = appState === "loading" || appState === "streaming";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md sm:p-8"
    >
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Class"
          value={formState.classLevel}
          options={CLASSES}
          onChange={(v) => onChangeField("classLevel", v)}
          disabled={isLoading}
        />
        <Select
          label="Subject"
          value={formState.subject}
          options={SUBJECTS}
          onChange={(v) => onChangeField("subject", v)}
          disabled={isLoading}
        />
      </div>
      <div className="mb-5">
        <Textarea
          value={formState.question}
          onChange={(v) => onChangeField("question", v)}
          placeholder="Type your doubt here... e.g. 'Why does ice float on water?'"
          disabled={isLoading}
          error={formState.error}
        />
      </div>
      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        Solve My Doubt →
      </Button>
    </form>
  );
}
