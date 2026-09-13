import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-paper-raised px-3 text-sm placeholder:text-ink-soft/70 focus-visible:border-brand",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
