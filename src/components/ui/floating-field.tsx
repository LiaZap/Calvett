"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Floating-label fields matched 1:1 with Figma node 146:5712 (Nova Receita).
 * - Field height: 63px, radius 10, bg #fcfcfa, border #f2f2ee
 * - Label centered at 14px Medium #959595 when empty, floats to 10px when raised
 * - Submit button is NOT full-width: 169px centered pill (Figma spec)
 */

const FIELD_HEIGHT = 63;
const LABEL_RAISED_TOP = 10;
const LABEL_CENTERED_TOP = 22;
const INPUT_TOP = 26;

type FloatingFieldBaseProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
};

function baseWrapper(focused: boolean, disabled?: boolean) {
  return `relative block rounded-[10px] border bg-[#fcfcfa] transition-all ${
    disabled
      ? "opacity-60 cursor-not-allowed border-[#f2f2ee]"
      : focused
        ? "border-[#47535f]/35 bg-white"
        : "border-[#f2f2ee] hover:border-[#e5e5e5]"
  }`;
}

function labelStyle(raised: boolean) {
  return {
    top: raised ? LABEL_RAISED_TOP : LABEL_CENTERED_TOP,
    fontSize: raised ? 11 : 14,
    fontWeight: 500,
    color: raised ? "#8a929a" : "#959595",
  };
}

export function FloatingField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  autoFocus,
  disabled,
  rightAdornment,
  leftAdornment,
}: FloatingFieldBaseProps & {
  type?: string;
  rightAdornment?: React.ReactNode;
  leftAdornment?: React.ReactNode;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  const inputLeft = leftAdornment ? 48 : 20;
  return (
    <label
      htmlFor={id}
      className={baseWrapper(focused, disabled)}
      style={{ height: FIELD_HEIGHT }}
    >
      {leftAdornment && (
        <span className="absolute left-[20px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[#47535f]">
          {leftAdornment}
        </span>
      )}
      <span
        className="absolute pointer-events-none font-[var(--font-jakarta)] transition-all duration-200"
        style={{ ...labelStyle(raised), left: inputLeft }}
      >
        {label}
        {required && <span className="text-[#c1846e] ml-[2px]">*</span>}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={raised ? placeholder : ""}
        required={required}
        autoFocus={autoFocus}
        disabled={disabled}
        className="absolute bg-transparent outline-none text-[14px] font-medium text-[#1e1e1e] placeholder:text-[#b4b4b4] font-[var(--font-jakarta)] disabled:cursor-not-allowed"
        style={{
          left: inputLeft,
          right: rightAdornment ? 40 : 20,
          top: INPUT_TOP,
          bottom: 8,
          opacity: raised ? 1 : 0,
        }}
      />
      {rightAdornment && (
        <span className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#47535f] font-[var(--font-jakarta)]">
          {rightAdornment}
        </span>
      )}
    </label>
  );
}

export function FloatingSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
}: FloatingFieldBaseProps & {
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  return (
    <label
      htmlFor={id}
      className={baseWrapper(focused, disabled)}
      style={{ height: FIELD_HEIGHT }}
    >
      <span
        className="absolute pointer-events-none font-[var(--font-jakarta)] transition-all duration-200"
        style={{ ...labelStyle(raised), left: 20 }}
      >
        {label}
        {required && <span className="text-[#c1846e] ml-[2px]">*</span>}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        className="absolute bg-transparent outline-none text-[14px] font-medium text-[#1e1e1e] font-[var(--font-jakarta)] appearance-none disabled:cursor-not-allowed cursor-pointer"
        style={{
          left: 20,
          right: 40,
          top: INPUT_TOP,
          bottom: 8,
          opacity: raised ? 1 : 0,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-[18px] top-1/2 -translate-y-1/2 text-[#8a929a] pointer-events-none"
      />
    </label>
  );
}

export function FloatingDate({
  label,
  value,
  onChange,
  required,
  disabled,
}: FloatingFieldBaseProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  return (
    <label
      htmlFor={id}
      className={baseWrapper(focused, disabled)}
      style={{ height: FIELD_HEIGHT }}
    >
      <span
        className="absolute pointer-events-none font-[var(--font-jakarta)] transition-all duration-200"
        style={{ ...labelStyle(raised), left: 20 }}
      >
        {label}
        {required && <span className="text-[#c1846e] ml-[2px]">*</span>}
      </span>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        className="absolute bg-transparent outline-none text-[14px] font-medium text-[#1e1e1e] font-[var(--font-jakarta)] disabled:cursor-not-allowed"
        style={{ left: 20, right: 20, top: INPUT_TOP, bottom: 8, opacity: raised ? 1 : 0 }}
      />
    </label>
  );
}

/** Simple close X — exactly the Figma spec (24×24, no border wrapper). */
export function PremiumModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  /** Kept for backward compat; not rendered (Figma has no icon tile). */
  icon?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-[48px]">
      <div className="flex flex-col gap-[7px]">
        <p className="text-[16px] font-medium text-[#1e1e1e] font-[var(--font-jakarta)] leading-none">
          {title}
        </p>
        <p className="text-[14px] font-normal text-[#9f9f9f] font-[var(--font-jakarta)] leading-none">
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="w-[24px] h-[24px] rounded-full border border-[#1e1e1e] bg-white flex items-center justify-center hover:bg-[#f4f4f4] transition-colors shrink-0"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
    </div>
  );
}

/** Centered pill submit button — 169×61, NOT full-width (Figma spec). */
export function PremiumSubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="mt-[80px] pb-[20px] flex justify-center">
      <button
        type="submit"
        disabled={disabled}
        className="h-[61px] px-[32px] min-w-[169px] rounded-[33px] bg-[#47535f] text-white text-[12px] font-semibold font-[var(--font-jakarta)] hover:bg-[#3d474f] active:scale-[0.99] transition-all shadow-[0_4px_14px_rgba(71,83,95,0.22)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children}
      </button>
    </div>
  );
}
