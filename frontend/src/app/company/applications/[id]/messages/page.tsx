"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MessageThread } from "@/components/MessageThread";

export default function CompanyApplicationMessagesPage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const applicationId = Number(params.id);

  useEffect(() => {
    if (!isAuthLoading && !company) {
      router.replace("/company/login");
    }
  }, [isAuthLoading, company, router]);

  if (isAuthLoading || !company) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <Link href="/company/job-postings" className="text-sm text-zinc-500 underline">
        ← 求人管理に戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">メッセージ</h1>

      <MessageThread basePath="/api/company" applicationId={applicationId} currentParticipant="company" />
    </div>
  );
}
