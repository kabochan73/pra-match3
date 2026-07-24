import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type Paginated } from "./api";
import type { EmploymentType, JobPosting, PositionLevel, WorkStyle } from "./job-postings";

export type JobPostingStatus = "draft" | "published" | "closed";

export const JOB_POSTING_STATUS_LABELS: Record<JobPosting["status"], string> = {
  draft: "下書き",
  published: "公開中",
  unpublished: "非公開(未払い)",
  closed: "募集終了",
};

export type JobPostingInput = {
  title: string;
  description: string;
  employment_type: EmploymentType;
  work_style: WorkStyle;
  position_level: PositionLevel | null;
  min_experience_years: number | null;
  prefecture: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: JobPostingStatus;
  skill_ids: number[];
};

const listQueryKey = ["company-job-postings"] as const;

export function useCompanyJobPostings(page: number) {
  return useQuery({
    queryKey: [...listQueryKey, page],
    queryFn: () =>
      apiFetch<Paginated<JobPosting>>(`/api/company/job-postings?page=${page}`),
  });
}

export function useCompanyJobPosting(id: number) {
  return useQuery({
    queryKey: [...listQueryKey, "detail", id],
    queryFn: () =>
      apiFetch<{ data: JobPosting }>(`/api/company/job-postings/${id}`).then(
        (response) => response.data,
      ),
    enabled: Number.isFinite(id),
  });
}

export function useCreateJobPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: JobPostingInput) =>
      apiFetch<{ data: JobPosting }>("/api/company/job-postings", {
        method: "POST",
        body: input,
      }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
  });
}

export function useUpdateJobPosting(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<JobPostingInput>) =>
      apiFetch<{ data: JobPosting }>(`/api/company/job-postings/${id}`, {
        method: "PATCH",
        body: input,
      }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
  });
}

export function useDeleteJobPosting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/api/company/job-postings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
  });
}
