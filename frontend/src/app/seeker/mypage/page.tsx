"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function MyPage() {
  const { user, isLoading, logoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/seeker/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
      <h1 className="text-2xl font-semibold">マイページ</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">氏名</dt>
          <dd>{user.name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">メール</dt>
          <dd>{user.email}</dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={() => {
          void logoutUser().then(() => router.push("/"));
        }}
        className="mt-8 rounded-md border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-700"
      >
        ログアウト
      </button>
    </div>
  );
}
