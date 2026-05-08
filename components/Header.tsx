import { GraduationCap } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-indigo-100 bg-white">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4 sm:px-8">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-indigo-900">
            DoubtClear
          </p>
          <p className="text-xs text-indigo-400">
            Ask any doubt. Understand it completely.
          </p>
        </div>
      </div>
    </header>
  );
}
