"use client"

import type React from "react"
import { ElegantSidebar } from "./elegant-sidebar"
import { ElegantHeader } from "./elegant-header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface ElegantLayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function ElegantLayout({ children, sidebarOpen, onSidebarOpenChange }: ElegantLayoutProps) {
  const { direction } = useI18n()

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted/20",
        direction === "rtl" ? "rtl" : "ltr",
      )}
    >
      {/* Elegant sidebar with curved design */}
      <ElegantSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      <div className={cn("transition-all duration-500 ease-in-out", direction === "rtl" ? "lg:mr-72" : "lg:ml-72")}>
        {/* Elegant header with gradient and blur effects */}
        <ElegantHeader onMenuClick={() => onSidebarOpenChange(true)} />

        <main className="p-8 pt-24">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile overlay with blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-md"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
