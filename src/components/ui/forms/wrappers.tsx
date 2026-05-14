"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Grid2InputWrapper = ({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {title && (
      <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600">{title}</h3>
    )}
    <div className="w-full grid lg:grid-cols-2 gap-4 items-end">{children}</div>
  </div>
);

export const Grid3InputWrapper = ({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {title && (
      <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600">{title}</h3>
    )}
    <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">{children}</div>
  </div>
);

export const ColumnInputWrapper = ({
  title,
  children,
  actionBtn,
  className,
}: {
  title?: string;
  children: ReactNode;
  actionBtn?: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {(title || actionBtn) && (
      <div className="flex items-center justify-between gap-2">
        {title && (
          <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600">{title}</h3>
        )}
        {actionBtn && <div>{actionBtn}</div>}
      </div>
    )}
    {children}
  </div>
);

export const FormSection = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-5 p-6 rounded-2xl border border-white/8 bg-gray-900", className)}>
    <div className="border-b border-white/8 pb-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>}
    </div>
    {children}
  </div>
);
