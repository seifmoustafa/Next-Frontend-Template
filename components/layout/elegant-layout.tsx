"use client"

import type React from "react"
import { ElegantSidebar } from "@/components/layout/elegant-sidebar"
import { ElegantHeader } from "@/components/layout/elegant-header"
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
      {/* Fixed Header - Highest z-index */}
      <ElegantHeader onMenuClick={() => onSidebarOpenChange(true)} />

      {/* Sidebar - Lower z-index than header */}
      <ElegantSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      {/* Main Content - Proper margins for responsive design */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-20",
          // Desktop margins
          direction === "rtl" ? "lg:mr-80 xl:mr-72" : "lg:ml-80 xl:ml-72",
          // Mobile - no margins when sidebar is closed
          sidebarOpen ? "lg:blur-none" : "",
        )}
      >
        <div className="p-6 lg:p-8">
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>

      {/* Mobile overlay with proper z-index */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
