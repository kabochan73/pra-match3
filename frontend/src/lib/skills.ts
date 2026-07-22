import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api";

export interface Skill {
  id: number;
  name: string;
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: () => apiFetch<Skill[]>("/api/skills"),
    staleTime: 5 * 60 * 1000,
  });
}
