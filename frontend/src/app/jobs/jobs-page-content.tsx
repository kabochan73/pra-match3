"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EMPLOYMENT_TYPE_LABELS,
  POSITION_LEVEL_LABELS,
  WORK_STYLE_LABELS,
  formatSalary,
  useJobPostings,
  type EmploymentType,
  type WorkStyle,
} from "@/lib/job-postings";

export function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";
  const employmentType = (searchParams.get("employment_type") ?? "") as EmploymentType | "";
  const workStyle = (searchParams.get("work_style") ?? "") as WorkStyle | "";
  const prefecture = searchParams.get("prefecture") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const [keywordInput, setKeywordInput] = useState(keyword);
  const [employmentTypeInput, setEmploymentTypeInput] = useState(employmentType);
  const [workStyleInput, setWorkStyleInput] = useState(workStyle);
  const [prefectureInput, setPrefectureInput] = useState(prefecture);

  const { data, isLoading, isError } = useJobPostings({
    keyword,
    employment_type: employmentType,
    work_style: workStyle,
    prefecture,
    page,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keywordInput) params.set("keyword", keywordInput);
    if (employmentTypeInput) params.set("employment_type", employmentTypeInput);
    if (workStyleInput) params.set("work_style", workStyleInput);
    if (prefectureInput) params.set("prefecture", prefectureInput);
    router.push(`/jobs?${params.toString()}`);
  }

  function goToPage(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-semibold">求人を探す</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="text"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="キーワード(職種名など)"
          className="min-w-50 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <select
          value={employmentTypeInput}
          onChange={(event) =>
            setEmploymentTypeInput(event.target.value as EmploymentType | "")
          }
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">雇用形態(すべて)</option>
          {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={workStyleInput}
          onChange={(event) => setWorkStyleInput(event.target.value as WorkStyle | "")}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="">働き方(すべて)</option>
          {Object.entries(WORK_STYLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={prefectureInput}
          onChange={(event) => setPrefectureInput(event.target.value)}
          placeholder="勤務地(都道府県)"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          検索
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-4">
        {isLoading && <p className="text-sm text-zinc-500">読み込み中...</p>}
        {isError && <p className="text-sm text-red-600">求人の取得に失敗しました。</p>}
        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-zinc-500">条件に一致する求人が見つかりませんでした。</p>
        )}
        {data?.data.map((jobPosting) => (
          <Link
            key={jobPosting.id}
            href={`/jobs/${jobPosting.id}`}
            className="rounded-lg border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <p className="text-xs text-zinc-500">{jobPosting.company?.name}</p>
            <h2 className="mt-1 text-lg font-semibold">{jobPosting.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <span>{EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}</span>
              <span>{WORK_STYLE_LABELS[jobPosting.work_style]}</span>
              {jobPosting.position_level && (
                <span>{POSITION_LEVEL_LABELS[jobPosting.position_level]}</span>
              )}
              {jobPosting.prefecture && <span>{jobPosting.prefecture}</span>}
              <span>{formatSalary(jobPosting.salary_min, jobPosting.salary_max)}</span>
            </div>
          </Link>
        ))}
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            disabled={data.meta.current_page <= 1}
            onClick={() => goToPage(data.meta.current_page - 1)}
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
            onClick={() => goToPage(data.meta.current_page + 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:opacity-40 dark:border-zinc-700"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
