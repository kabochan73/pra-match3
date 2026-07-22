import { Suspense } from "react";
import { JobsPageContent } from "./jobs-page-content";

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
          読み込み中...
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}
