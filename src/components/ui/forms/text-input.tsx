/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { ComponentProps, ChangeEvent, useState } from "react";
import {
  User, Mail, Lock, Phone, Hash, Search, Calendar, Link2,
  Eye, EyeOff,  FileDigit,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Size system
// ─────────────────────────────────────────────────────────────────────────────
type InputSize = "sm" | "md" | "lg";

const SIZE_INPUT: Record<InputSize, string> = {
  sm: "h-8 text-xs px-3",
  md: "h-10 text-sm px-3",
  lg: "h-12 text-base px-4",
};
const SIZE_ICON: Record<InputSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};
const SIZE_LABEL: Record<InputSize, string> = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
};
const SIZE_ICON_LEFT: Record<InputSize, string> = {
  sm: "pl-8",
  md: "pl-9",
  lg: "pl-11",
};
const SIZE_ICON_RIGHT: Record<InputSize, string> = {
  sm: "pr-8",
  md: "pr-9",
  lg: "pr-11",
};
const SIZE_ICON_POS_L: Record<InputSize, string> = {
  sm: "left-2.5",
  md: "left-3",
  lg: "left-3.5",
};
const SIZE_ICON_POS_R: Record<InputSize, string> = {
  sm: "right-2.5",
  md: "right-3",
  lg: "right-3.5",
};

// ─────────────────────────────────────────────────────────────────────────────
// Base raw input — dark themed
// ─────────────────────────────────────────────────────────────────────────────
type BaseInputProps = Omit<ComponentProps<"input">, "size"> & {
  inputSize?: InputSize;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
};

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ className, inputSize = "md", hasLeftIcon, hasRightIcon, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-gray-900 text-white scheme-dark",
        "border-white/10 placeholder:text-gray-400/40",
        "focus:outline-none focus:border-blue-600/60 focus:ring-1 focus:ring-blue-600/30",
        "hover:border-white/20",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "transition-colors duration-200",
        SIZE_INPUT[inputSize],
        hasLeftIcon && SIZE_ICON_LEFT[inputSize],
        hasRightIcon && SIZE_ICON_RIGHT[inputSize],
        className
      )}
      {...props}
    />
  )
);
BaseInput.displayName = "BaseInput";

// ─────────────────────────────────────────────────────────────────────────────
// Shared label
// ─────────────────────────────────────────────────────────────────────────────
const FieldLabel = ({
  htmlFor,
  size = "md",
  required,
  children,
}: {
  htmlFor?: string;
  size?: InputSize;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "font-semibold uppercase tracking-wider text-gray-400",
      SIZE_LABEL[size]
    )}
  >
    {children}
    {required && <span className="ml-1 text-blue-600">*</span>}
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// Shared icon wrapper
// ─────────────────────────────────────────────────────────────────────────────
const LeftIcon = ({
  size = "md",
  children,
}: {
  size?: InputSize;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400/50 transition-colors group-focus-within:text-blue-600",
      SIZE_ICON_POS_L[size]
    )}
  >
    {React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<{ className?: string }>, {
          className: cn(SIZE_ICON[size], (children as React.ReactElement<{ className?: string }>).props.className),
        })
      : children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. TextInput — plain text / name / generic
// ─────────────────────────────────────────────────────────────────────────────
export const TextInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><User /></LeftIcon>
      <BaseInput
        type="text"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        className={className}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. EmailInput
// ─────────────────────────────────────────────────────────────────────────────
export const EmailInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Mail /></LeftIcon>
      <BaseInput
        type="email"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        autoComplete="email"
        className={className}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. PasswordInput
// ─────────────────────────────────────────────────────────────────────────────
export const PasswordInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
      <div className="relative group">
        <LeftIcon size={size}><Lock /></LeftIcon>
        <BaseInput
          type={show ? "text" : "password"}
          id={name}
          name={name}
          inputSize={size}
          required={required}
          hasLeftIcon
          hasRightIcon
          autoComplete="current-password"
          className={className}
          onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-gray-400/50 hover:text-blue-600 transition-colors focus:outline-none",
            SIZE_ICON_POS_R[size]
          )}
        >
          {show
            ? <EyeOff className={SIZE_ICON[size]} strokeWidth={1.5} />
            : <Eye className={SIZE_ICON[size]} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PhoneInput
// ─────────────────────────────────────────────────────────────────────────────
export const PhoneInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Phone /></LeftIcon>
      <BaseInput
        type="tel"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        autoComplete="tel"
        className={className}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. NumberInput
// ─────────────────────────────────────────────────────────────────────────────
export const NumberInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: number | string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Hash /></LeftIcon>
      <BaseInput
        type="number"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        className={cn("[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", className)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 6. DateInput
// ─────────────────────────────────────────────────────────────────────────────
export const DateInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Calendar /></LeftIcon>
      <BaseInput
        type="date"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        className={cn("scheme-dark", className)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 7. SearchInput
// ─────────────────────────────────────────────────────────────────────────────
export const SearchInput = ({
  label,
  name,
  size = "md",
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Search /></LeftIcon>
      <BaseInput
        type="search"
        id={name}
        name={name}
        inputSize={size}
        hasLeftIcon
        className={cn("[&::-webkit-search-cancel-button]:hidden", className)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. UrlInput
// ─────────────────────────────────────────────────────────────────────────────
export const UrlInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Link2 /></LeftIcon>
      <BaseInput
        type="url"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        className={className}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. ReferenceInput — for tracking refs, IDs, codes (alphanumeric)
// ─────────────────────────────────────────────────────────────────────────────
export const ReferenceInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><FileDigit /></LeftIcon>
      <BaseInput
        type="text"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        autoCapitalize="characters"
        className={cn("font-mono tracking-wider uppercase", className)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value.toUpperCase())}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 10. NameInput — specifically for person names
// ─────────────────────────────────────────────────────────────────────────────
export const NameInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><User /></LeftIcon>
      <BaseInput
        type="text"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        autoComplete="name"
        autoCapitalize="words"
        className={className}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 11. WeightInput — numeric with "kg" unit badge
// ─────────────────────────────────────────────────────────────────────────────
export const WeightInput = ({
  label,
  name,
  size = "md",
  required,
  action,
  unit = "kg",
  className,
  ...props
}: {
  label?: string;
  name: string;
  size?: InputSize;
  unit?: string;
  action?: (v: string) => unknown;
} & Omit<ComponentProps<"input">, "type" | "name" | "size">) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <FieldLabel htmlFor={name} size={size} required={required}>{label}</FieldLabel>}
    <div className="relative group">
      <LeftIcon size={size}><Hash /></LeftIcon>
      <BaseInput
        type="number"
        id={name}
        name={name}
        inputSize={size}
        required={required}
        hasLeftIcon
        hasRightIcon
        min={0}
        step="0.01"
        className={cn(
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          SIZE_ICON_RIGHT[size],
          className
        )}
        onChange={(e: ChangeEvent<HTMLInputElement>) => action?.(e.target.value)}
        {...props}
      />
      <div
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400/50 uppercase tracking-wider",
          SIZE_ICON_POS_R[size]
        )}
      >
        {unit}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Legacy export aliases — keep old names working during migration
// ─────────────────────────────────────────────────────────────────────────────
export const TextInputGroup = TextInput;

export const PasswordInputGroup = PasswordInput;

/** @deprecated Use specific input components instead */
export const getIconForType = (_type?: string) => null;

/** Exported size type for consumers */
export type { InputSize };