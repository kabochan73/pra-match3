"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, type Company } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function CompanyProfilePage() {
  const { company, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

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

  return <CompanyProfileForm company={company} />;
}

// Only mounted once `company` is known, so form state can be initialized
// straight from it — no effect needed to sync state that starts empty.
function CompanyProfileForm({ company }: { company: Company }) {
  const { updateCompanyProfile } = useAuth();

  const [name, setName] = useState(company.name);
  const [phoneNumber, setPhoneNumber] = useState(company.phone_number ?? "");
  const [prefecture, setPrefecture] = useState(company.prefecture ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(company.website_url ?? "");
  const [description, setDescription] = useState(company.description ?? "");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSaved(false);
    setIsSubmitting(true);
    try {
      await updateCompanyProfile({
        name,
        phone_number: phoneNumber || null,
        prefecture: prefecture || null,
        website_url: websiteUrl || null,
        description: description || null,
      });
      setIsSaved(true);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("更新に失敗しました。時間をおいて再度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <Link href="/company/mypage" className="text-sm text-zinc-500 underline">
        ← マイページに戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">企業プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            企業名
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.name?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="phone_number"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            電話番号
          </label>
          <input
            id="phone_number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.phone_number?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="prefecture"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            所在地(都道府県)
          </label>
          <input
            id="prefecture"
            value={prefecture}
            onChange={(event) => setPrefecture(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.prefecture?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="website_url"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            WebサイトURL
          </label>
          <input
            id="website_url"
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://example.com"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.website_url?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            企業紹介
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.description?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}
        {isSaved && <p className="text-sm text-green-600">プロフィールを更新しました。</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSubmitting ? "保存中..." : "保存する"}
        </button>
      </form>
    </div>
  );
}
