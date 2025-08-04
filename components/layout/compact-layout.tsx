"use client"

import type React from "react"
import { CompactSidebar } from "@/components/layout/compact-sidebar"
import { CompactHeader } from "@/components/layout/compact-header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface CompactLayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function CompactLayout({ children, sidebarOpen, onSidebarOpenChange }: CompactLayoutProps) {
  const { direction } = useI18n()

  return (
    <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
      {/* Improved compact sidebar - better width and spacing */}
      <CompactSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      <div className={cn("transition-all duration-300 ease-in-out", direction === "rtl" ? "lg:mr-72" : "lg:ml-72")}>
        {/* Improved compact header - better height and elements */}
        <CompactHeader onMenuClick={() => onSidebarOpenChange(true)} />

        <main className="p-6">
          <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => onSidebarOpenChange(false)} />
      )}
    </div>
  )
}
