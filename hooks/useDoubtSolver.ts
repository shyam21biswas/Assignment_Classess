"use client";

import { useState, useCallback } from "react";
import type { FormState, AppState, DoubtRequest } from "@/lib/types";
import { QUESTION_MIN_CHARS, QUESTION_MAX_CHARS } from "@/lib/constants";

interface UseDoubtSolverReturn {
  formState: FormState;
  appState: AppState;
  streamedAnswer: string;
  updateForm: (field: keyof Omit<FormState, "error">, value: string) => void;
  submitDoubt: () => Promise<void>;
  reset: () => void;
}

const initialFormState: FormState = {
  classLevel: "Class 9",
  subject: "Mathematics",
  question: "",
  error: null,
};

export function useDoubtSolver(): UseDoubtSolverReturn {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [appState, setAppState] = useState<AppState>("idle");
  const [streamedAnswer, setStreamedAnswer] = useState("");

  const updateForm = useCallback(
    (field: keyof Omit<FormState, "error">, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value, error: null }));
    },
    []
  );

  const submitDoubt = useCallback(async () => {
    const { classLevel, subject, question } = formState;
    const trimmed = question.trim();

    if (trimmed.length < QUESTION_MIN_CHARS) {
      setFormState((prev) => ({
        ...prev,
        error: `Please describe your doubt in at least ${QUESTION_MIN_CHARS} characters.`,
      }));
      return;
    }
    if (trimmed.length > QUESTION_MAX_CHARS) {
      setFormState((prev) => ({
        ...prev,
        error: `Please keep your doubt under ${QUESTION_MAX_CHARS} characters.`,
      }));
      return;
    }

    setFormState((prev) => ({ ...prev, error: null }));
    setAppState("loading");
    setStreamedAnswer("");

    const payload: DoubtRequest = {
      classLevel,
      subject,
      question: trimmed,
    };

    try {
      const response = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        const data = (await response.json()) as { error?: string };
        throw new Error(
          data.error ?? "Something went wrong. Please try again."
        );
      }

      setAppState("streaming");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setStreamedAnswer((prev) => prev + decoder.decode(value));
      }

      setAppState("done");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setFormState((prev) => ({ ...prev, error: message }));
      setAppState("error");
    }
  }, [formState]);

  const reset = useCallback(() => {
    setFormState((prev) => ({ ...prev, question: "", error: null }));
    setAppState("idle");
    setStreamedAnswer("");
  }, []);

  return { formState, appState, streamedAnswer, updateForm, submitDoubt, reset };
}
