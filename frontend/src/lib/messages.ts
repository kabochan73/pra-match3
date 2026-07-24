import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, type Paginated } from "./api";

export type ParticipantType = "user" | "company";

export interface Message {
  id: number;
  sender_type: ParticipantType;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
}

function messagesQueryKey(basePath: string, applicationId: number) {
  return ["messages", basePath, applicationId] as const;
}

// `basePath` is "/api" for the job seeker endpoints and "/api/company" for
// the company ones — same shape, different auth guard on the backend.
export function useMessages(basePath: string, applicationId: number) {
  return useQuery({
    queryKey: messagesQueryKey(basePath, applicationId),
    queryFn: () =>
      apiFetch<Paginated<Message>>(`${basePath}/applications/${applicationId}/messages`),
    enabled: Number.isFinite(applicationId),
    refetchInterval: 5000,
  });
}

export function useSendMessage(basePath: string, applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      apiFetch<{ data: Message }>(`${basePath}/applications/${applicationId}/messages`, {
        method: "POST",
        body: { body },
      }).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesQueryKey(basePath, applicationId) });
    },
  });
}
