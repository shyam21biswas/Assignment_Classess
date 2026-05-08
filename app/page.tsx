"use client";

import { useDoubtSolver } from "@/hooks/useDoubtSolver";
import Header from "@/components/Header";
import DoubtForm from "@/components/DoubtForm";
import AnswerCard from "@/components/AnswerCard";

export default function HomePage() {
  const {
    formState,
    appState,
    streamedAnswer,
    updateForm,
    submitDoubt,
    reset,
  } = useDoubtSolver();

  const showAnswer = streamedAnswer.length > 0;

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FAFAFA]">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8 sm:px-8 sm:py-12">
          <DoubtForm
            formState={formState}
            appState={appState}
            onChangeField={updateForm}
            onSubmit={submitDoubt}
          />
          {showAnswer && (
            <AnswerCard
              markdown={streamedAnswer}
              appState={appState}
              onReset={reset}
            />
          )}
        </div>
      </main>
    </>
  );
}
