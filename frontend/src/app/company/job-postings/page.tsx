"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { formatSalary, type JobPosting } from "@/lib/job-postings";
import { JOB_POSTING_STATUS_LABELS, useCompanyJobPostings, useDeleteJobPosting } from "@/lib/company-job-postings";

const STATUS_BADGE_STYLES: Record<JobPosting["status"], string> = {
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  published: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  unpublished: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  closed: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function CompanyJobPostingsPage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !company) {
      router.replace("/company/login");
    }
  }, [isAuthLoading, company, router]);

  const { data, isLoading, isError } = useCompanyJobPostings(page);
  const deleteJobPosting = useDeleteJobPosting();

  if (isAuthLoading || !company) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  async function handleDelete(id: number) {
    if (!window.confirm("この求人を削除しますか?この操作は取り消せません。")) {
      return;
    }
    setDeleteError(null);
    try {
      await deleteJobPosting.mutateAsync(id);
    } catch (error) {
      setDeleteError(
        error instanceof ApiError ? error.message : "削除に失敗しました。時間をおいて再度お試しください。",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">求人管理</h1>
        <Link
          href="/company/job-postings/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          求人を新規作成
        </Link>
      </div>

      {deleteError && <p className="mt-4 text-sm text-red-600">{deleteError}</p>}

      <div className="mt-6 flex flex-col gap-4">
        {isLoading && <p className="text-sm text-zinc-500">読み込み中...</p>}
        {isError && <p className="text-sm text-red-600">求人の取得に失敗しました。</p>}
        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-zinc-500">まだ求人を投稿していません。</p>
        )}
        {data?.data.map((jobPosting) => (
          <div
            key={jobPosting.id}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-semibold">{jobPosting.title}</h2>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_STYLES[jobPosting.status]}`}
              >
                {JOB_POSTING_STATUS_LABELS[jobPosting.status]}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              {formatSalary(jobPosting.salary_min, jobPosting.salary_max)}
              {jobPosting.prefecture && ` ・ ${jobPosting.prefecture}`}
            </p>
            <div className="mt-4 flex gap-3 text-sm">
              <Link href={`/company/job-postings/${jobPosting.id}/edit`} className="underline">
                編集
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(jobPosting.id)}
                disabled={deleteJobPosting.isPending}
                className="text-red-600 underline disabled:opacity-50"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            disabled={data.meta.current_page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:opacity-40 dark:border-zinc-700"
          >
            前へ
          </button>
          <span className="text-zinc-500">
            {data.meta.current_page} / {data.meta.last_page}
          </span>
          <button
            type="button"
            disabled={data.meta.current_page >= data.meta.last_page}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:opacity-40 dark:border-zinc-700"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
