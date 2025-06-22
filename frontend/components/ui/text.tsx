import type React from "react"
import { cn } from "@/lib/utils"

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "small" | "muted"
  gradient?: boolean
}

export function Text({ className, variant = "p", gradient = false, children, ...props }: TextProps) {
  const baseClasses = {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold text-foreground",
    h2: "text-3xl md:text-4xl font-bold text-foreground",
    h3: "text-2xl md:text-3xl font-semibold text-foreground",
    h4: "text-xl md:text-2xl font-semibold text-foreground",
    p: "text-base text-foreground",
    small: "text-sm text-muted-foreground",
    muted: "text-muted-foreground",
  }

  const Component = variant === "p" ? "p" : variant === "small" ? "span" : variant

  return (
    <Component
      className={cn(baseClasses[variant], gradient && "gradient-text-fallback gradient-text", className)}
      style={gradient ? { lineHeight: "1.3" } : undefined}
      {...props}
    >
      {children}
    </Component>
  )
}
