"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[12px] font-semibold font-[var(--font-jakarta)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#47535f] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#47535f] text-white hover:bg-[#3c4751]",
        outline: "border border-[rgba(0,0,0,0.1)] bg-white text-[rgba(43,43,43,0.51)] hover:bg-[#fafafa] hover:text-[#47535f]",
        ghost: "text-[#47535f] hover:bg-[#fafafa]",
        destructive: "bg-[#c1846e] text-white hover:bg-[#ad745f]",
        secondary: "bg-[#f4f4f4] text-[#1e1e1e] hover:bg-[#e8e8e8]",
      },
      size: {
        default: "px-[15px] py-[12px] rounded-[33px]",
        sm: "px-[10px] py-[8px] rounded-[20px] text-[11px]",
        lg: "px-[20px] py-[14px] rounded-[33px] text-[13px]",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
