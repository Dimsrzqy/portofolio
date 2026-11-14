"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, LogOut, X, Loader2 } from "lucide-react";

export type ModalVariant = "danger" | "warning" | "primary";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  isLoading?: boolean;
  icon?: "danger" | "trash" | "logout" | React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "danger",
  isLoading = false,
  icon,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;

    if (icon === "logout") {
      return <LogOut className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    }

    if (icon === "trash" || variant === "danger") {
      return <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />;
    }

    return <AlertTriangle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
  };

  const getBadgeStyle = () => {
    if (icon === "logout" || variant === "warning") {
      return "bg-amber-100 dark:bg-amber-950/70 border-amber-500/80 text-amber-600 dark:text-amber-400 shadow-[2px_2px_0px_0px_#d97706]";
    }
    if (variant === "danger") {
      return "bg-red-100 dark:bg-red-950/70 border-red-500/80 text-red-600 dark:text-red-400 shadow-[2px_2px_0px_0px_#dc2626]";
    }
    return "bg-indigo-100 dark:bg-indigo-950/70 border-indigo-500/80 text-indigo-600 dark:text-indigo-400 shadow-[2px_2px_0px_0px_#4f46e5]";
  };

  const getConfirmButtonClass = () => {
    if (icon === "logout" || variant === "warning") {
      return "comic-btn bg-amber-600 hover:bg-amber-700 text-white";
    }
    if (variant === "danger") {
      return "comic-btn bg-red-600 hover:bg-red-700 text-white";
    }
    return "comic-btn bg-indigo-600 hover:bg-indigo-700 text-white";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="comic-panel relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 shadow-[6px_6px_0px_0px_#09090b] dark:shadow-[6px_6px_0px_0px_rgba(99,102,241,0.5)] p-5 sm:p-6 animate-in zoom-in-95 duration-150"
      >
        {/* Header / Dismiss */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 ${getBadgeStyle()}`}
          >
            {renderIcon()}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="comic-panel-sm p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3
            id="confirm-modal-title"
            className="text-lg font-black text-zinc-950 dark:text-zinc-50 tracking-tight"
          >
            {title}
          </h3>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            {description}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="comic-panel-sm px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${getConfirmButtonClass()}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
