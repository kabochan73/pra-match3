import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type Paginated } from "./api";

export type EmploymentType = "full_time" | "part_time" | "contract";
export type WorkStyle = "remote" | "onsite" | "hybrid";
export type PositionLevel = "junior" | "mid" | "senior";

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "正社員",
  part_time: "アルバイト・パート",
  contract: "契約社員",
};

export const WORK_STYLE_LABELS: Record<WorkStyle, string> = {
  remote: "リモート",
  onsite: "出社",
  hybrid: "ハイブリッド",
};

export const POSITION_LEVEL_LABELS: Record<PositionLevel, string> = {
  junior: "ジュニア",
  mid: "ミドル",
  senior: "シニア",
};

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  employment_type: EmploymentType;
  work_style: WorkStyle;
  position_level: PositionLevel | null;
  min_experience_years: number | null;
  prefecture: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: "draft" | "published" | "unpublished" | "closed";
  published_at: string | null;
  company?: { id: number; name: string; prefecture: string | null };
  skills?: { id: number; name: string }[];
}

export interface JobSearchFilters {
  keyword?: string;
  employment_type?: EmploymentType | "";
  work_style?: WorkStyle | "";
  prefecture?: string;
  salary_min?: string;
  salary_max?: string;
  page?: number;
}

function buildQueryString(filters: JobSearchFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function useJobPostings(filters: JobSearchFilters) {
  return useQuery({
    queryKey: ["job-postings", filters],
    queryFn: () =>
      apiFetch<Paginated<JobPosting>>(`/api/job-postings${buildQueryString(filters)}`),
  });
}

export function useJobPosting(id: number) {
  return useQuery({
    queryKey: ["job-postings", id],
    queryFn: () =>
      apiFetch<{ data: JobPosting }>(`/api/job-postings/${id}`).then((response) => response.data),
    enabled: Number.isFinite(id),
  });
}

export function formatSalary(min: number | null, max: number | null): string {
  if (min === null && max === null) {
    return "給与応相談";
  }
  const format = (value: number) => `${Math.round(value / 10000)}万円`;
  if (min !== null && max !== null) {
    return `${format(min)} 〜 ${format(max)}`;
  }
  return min !== null ? `${format(min)}〜` : `〜${format(max as number)}`;
}

export function useApplyToJobPosting(jobPostingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch(`/api/job-postings/${jobPostingId}/applications`, { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
