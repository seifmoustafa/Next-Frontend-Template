"use client"

import type React from "react"
import { ClassicSidebar } from "./classic-sidebar"
import { ClassicHeader } from "./classic-header"
import { useI18n } from "@/providers/i18n-provider"
import { useSettings } from "@/providers/settings-provider"
import { cn } from "@/lib/utils"

interface ClassicLayoutProps {
  children: React.ReactNode
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function ClassicLayout({ children, sidebarOpen, onSidebarOpenChange }: ClassicLayoutProps) {
  const { direction } = useI18n()
  const settings = useSettings()

  const getSpacingClass = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-4"
      case "comfortable":
        return "p-10"
      case "spacious":
        return "p-12"
      default:
        return "p-8"
    }
  }

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      default:
        return "text-base"
    }
  }

  const getAnimationClass = () => {
    if (settings.animationLevel === "none") return ""
    if (settings.animationLevel === "minimal") return "transition-colors duration-200"
    if (settings.animationLevel === "moderate") return "transition-all duration-300"
    return "transition-all duration-500 ease-in-out"
  }

  const getBorderRadiusClass = () => {
    switch (settings.borderRadius) {
      case "none":
        return "rounded-none"
      case "small":
        return "rounded-sm"
      case "large":
        return "rounded-lg"
      case "full":
        return "rounded-full"
      default:
        return "rounded-md"
    }
  }

  const getShadowClass = () => {
    switch (settings.shadowIntensity) {
      case "none":
        return ""
      case "subtle":
        return "shadow-sm"
      case "strong":
        return "shadow-lg"
      default:
        return "shadow-md"
    }
  }

  return (
    <div 
      className={cn(
        "min-h-screen bg-background", 
        direction === "rtl" ? "rtl" : "ltr",
        getFontSizeClass(),
        settings.compactMode && "compact-mode",
        settings.highContrast && "high-contrast",
        settings.reducedMotion && "reduce-motion"
      )}
      style={{
        fontSize: `var(--font-size-base)`,
      }}
    >
      {/* Classic sidebar - wider with larger icons and text */}
      <ClassicSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      <div 
        className={cn(
          getAnimationClass(),
          direction === "rtl" ? "lg:mr-80" : "lg:ml-80"
        )}
      >
        {/* Classic header - simpler with fewer elements */}
        <ClassicHeader onMenuClick={() => onSidebarOpenChange(true)} />

        <main className={cn(getSpacingClass())}>
          <div 
            className={cn(
              "animate-fade-in",
              getBorderRadiusClass(),
              getShadowClass(),
              settings.cardStyle === "bordered" && "border border-border",
              settings.cardStyle === "elevated" && "bg-card shadow-lg",
              settings.cardStyle === "glass" && "bg-background/80 backdrop-blur-sm"
            )}
            style={{
              borderRadius: `var(--border-radius)`,
              boxShadow: `var(--shadow-intensity)`,
              padding: `var(--spacing-unit)`,
            }}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm",
            getAnimationClass()
          )}
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  )
}
