"use client"

import type React from "react"
import { FloatingNavigation } from "@/components/layout/floating-navigation"
import { FloatingHeader } from "@/components/layout/floating-header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface FloatingLayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function FloatingLayout({ children, sidebarOpen, onSidebarOpenChange }: FloatingLayoutProps) {
  const { direction } = useI18n()

  return (
    <div
      className={cn("min-h-screen bg-gradient-to-br from-background to-muted/30", direction === "rtl" ? "rtl" : "ltr")}
    >
      {/* Floating navigation - better positioned */}
      <FloatingNavigation open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      <div className="min-h-screen">
        {/* Floating header - improved design */}
        <FloatingHeader onMenuClick={() => onSidebarOpenChange(true)} />

        <main className="px-6 pt-32 pb-6">
          <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
