"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { MinimalHeader } from "@/components/layout/minimal-header"
import { ClassicHeader } from "@/components/layout/classic-header"
import { ClassicSidebar } from "@/components/layout/classic-sidebar"
import { useI18n } from "@/providers/i18n-provider"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { direction } = useI18n()
  const { layoutTemplate } = useSettings()

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".sidebar")
      const sidebarTrigger = document.querySelector(".sidebar-trigger")

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        sidebarTrigger &&
        !sidebarTrigger.contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Modern Layout
  if (layoutTemplate === "modern") {
    return (
      <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
        {/* Modern sidebar - collapsed by default on desktop */}
        <div
          className={cn(
            "sidebar fixed inset-y-0 z-50 w-20 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0 custom-scrollbar overflow-hidden hover:w-80",
            direction === "rtl" ? "right-0" : "left-0",
            sidebarOpen ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
          )}
        >
          <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} isModern={true} />
        </div>

        <div className={cn("transition-all duration-300 ease-in-out", direction === "rtl" ? "lg:mr-20" : "lg:ml-20")}>
          {/* Modern header - taller with more prominent search */}
          <Header onMenuClick={() => setSidebarOpen(true)} isModern={true} />

          <main className="p-6 pt-24">
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

  // Minimal Layout
  if (layoutTemplate === "minimal") {
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

  // Classic Layout
  if (layoutTemplate === "classic") {
    return (
      <div className={cn("min-h-screen bg-background", direction === "rtl" ? "rtl" : "ltr")}>
        {/* Classic sidebar - wider with larger icons and text */}
        <ClassicSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <div className={cn("transition-all duration-300 ease-in-out", direction === "rtl" ? "lg:mr-80" : "lg:ml-80")}>
          {/* Classic header - simpler with fewer elements */}
          <ClassicHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-8">
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

  // Default layout
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
