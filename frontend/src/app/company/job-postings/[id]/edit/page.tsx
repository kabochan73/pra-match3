"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCompanyJobPosting, useUpdateJobPosting } from "@/lib/company-job-postings";
import { JobPostingForm } from "@/components/JobPostingForm";

export default function EditJobPostingPage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobPostingId = Number(params.id);

  useEffect(() => {
    if (!isAuthLoading && !company) {
      router.replace("/company/login");
    }
  }, [isAuthLoading, company, router]);

  const {
    data: jobPosting,
    isLoading: isJobPostingLoading,
    isError,
  } = useCompanyJobPosting(jobPostingId);
  const updateJobPosting = useUpdateJobPosting(jobPostingId);

  if (isAuthLoading || !company || isJobPostingLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  if (isError || !jobPosting) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-red-600">
        求人が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <Link href="/company/job-postings" className="text-sm text-zinc-500 underline">
        ← 求人管理に戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">求人を編集</h1>

      <JobPostingForm
        initialJobPosting={jobPosting}
        submitLabel="保存する"
        onSubmit={async (input) => {
          await updateJobPosting.mutateAsync(input);
        }}
      />
    </div>
  );
}
