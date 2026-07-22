"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, type JobSeeker } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { useSkills } from "@/lib/skills";

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/seeker/login");
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-16 text-sm text-zinc-500">
        読み込み中...
      </div>
    );
  }

  return <ProfileForm user={user} />;
}

// Only mounted once `user` is known, so form state can be initialized
// straight from it — no effect needed to sync state that starts empty.
function ProfileForm({ user }: { user: JobSeeker }) {
  const { updateProfile } = useAuth();
  const { data: skills } = useSkills();

  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number ?? "");
  // The API returns birthdate as a full ISO datetime, but <input type="date">
  // only accepts a bare "YYYY-MM-DD".
  const [birthdate, setBirthdate] = useState(user.birthdate?.slice(0, 10) ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [skillIds, setSkillIds] = useState<number[]>(
    user.skills?.map((skill) => skill.id) ?? [],
  );

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleSkill(skillId: number) {
    setSkillIds((current) =>
      current.includes(skillId)
        ? current.filter((id) => id !== skillId)
        : [...current, skillId],
    );
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSaved(false);
    setIsSubmitting(true);
    try {
      await updateProfile({
        name,
        phone_number: phoneNumber || null,
        birthdate: birthdate || null,
        bio: bio || null,
        skill_ids: skillIds,
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
      <Link href="/seeker/mypage" className="text-sm text-zinc-500 underline">
        ← マイページに戻る
      </Link>

      <h1 className="mt-4 text-2xl font-semibold">プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            氏名
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
            htmlFor="birthdate"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            生年月日
          </label>
          <input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.birthdate?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            自己紹介
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={5}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
          />
          {errors.bio?.map((error) => (
            <p key={error} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">スキル</span>
          <div className="flex flex-wrap gap-3">
            {skills?.map((skill) => (
              <label
                key={skill.id}
                className="flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={skillIds.includes(skill.id)}
                  onChange={() => toggleSkill(skill.id)}
                />
                {skill.name}
              </label>
            ))}
          </div>
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
