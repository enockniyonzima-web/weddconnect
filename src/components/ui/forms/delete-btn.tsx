"use client";

import { ComponentProps, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";
import type { InputSize } from "./text-input";

/* ── size maps ──────────────────────────────────────────────── */

const SIZE_TRIGGER: Record<InputSize, string> = {
  sm: "h-8 px-4 text-xs gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const ICON_SIZE: Record<InputSize, number> = { sm: 14, md: 16, lg: 18 };

/* ── variant styles (all danger‑red) ─────────────────────────── */

const VARIANT_STYLES = {
  primary:
    "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500",
  secondary:
    "border border-red-500/25 text-red-400 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-300",
  ghost:
    "text-red-400 bg-transparent hover:text-red-300 hover:bg-red-500/10",
};

/* ── component ──────────────────────────────────────────────── */

export const DeleteBtn = ({
  label = "Delete",
  confirmTitle = "Confirm Deletion",
  confirmMessage = "This action is permanent and cannot be undone. Are you sure you want to proceed?",
  size = "md",
  loading = false,
  fullWidth = true,
  variant = "primary",
  className,
  onClick,
  ...props
}: {
  label?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  size?: InputSize;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
} & Omit<ComponentProps<"button">, "type" | "onClick">) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const busy = loading || deleting;

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setDeleting(true);
      await onClick?.(e);
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* ── Trigger button ──────────────────────────────── */}
      <button
        type="button"
        disabled={busy || props.disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold",
          "transition-all duration-200 active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          fullWidth && "w-full",
          SIZE_TRIGGER[size],
          VARIANT_STYLES[variant],
          className,
        )}
        {...props}
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={2} />
        ) : (
          <Trash2 size={ICON_SIZE[size]} strokeWidth={2} className="shrink-0" />
        )}
        {label}
      </button>

      {/* ── Confirmation dialog ─────────────────────────── */}
      <Dialog open={open} onClose={() => !busy && setOpen(false)} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        {/* Centering container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50">
            {/* Top danger accent */}
            <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-red-600 via-red-500 to-red-600/50" />

            {/* Decorative glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden="true">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-red-600/8 blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative flex items-start justify-between gap-3 px-6 pt-6 pb-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={20} strokeWidth={2} className="text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-white">{confirmTitle}</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                title="Close"
                className="flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-gray-400 cursor-pointer transition-all hover:bg-white/10 hover:text-white hover:border-white/20 disabled:opacity-50"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div className="relative px-6 py-5">
              <p className="text-sm leading-relaxed text-gray-400">{confirmMessage}</p>
            </div>

            {/* Actions */}
            <div className="relative flex items-center gap-3 border-t border-white/5 bg-gray-900/80 px-6 py-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className={cn(
                  "flex-1 inline-flex items-center justify-center rounded-lg font-medium",
                  "transition-all duration-200 active:scale-[0.98]",
                  "border border-white/10 text-white bg-white/5 hover:bg-white/10 hover:text-white",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  SIZE_TRIGGER[size],
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
                  "transition-all duration-200 active:scale-[0.98]",
                  "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-500",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  SIZE_TRIGGER[size],
                )}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={2} />
                ) : (
                  <Trash2 size={ICON_SIZE[size]} strokeWidth={2} className="shrink-0" />
                )}
                {busy ? "Deleting…" : label}
              </button>
            </div>

            {/* Bottom accent */}
            <div className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};