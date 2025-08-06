"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { NavigationSidebar } from "@/components/layout/navigation-sidebar";
import { NavigationHeader } from "@/components/layout/navigation-header";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface NavigationLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
}

export function NavigationLayout({
  children,
  sidebarOpen,
  onSidebarOpenChange,
}: NavigationLayoutProps) {
  const { direction } = useI18n();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".navigation-sidebar");
      const sidebarTrigger = document.querySelector(".sidebar-trigger");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        sidebarTrigger &&
        !sidebarTrigger.contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
        onSidebarOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSidebarOpenChange]);

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-950",
        direction === "rtl" ? "rtl" : "ltr"
      )}
    >
      {/* Navigation Sidebar */}
      <NavigationSidebar
        open={sidebarOpen}
        onOpenChange={onSidebarOpenChange}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          direction === "rtl" ? "lg:mr-72" : "lg:ml-72"
        )}
      >
        {/* Navigation Header */}
        <NavigationHeader onMenuClick={() => onSidebarOpenChange(true)} />

        {/* Main Content */}
        <main className="p-6 pt-20 bg-slate-900/30">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => onSidebarOpenChange(false)}
        />
      )}
    </div>
  );
}
