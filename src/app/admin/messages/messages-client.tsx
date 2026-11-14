"use client";

import React, { useState } from "react";
import { Message } from "@/types";
import { deleteMessageAction } from "@/app/actions/admin";
import {
  Mail,
  Trash2,
  Calendar,
  Reply,
  Loader2,
  Search,
  Copy,
  Check,
  MessageSquareQuote,
  Clock,
  Inbox,
  User,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function MessagesClient({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<{ id: string; name: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    const { id } = messageToDelete;
    setIsDeleting(id);
    const res = await deleteMessageAction(id);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
      setMessageToDelete(null);
    } else {
      alert(`Gagal menghapus pesan: ${res.message}`);
    }
    setIsDeleting(null);
  };

  const handleCopyEmail = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter messages by name, email, or content
  const filteredMessages = messages.filter((m) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      m.name.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query) ||
      m.message.toLowerCase().includes(query)
    );
  });

  // Helper initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & METRICS                                      */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950/10 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">
            <MessageSquareQuote className="w-3 h-3 text-indigo-500" />
            <span>COMMUNICATION LOG</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
            Messages Inbox
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Pesan dan penawaran kerja sama yang masuk melalui formulir kontak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="comic-panel-sm px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{messages.length} Total Pesan</span>
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH BAR                                                */}
      {/* ============================================================ */}
      {messages.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesan berdasarkan nama pengirim, email, atau isi pesan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MESSAGES LIST OR EMPTY STATE                              */}
      {/* ============================================================ */}
      {messages.length === 0 ? (
        <div className="comic-panel rounded-2xl bg-white dark:bg-zinc-900 p-12 text-center border-2 border-zinc-950 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#6366f1]">
            <Inbox className="w-8 h-8" />
          </div>
          <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-tight mb-1">
            Kotak Masuk Masih Kosong
          </h2>
          <p className="text-xs text-zinc-500 max-w-md mx-auto font-mono leading-relaxed">
            Belum ada pesan yang diterima. Ketika seseorang mengirim pesan melalui formulir kontak di beranda, pesan akan langsung tersimpan di Supabase dan muncul di sini secara real-time.
          </p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-8 text-center border-2 border-zinc-950 dark:border-zinc-800">
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            Tidak ada pesan yang cocok dengan &quot;{searchQuery}&quot;
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-mono text-indigo-600 dark:text-indigo-400 underline mt-2 cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((item) => (
            <div
              key={item.id}
              className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 sm:p-6 border-2 border-zinc-950 dark:border-zinc-800 space-y-4 hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors"
            >
              {/* Header: Sender & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b-2 border-zinc-100 dark:border-zinc-800">
                {/* Sender Info with Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black font-mono text-xs border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] shrink-0">
                    {getInitials(item.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-black text-sm text-zinc-950 dark:text-white uppercase tracking-tight truncate">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-zinc-500 truncate">
                        {item.email}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(item.id, item.email)}
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                        title="Salin email"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                  {/* Timestamp Tag */}
                  <span className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>

                  {/* Reply Button */}
                  <a
                    href={`mailto:${item.email}?subject=Re: Kontak Portofolio Dimas Rizqy&body=Halo ${item.name},%0D%0A%0D%0ATerima kasih telah menghubungi saya melalui portofolio.`}
                    className="comic-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[38px]"
                  >
                    <Reply className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Reply</span>
                  </a>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={isDeleting === item.id}
                    onClick={() => setMessageToDelete({ id: item.id, name: item.name })}
                    className="comic-panel-sm inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-2 border-zinc-950 dark:border-zinc-700 transition-colors cursor-pointer min-h-[38px] min-w-[38px]"
                    title="Hapus pesan"
                  >
                    {isDeleting === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Content Bubble */}
              <div className="p-4 rounded-xl border-2 border-zinc-950/10 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50">
                <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete Message */}
      <ConfirmModal
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDeleteMessage}
        isLoading={isDeleting === messageToDelete?.id}
        title="Hapus Pesan?"
        description={
          <>
            Pesan dari <span className="font-bold text-zinc-950 dark:text-zinc-100">&quot;{messageToDelete?.name}&quot;</span> akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.
          </>
        }
        confirmText="Ya, Hapus Pesan"
        cancelText="Batal"
        variant="danger"
        icon="trash"
      />
    </div>
  );
}
