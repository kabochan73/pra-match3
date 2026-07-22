import { useQuery } from "@tanstack/react-query";
import { apiFetch, type Paginated } from "./api";

export type ApplicationStatus =
  | "applied"
  | "matched"
  | "expired"
  | "screening"
  | "interviewing"
  | "offered"
  | "rejected"
  | "withdrawn";

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "応募済み(企業の返答待ち)",
  matched: "マッチ成立",
  expired: "マッチ不成立",
  screening: "書類選考中",
  interviewing: "面接調整中",
  offered: "内定",
  rejected: "不採用",
  withdrawn: "辞退",
};

export const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  matched: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  screening: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  interviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  offered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  expired: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  withdrawn: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export interface Application {
  id: number;
  status: ApplicationStatus;
  applied_at: string;
  response_deadline: string | null;
  company_responded_at: string | null;
  job_posting: {
    id: number;
    title: string;
    company: { name: string | null };
  };
}

export function useApplications(page: number) {
  return useQuery({
    queryKey: ["applications", page],
    queryFn: () => apiFetch<Paginated<Application>>(`/api/applications?page=${page}`),
  });
}
