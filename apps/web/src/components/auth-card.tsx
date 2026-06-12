import * as React from "react"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("bg-white border border-zinc-200 rounded-xl shadow-sm p-6 sm:p-8", className)}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 mt-2">
            {description}
          </p>
        )}
      </div>

      <div className="mb-6">
        {children}
      </div>

      {footer && (
        <div className="text-center text-sm text-zinc-500">
          {footer}
        </div>
      )}
    </div>
  )
}
