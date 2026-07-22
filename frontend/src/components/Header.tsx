"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Header() {
  const { user, company, isLoading, logoutUser, logoutCompany } = useAuth();
  const router = useRouter();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold">
          Match Portfolio
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/jobs">求人を探す</Link>
          {isLoading ? null : user ? (
            <>
              <Link href="/seeker/mypage">マイページ</Link>
              <span className="text-zinc-500">{user.name} さん</span>
              <button
                type="button"
                onClick={() => {
                  void logoutUser().then(() => router.push("/"));
                }}
                className="text-zinc-500 underline"
              >
                ログアウト
              </button>
            </>
          ) : company ? (
            <>
              <Link href="/company/mypage">マイページ</Link>
              <span className="text-zinc-500">{company.name} さん</span>
              <button
                type="button"
                onClick={() => {
                  void logoutCompany().then(() => router.push("/"));
                }}
                className="text-zinc-500 underline"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/seeker/login">求職者ログイン</Link>
              <Link href="/company/login">企業ログイン</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
