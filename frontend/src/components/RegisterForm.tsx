"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { FormField } from "@/components/FormField";

interface RegisterFormProps {
  title: string;
  nameLabel: string;
  nameAutoComplete: string;
  loginHref: string;
  redirectTo: string;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

export function RegisterForm({
  title,
  nameLabel,
  nameAutoComplete,
  loginHref,
  redirectTo,
  onRegister,
}: RegisterFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    setIsSubmitting(true);
    try {
      await onRegister(name, email, password);
      router.push(redirectTo);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        setErrors(error.errors);
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError("登録に失敗しました。時間をおいて再度お試しください。");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          すでにアカウントをお持ちの方は
          <Link href={loginHref} className="ml-1 underline">
            ログイン
          </Link>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label={nameLabel}
          name="name"
          value={name}
          onChange={setName}
          errors={errors.name}
          autoComplete={nameAutoComplete}
        />
        <FormField
          label="メールアドレス"
          name="email"
          type="email"
          value={email}
          onChange={setEmail}
          errors={errors.email}
          autoComplete="email"
        />
        <FormField
          label="パスワード"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          errors={errors.password}
          autoComplete="new-password"
        />
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSubmitting ? "登録中..." : "登録する"}
        </button>
      </form>
    </div>
  );
}
