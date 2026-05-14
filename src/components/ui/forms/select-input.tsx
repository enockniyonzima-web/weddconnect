"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import type { InputSize } from "./text-input";

const SIZE_TRIGGER: Record<InputSize, string> = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
};
const SIZE_LABEL_CLASS: Record<InputSize, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};

export const SelectInput = ({
  label,
  name,
  required = false,
  size = "md",
  values,
  action,
  icon,
  placeholder,
  className,
  defaultValue,
}: {
  label?: string;
  name: string;
  required?: boolean;
  size?: InputSize;
  values: Array<{ label: string; value: string }>;
  action?: (res: string) => unknown;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className={cn("font-semibold uppercase tracking-wider text-gray-400", SIZE_LABEL_CLASS[size])}
        >
          {label}
          {required && <span className="ml-1 text-blue-600">*</span>}
        </label>
      )}
      <div className="relative w-full group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-gray-400/50 transition-colors group-focus-within:text-blue-600">
            {icon}
          </div>
        )}
        <Select
          onValueChange={(v: string) => action?.(v)}
          required={required}
          name={name}
          defaultValue={defaultValue}
        >
          <SelectTrigger
            className={cn(
              "w-full rounded-lg border bg-gray-900 text-white",
              "border-white/10",
              "hover:border-white/20",
              "focus:outline-none focus:border-blue-600/60 focus:ring-1 focus:ring-blue-600/30",
              "data-placeholder:text-gray-400/40",
              "transition-colors duration-200",
              SIZE_TRIGGER[size],
              icon ? "pl-9" : "pl-3",
              className
            )}
          >
            <SelectValue placeholder={placeholder ?? (label ? `Select ${label.toLowerCase()}` : "Select…")} />
          </SelectTrigger>
          <SelectContent className="max-h-[min(var(--radix-select-content-available-height),300px)] bg-gray-950 border border-white/10 text-white">
            <SelectGroup>
              {label && <SelectLabel className="text-xs text-gray-400/60 uppercase tracking-wider px-2 py-1.5">{label}</SelectLabel>}
              {values.map((v, i) => (
                <SelectItem
                  key={`${name}-${i}`}
                  value={v.value}
                  className="text-gray-400 hover:text-white focus:text-white focus:bg-blue-600/10 cursor-pointer"
                >
                  {v.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

/** @deprecated Use SelectInput */
export const SelectInputGroup = SelectInput;
