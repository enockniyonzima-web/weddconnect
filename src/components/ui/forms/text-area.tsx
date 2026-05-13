"use client";

import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
import type { InputSize } from "./text-input";

const SIZE_TEXTAREA: Record<InputSize, string> = {
  sm: "text-xs px-3 py-2",
  md: "text-sm px-3 py-2.5",
  lg: "text-base px-4 py-3",
};
const SIZE_LABEL: Record<InputSize, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

export const TextAreaInput = ({
  label,
  placeholder,
  name,
  required = false,
  size = "md",
  action,
  maxWords,
  defaultValue,
  rows = 4,
  className,
}: {
  label?: string;
  placeholder?: string;
  name: string;
  required?: boolean;
  size?: InputSize;
  action?: (e: string) => unknown;
  maxWords?: number;
  defaultValue?: string | null;
  rows?: number;
  className?: string;
}) => {
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState(defaultValue ?? "");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (!maxWords || words.length <= maxWords) {
      setText(val);
      setWordCount(words.length);
      action?.(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {(label || maxWords) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={name}
              className={cn("font-semibold uppercase tracking-wider text-gray-400", SIZE_LABEL[size])}
            >
              {label}
              {required && <span className="ml-1 text-blue-600">*</span>}
            </label>
          )}
          {maxWords && (
            <span className={cn(
              "text-xs font-medium transition-colors tabular-nums",
              wordCount >= maxWords ? "text-amber-400" : "text-gray-400/50"
            )}>
              {wordCount} / {maxWords}
            </span>
          )}
        </div>
      )}
      <textarea
        id={name}
        name={name}
        required={required}
        value={text}
        rows={rows}
        placeholder={placeholder}
        onChange={handleChange}
        className={cn(
          "w-full rounded-lg border bg-gray-900 text-white resize-y",
          "border-white/10 placeholder:text-gray-400/40",
          "focus:outline-none focus:border-blue-600/60 focus:ring-1 focus:ring-blue-600/30",
          "hover:border-white/20",
          "disabled:cursor-not-allowed disabled:opacity-40",
          "transition-colors duration-200",
          SIZE_TEXTAREA[size],
          className
        )}
      />
    </div>
  );
};

/** @deprecated Use TextAreaInput */
export const TextAreaInputGroup = TextAreaInput;
