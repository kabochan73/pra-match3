"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_STYLES,
  useApplications,
} from "@/lib/applications";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("ja-JP");
}

export default function ApplicationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/seeker/login");
    }
  }, [isAuthLoading, user, router]);

  const { data, isLoading, isError } = useApplications(page);

  if (isAuthLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-semibold">応募状況</h1>

      <div className="mt-6 flex flex-col gap-4">
        {isLoading && <p className="text-sm text-zinc-500">読み込み中...</p>}
        {isError && <p className="text-sm text-red-600">応募状況の取得に失敗しました。</p>}
        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-zinc-500">
            まだ応募した求人がありません。
            <Link href="/jobs" className="ml-1 underline">
              求人を探す
            </Link>
          </p>
        )}
        {data?.data.map((application) => (
          <Link
            key={application.id}
            href={`/jobs/${application.job_posting.id}`}
            className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-500">{application.job_posting.company.name}</p>
                <h2 className="mt-1 text-base font-semibold">{application.job_posting.title}</h2>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${APPLICATION_STATUS_STYLES[application.status]}`}
              >
                {APPLICATION_STATUS_LABELS[application.status]}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span>応募日: {formatDate(application.applied_at)}</span>
              {application.status === "applied" && application.response_deadline && (
                <span>回答期限: {formatDate(application.response_deadline)}</span>
              )}
            </div>
          </Link>
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
