import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type Paginated } from "./api";
import type { JobSeeker } from "./auth-context";
import type { ApplicationStatus } from "./applications";

export interface CompanyApplicant {
  id: number;
  status: ApplicationStatus;
  applied_at: string;
  response_deadline: string | null;
  company_responded_at: string | null;
  user: JobSeeker;
}

function applicantsQueryKey(jobPostingId: number) {
  return ["company-applicants", jobPostingId] as const;
}

export function useApplicants(jobPostingId: number, page: number) {
  return useQuery({
    queryKey: [...applicantsQueryKey(jobPostingId), page],
    queryFn: () =>
      apiFetch<Paginated<CompanyApplicant>>(
        `/api/company/job-postings/${jobPostingId}/applicants?page=${page}`,
      ),
    enabled: Number.isFinite(jobPostingId),
  });
}

export function useMatchApplication(jobPostingId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) =>
      apiFetch<{ data: CompanyApplicant }>(`/api/company/applications/${applicationId}/match`, {
        method: "POST",
      }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicantsQueryKey(jobPostingId) });
    },
  });
}
