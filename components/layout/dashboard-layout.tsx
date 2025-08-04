"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useI18n } from "@/providers/i18n-provider"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { direction } = useI18n()

  return (
    <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className={cn("transition-all duration-300 ease-in-out", direction === "rtl" ? "lg:mr-80" : "lg:ml-80")}>
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
