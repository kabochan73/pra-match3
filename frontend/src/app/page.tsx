import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 px-4 py-24 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          エンジニアのための求人マッチング
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          気になる求人に「いいね」するだけ。企業が7日以内に反応すればマッチ成立です。
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/seeker/register"
          className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          求職者として登録
        </Link>
        <Link
          href="/company/register"
          className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium dark:border-zinc-700"
        >
          企業として登録
        </Link>
      </div>
    </main>
  );
}
