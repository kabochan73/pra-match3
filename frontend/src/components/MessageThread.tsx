"use client";

import { useState, type SubmitEvent } from "react";
import { ApiError } from "@/lib/api";
import { useMessages, useSendMessage, type ParticipantType } from "@/lib/messages";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("ja-JP");
}

interface MessageThreadProps {
  basePath: string;
  applicationId: number;
  currentParticipant: ParticipantType;
}

export function MessageThread({ basePath, applicationId, currentParticipant }: MessageThreadProps) {
  const { data, isLoading, isError } = useMessages(basePath, applicationId);
  const sendMessage = useSendMessage(basePath, applicationId);

  const [body, setBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      return;
    }
    setFormError(null);
    try {
      await sendMessage.mutateAsync(body);
      setBody("");
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "送信に失敗しました。時間をおいて再度お試しください。",
      );
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {isLoading && <p className="text-sm text-zinc-500">読み込み中...</p>}
        {isError && <p className="text-sm text-red-600">メッセージの取得に失敗しました。</p>}
        {!isLoading && !isError && data?.data.length === 0 && (
          <p className="text-sm text-zinc-500">まだメッセージはありません。</p>
        )}
        {data?.data.map((message) => {
          const isOwnMessage = message.sender_type === currentParticipant;
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  isOwnMessage
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800"
                }`}
              >
                {message.body}
              </div>
              <span className="mt-1 text-xs text-zinc-500">
                {formatDateTime(message.created_at)}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={3}
          placeholder="メッセージを入力"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100"
        />
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <button
          type="submit"
          disabled={sendMessage.isPending || !body.trim()}
          className="self-start rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {sendMessage.isPending ? "送信中..." : "送信する"}
        </button>
      </form>
    </div>
  );
}
