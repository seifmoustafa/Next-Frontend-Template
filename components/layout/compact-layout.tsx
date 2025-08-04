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
      {/* Fixed Header */}
      <CompactHeader onMenuClick={() => onSidebarOpenChange(true)} />

      {/* Sidebar */}
      <CompactSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      {/* Main Content - Proper responsive margins */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-16",
          // Desktop margins - sidebar width is 16rem (256px)
          direction === "rtl" ? "lg:mr-64" : "lg:ml-64",
        )}
      >
        <div className="p-4 lg:p-6">
          <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => onSidebarOpenChange(false)} />
      )}
    </div>
  )
}
