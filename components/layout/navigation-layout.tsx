"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { NavigationMainSidebar } from "@/components/layout/navigation-main-sidebar";
import { NavigationPanelSidebar } from "@/components/layout/navigation-panel-sidebar";
import { NavigationHeader } from "@/components/layout/navigation-header";
import { useI18n } from "@/providers/i18n-provider";
import { navigation } from "@/config/navigation";
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
  const [selectedMainItem, setSelectedMainItem] = useState<string>("dashboard");
  const [panelSidebarOpen, setPanelSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Get the selected main navigation item and check if it has children
  const selectedNavItem = navigation.find(
    (item) => item.name === selectedMainItem
  );
  const hasChildren =
    selectedNavItem?.children && selectedNavItem.children.length > 0;
  const shouldShowPanel = hasChildren && panelSidebarOpen && !isMobile;

  // Handle main item selection
  const handleMainItemSelect = (itemName: string) => {
    const newItem = navigation.find((item) => item.name === itemName);
    const newHasChildren = newItem?.children && newItem.children.length > 0;

    setSelectedMainItem(itemName);

    // Auto-expand panel if new item has children and we're on desktop
    if (newHasChildren && !isMobile) {
      setPanelSidebarOpen(true);
    }
    // Auto-collapse panel if new item has no children
    else if (!newHasChildren) {
      setPanelSidebarOpen(false);
    }
  };

  // Handle panel toggle
  const handlePanelToggle = () => {
    if (hasChildren) {
      setPanelSidebarOpen(!panelSidebarOpen);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (mobile) {
        setPanelSidebarOpen(false);
      } else if (hasChildren) {
        setPanelSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasChildren]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(".navigation-main-sidebar");
      const panelSidebar = document.querySelector(".navigation-panel-sidebar");
      const sidebarTrigger = document.querySelector(".sidebar-trigger");

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        panelSidebar &&
        !panelSidebar.contains(event.target as Node) &&
        sidebarTrigger &&
        !sidebarTrigger.contains(event.target as Node) &&
        isMobile
      ) {
        onSidebarOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSidebarOpenChange, isMobile]);

  return (
    <div
      className={cn(
        "min-h-screen bg-slate-950",
        direction === "rtl" ? "rtl" : "ltr"
      )}
    >
      {/* Main Sidebar - Primary Navigation */}
      <NavigationMainSidebar
        open={sidebarOpen}
        onOpenChange={onSidebarOpenChange}
        selectedItem={selectedMainItem}
        onItemSelect={handleMainItemSelect}
      />

      {/* Panel Sidebar - Contextual Options */}
      <NavigationPanelSidebar
        selectedMainItem={selectedMainItem}
        open={shouldShowPanel}
        onOpenChange={setPanelSidebarOpen}
        hasChildren={hasChildren}
      />

      {/* Navigation Header - FULL WIDTH */}
      <NavigationHeader
        onMenuClick={() => onSidebarOpenChange(true)}
        onPanelToggle={handlePanelToggle}
        panelOpen={shouldShowPanel}
        hasPanel={hasChildren}
        selectedMainItem={selectedMainItem}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out pt-16",
          // Dynamic margins based on sidebar states
          direction === "rtl"
            ? cn(
                "lg:mr-16", // Always account for main sidebar on desktop
                shouldShowPanel && "lg:mr-80" // Add panel sidebar width when open
              )
            : cn(
                "lg:ml-16", // Always account for main sidebar on desktop
                shouldShowPanel && "lg:ml-80" // Add panel sidebar width when open
              )
        )}
      >
        {/* Main Content */}
        <main className="min-h-screen bg-slate-900/30">
          <div className="p-4 lg:p-6">
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {(sidebarOpen || (shouldShowPanel && isMobile)) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => {
            onSidebarOpenChange(false);
            if (isMobile) setPanelSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
}
