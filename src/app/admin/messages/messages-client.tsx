"use client";

import React, { useState } from "react";
import { Message } from "@/types";
import { deleteMessageAction } from "@/app/actions/admin";
import { Mail, Trash2, Calendar, Reply, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus pesan ini dari inbox?")) return;

    setIsDeleting(id);
    const res = await deleteMessageAction(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    } else {
      alert(`Gagal menghapus pesan: ${res.message}`);
    }
    setIsDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Messages Inbox
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Pesan masuk dari pengunjung melalui formulir kontak di landing page.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-500">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
            Kotak Masuk Kosong
          </h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Belum ada pesan yang diterima. Ketika seseorang mengirim pesan melalui formulir kontak, pesan akan otomatis masuk ke sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h2 className="font-semibold text-sm text-zinc-950 dark:text-white">
                    {item.name}
                  </h2>
                  <a
                    href={`mailto:${item.email}`}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {item.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>

                  <a
                    href={`mailto:${item.email}?subject=Re: Ingin terhubung&body=Halo ${item.name},%0D%0A%0D%0ATerima kasih sudah menghubungi saya.`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors min-h-[44px] sm:min-h-auto flex items-center"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </a>

                  <button
                    type="button"
                    disabled={isDeleting === item.id}
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-0 flex items-center justify-center"
                    title="Delete message"
                  >
                    {isDeleting === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
