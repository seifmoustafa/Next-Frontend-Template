"use client"

import type React from "react"
import { ClassicSidebar } from "./classic-sidebar"
import { ClassicHeader } from "./classic-header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface ClassicLayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function ClassicLayout({ children, sidebarOpen, onSidebarOpenChange }: ClassicLayoutProps) {
  const { direction } = useI18n()

  return (
    <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
      {/* Classic sidebar - wider with larger icons and text */}
      <ClassicSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      <div className={cn("transition-all duration-300 ease-in-out", direction === "rtl" ? "lg:mr-80" : "lg:ml-80")}>
        {/* Classic header - simpler with fewer elements */}
        <ClassicHeader onMenuClick={() => onSidebarOpenChange(true)} />

        <main className="p-8">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
