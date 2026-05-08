export interface DoubtRequest {
  classLevel: string;
  subject: string;
  question: string;
}

export interface FormState {
  classLevel: string;
  subject: string;
  question: string;
  error: string | null;
}

export type AppState = "idle" | "loading" | "streaming" | "done" | "error";
