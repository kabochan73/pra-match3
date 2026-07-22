"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import {
  EMPLOYMENT_TYPE_LABELS,
  POSITION_LEVEL_LABELS,
  WORK_STYLE_LABELS,
  formatSalary,
  useApplyToJobPosting,
  useJobPosting,
} from "@/lib/job-postings";

function ApplySection({ jobPostingId }: { jobPostingId: number }) {
  const { user, company, isLoading } = useAuth();
  const applyMutation = useApplyToJobPosting(jobPostingId);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  if (isLoading) {
    return null;
  }

  if (!user) {
    if (company) {
      return (
        <p className="text-sm text-zinc-500">企業アカウントは求人に応募できません。</p>
      );
    }
    return (
      <Link
        href="/seeker/login"
        className="inline-block rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        ログインして応募する
      </Link>
    );
  }

  if (result?.type === "success") {
    return <p className="text-sm text-green-600">{result.text}</p>;
  }

  async function handleApply() {
    setResult(null);
    try {
      await applyMutation.mutateAsync();
      setResult({ type: "success", text: "応募しました。企業からの返答をお待ちください。" });
    } catch (error) {
      const text =
        error instanceof ApiError
          ? error.message
          : "応募に失敗しました。時間をおいて再度お試しください。";
      setResult({ type: "error", text });
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleApply}
        disabled={applyMutation.isPending}
        className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {applyMutation.isPending ? "応募中..." : "気になる(応募する)"}
      </button>
      {result?.type === "error" && <p className="text-sm text-red-600">{result.text}</p>}
    </div>
  );
}

export default function JobPostingDetailPage() {
  const params = useParams<{ id: string }>();
  const jobPostingId = Number(params.id);
  const isValidId = Number.isFinite(jobPostingId);
  const { data: jobPosting, isLoading, isError } = useJobPosting(jobPostingId);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <Link href="/jobs" className="text-sm text-zinc-500 underline">
        ← 求人一覧に戻る
      </Link>

      {!isValidId && (
        <p className="mt-6 text-sm text-red-600">求人が見つかりませんでした。</p>
      )}
      {isValidId && isLoading && <p className="mt-6 text-sm text-zinc-500">読み込み中...</p>}
      {isValidId && isError && (
        <p className="mt-6 text-sm text-red-600">求人の取得に失敗しました。</p>
      )}

      {jobPosting && (
        <div className="mt-6 flex flex-col gap-6">
          <div>
            <p className="text-sm text-zinc-500">{jobPosting.company?.name}</p>
            <h1 className="mt-1 text-2xl font-semibold">{jobPosting.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}</span>
              <span>{WORK_STYLE_LABELS[jobPosting.work_style]}</span>
              {jobPosting.position_level && (
                <span>{POSITION_LEVEL_LABELS[jobPosting.position_level]}</span>
              )}
              {jobPosting.prefecture && <span>{jobPosting.prefecture}</span>}
              <span>{formatSalary(jobPosting.salary_min, jobPosting.salary_max)}</span>
            </div>
            {jobPosting.skills && jobPosting.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {jobPosting.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {jobPosting.description}
          </p>

          <ApplySection key={jobPosting.id} jobPostingId={jobPosting.id} />
        </div>
      )}
    </div>
  );
}
