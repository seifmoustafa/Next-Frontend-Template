"use client"

import type React from "react"
import { MinimalHeader } from "./minimal-header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface MinimalLayoutProps {
  children: React.ReactNode
}

export function MinimalLayout({ children }: MinimalLayoutProps) {
  const { direction } = useI18n()

  return (
    <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
      {/* Minimal layout has no sidebar, just a header with dropdown navigation */}
      <MinimalHeader />

      <main className="p-6 pt-20">
        <div className="animate-fade-in max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
