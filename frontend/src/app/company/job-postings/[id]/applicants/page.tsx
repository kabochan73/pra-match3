"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_STYLES } from "@/lib/applications";
import { useApplicants, useMatchApplication, type CompanyApplicant } from "@/lib/company-applicants";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("ja-JP");
}

export default function ApplicantsPage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const jobPostingId = Number(params.id);
  const [page, setPage] = useState(1);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !company) {
      router.replace("/company/login");
    }
  }, [isAuthLoading, company, router]);

  const { data, isLoading, isError } = useApplicants(jobPostingId, page);
  const matchApplication = useMatchApplication(jobPostingId);

  if (isAuthLoading || !company) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  async function handleMatch(applicant: CompanyApplicant) {
    setMatchError(null);
    try {
      await matchApplication.mutateAsync(applicant.id);
    } catch (error) {
      setMatchError(
        error instanceof ApiError ? error.message : "処理に失敗しました。時間をおいて再度お試しください。",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <Link href="/company/job-postings" className="text-sm text-zinc-500 underline">
        ← 求人管理に戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">応募者一覧</h1>

      {matchError && <p className="mt-4 text-sm text-red-600">{matchError}</p>}

      <div className="mt-6 flex flex-col gap-4">
        {isLoading && <p className="text-sm text-zinc-500">読み込み中...</p>}
        {isError && <p className="text-sm text-red-600">応募者の取得に失敗しました。</p>}
        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-zinc-500">まだ応募はありません。</p>
        )}
        {data?.data.map((applicant) => (
          <div
            key={applicant.id}
            className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold">{applicant.user.name}</h2>
                {applicant.user.bio && (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {applicant.user.bio}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${APPLICATION_STATUS_STYLES[applicant.status]}`}
              >
                {APPLICATION_STATUS_LABELS[applicant.status]}
              </span>
            </div>

            {applicant.user.skills && applicant.user.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {applicant.user.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs dark:border-zinc-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span>応募日: {formatDate(applicant.applied_at)}</span>
              {applicant.status === "applied" && applicant.response_deadline && (
                <span>回答期限: {formatDate(applicant.response_deadline)}</span>
              )}
            </div>

            {applicant.status === "applied" && (
              <button
                type="button"
                onClick={() => handleMatch(applicant)}
                disabled={matchApplication.isPending}
                className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                気になるを送る(マッチ成立)
              </button>
            )}
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
