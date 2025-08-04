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
      className={cn(
        "min-h-screen bg-gradient-to-br from-background to-muted/30 relative overflow-hidden",
        direction === "rtl" ? "rtl" : "ltr",
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      {/* Fixed Header */}
      <FloatingHeader onMenuClick={() => onSidebarOpenChange(true)} />

      {/* Floating Navigation - Properly positioned */}
      <FloatingNavigation open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      {/* Main Content */}
      <main className="relative z-10 pt-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
