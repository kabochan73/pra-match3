"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCreateJobPosting } from "@/lib/company-job-postings";
import { JobPostingForm } from "@/components/JobPostingForm";

export default function NewJobPostingPage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const createJobPosting = useCreateJobPosting();

  useEffect(() => {
    if (!isAuthLoading && !company) {
      router.replace("/company/login");
    }
  }, [isAuthLoading, company, router]);

  if (isAuthLoading || !company) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <Link href="/company/job-postings" className="text-sm text-zinc-500 underline">
        ← 求人管理に戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">求人を新規作成</h1>

      <JobPostingForm
        submitLabel="作成する"
        onSubmit={async (input) => {
          const jobPosting = await createJobPosting.mutateAsync(input);
          router.push(`/company/job-postings/${jobPosting.id}/edit`);
        }}
      />
    </div>
  );
}
