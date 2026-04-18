"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[28px] px-[12px] py-[6px] text-[12px] font-medium font-[var(--font-jakarta)] transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#fafbf6] text-[#a5c16e]",
        success: "bg-[#fafbf6] text-[#a5c16e]",
        warning: "bg-[#fafbf6] text-[#c1b26e]",
        info: "bg-[#fafbf6] text-[#bac16e]",
        danger: "bg-[rgba(193,132,110,0.1)] text-[#c1846e]",
        neutral: "bg-[#f4f4f4] text-[#646464]",
        ghost: "bg-[rgba(215,221,227,0.5)] text-[#787878] rounded-[6px] text-[10px] px-[8px] py-[4px]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
