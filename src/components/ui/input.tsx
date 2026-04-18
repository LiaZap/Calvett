"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-[48px] w-full rounded-[10px] bg-[#fcfcfa] border border-[#f2f2ee] px-[20px] text-[14px] font-medium font-[var(--font-jakarta)] text-[#535353] placeholder:text-[#959595] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#47535f]/30 focus-visible:border-[#47535f]/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
