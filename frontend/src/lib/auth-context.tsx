"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "./api";

export interface JobSeeker {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  birthdate: string | null;
  bio: string | null;
  skills?: { id: number; name: string }[];
  created_at: string;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  description: string | null;
  website_url: string | null;
  prefecture: string | null;
  created_at: string;
}

const userQueryKey = ["auth", "user"] as const;
const companyQueryKey = ["auth", "company"] as const;

// A 401 here just means "not logged in as this role", which is a normal,
// valid state for this app (not every visitor is a job seeker, or a
// company) — so it resolves to null instead of surfacing as a query error.
async function fetchCurrentUser(): Promise<JobSeeker | null> {
  try {
    const { data } = await apiFetch<{ data: JobSeeker }>("/api/user");
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

async function fetchCurrentCompany(): Promise<Company | null> {
  try {
    const { data } = await apiFetch<{ data: Company }>("/api/company/user");
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

interface AuthContextValue {
  user: JobSeeker | null;
  company: Company | null;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginCompany: (email: string, password: string) => Promise<void>;
  registerCompany: (name: string, email: string, password: string) => Promise<void>;
  logoutCompany: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const userQuery = useQuery({ queryKey: userQueryKey, queryFn: fetchCurrentUser });
  const companyQuery = useQuery({ queryKey: companyQueryKey, queryFn: fetchCurrentCompany });

  const loginUserMutation = useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      apiFetch<JobSeeker>("/api/login", { method: "POST", body: vars }),
    onSuccess: (loggedInUser) => {
      queryClient.setQueryData(userQueryKey, loggedInUser);
    },
  });

  const registerUserMutation = useMutation({
    mutationFn: (vars: { name: string; email: string; password: string }) =>
      apiFetch<JobSeeker>("/api/register", { method: "POST", body: vars }),
    onSuccess: (newUser) => {
      queryClient.setQueryData(userQueryKey, newUser);
    },
  });

  const logoutUserMutation = useMutation({
    mutationFn: () => apiFetch("/api/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(userQueryKey, null);
    },
  });

  const loginCompanyMutation = useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      apiFetch<Company>("/api/company/login", { method: "POST", body: vars }),
    onSuccess: (loggedInCompany) => {
      queryClient.setQueryData(companyQueryKey, loggedInCompany);
    },
  });

  const registerCompanyMutation = useMutation({
    mutationFn: (vars: { name: string; email: string; password: string }) =>
      apiFetch<Company>("/api/company/register", { method: "POST", body: vars }),
    onSuccess: (newCompany) => {
      queryClient.setQueryData(companyQueryKey, newCompany);
    },
  });

  const logoutCompanyMutation = useMutation({
    mutationFn: () => apiFetch("/api/company/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(companyQueryKey, null);
    },
  });

  const loginUser = useCallback(
    async (email: string, password: string) => {
      await loginUserMutation.mutateAsync({ email, password });
    },
    [loginUserMutation],
  );

  const registerUser = useCallback(
    async (name: string, email: string, password: string) => {
      await registerUserMutation.mutateAsync({ name, email, password });
    },
    [registerUserMutation],
  );

  const logoutUser = useCallback(async () => {
    await logoutUserMutation.mutateAsync();
  }, [logoutUserMutation]);

  const loginCompany = useCallback(
    async (email: string, password: string) => {
      await loginCompanyMutation.mutateAsync({ email, password });
    },
    [loginCompanyMutation],
  );

  const registerCompany = useCallback(
    async (name: string, email: string, password: string) => {
      await registerCompanyMutation.mutateAsync({ name, email, password });
    },
    [registerCompanyMutation],
  );

  const logoutCompany = useCallback(async () => {
    await logoutCompanyMutation.mutateAsync();
  }, [logoutCompanyMutation]);

  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data ?? null,
        company: companyQuery.data ?? null,
        isLoading: userQuery.isLoading || companyQuery.isLoading,
        loginUser,
        registerUser,
        logoutUser,
        loginCompany,
        registerCompany,
        logoutCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
