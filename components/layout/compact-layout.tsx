"use client";

import type React from "react";
import { CompactSidebar } from "@/components/layout/compact-sidebar";
import { CompactHeader } from "@/components/layout/compact-header";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";

interface CompactLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
}

export function CompactLayout({
  children,
  sidebarOpen,
  onSidebarOpenChange,
}: CompactLayoutProps) {
  const { direction } = useI18n();
  const settings = useSettings();

  const getSpacingClass = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-2 lg:p-3";
      case "comfortable":
        return "p-6 lg:p-8";
      case "spacious":
        return "p-8 lg:p-10";
      default:
        return "p-4 lg:p-6";
    }
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getAnimationClass = () => {
    if (settings.animationLevel === "none") return "";
    if (settings.animationLevel === "minimal")
      return "transition-colors duration-200";
    if (settings.animationLevel === "moderate")
      return "transition-all duration-300";
    return "transition-all duration-500 ease-in-out";
  };

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
      {/* Fixed Header */}
      <CompactHeader onMenuClick={() => onSidebarOpenChange(true)} />

      {/* Sidebar */}
      <CompactSidebar open={sidebarOpen} onOpenChange={onSidebarOpenChange} />

      {/* Main Content - Proper responsive margins */}
      <main
        className={cn(
          getAnimationClass(),
          settings.stickyHeader ? "pt-16" : "pt-4",
          // Desktop margins - sidebar width is 16rem (256px)
          direction === "rtl" ? "lg:mr-64" : "lg:ml-64"
        )}
      >
        <div className={cn(getSpacingClass())}>
          <div
            className={cn(
              "animate-fade-in space-y-6 max-w-7xl mx-auto",
              settings.cardStyle === "bordered" &&
                "border border-border rounded-lg p-6",
              settings.cardStyle === "elevated" &&
                "bg-card shadow-lg rounded-lg p-6",
              settings.cardStyle === "glass" &&
                "bg-background/80 backdrop-blur-sm rounded-lg p-6"
            )}
            style={{
              borderRadius: `var(--border-radius)`,
              boxShadow: `var(--shadow-intensity)`,
              padding: `var(--spacing-unit)`,
            }}
          >
            {children}
          </div>
        </div>
      </main>

        {settings.showFooter && <Footer />}

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className={cn(
              "fixed inset-0 bg-black/50 z-30 lg:hidden",
              getAnimationClass()
            )}
            onClick={() => onSidebarOpenChange(false)}
          />
        )}
      </div>
    );
  }
