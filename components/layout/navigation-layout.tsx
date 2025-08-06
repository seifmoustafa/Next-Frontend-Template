"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { NavigationMainSidebar } from "@/components/layout/navigation-main-sidebar";
import { NavigationPanelSidebar } from "@/components/layout/navigation-panel-sidebar";
import { NavigationHeader } from "@/components/layout/navigation-header";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
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
  const { colorTheme, cardStyle, animationLevel, borderRadius } = useSettings();
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

  // Handle panel toggle - only works if current item has children
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

  const getBackgroundClass = () => {
    switch (cardStyle) {
      case "glass":
        return "bg-gradient-to-br from-background/50 to-background/30 backdrop-blur-xl";
      case "solid":
        return "bg-background";
      case "bordered":
        return "bg-background border border-border";
      default:
        return "bg-gradient-to-br from-background/95 to-background/90";
    }
  };

  const getAnimationClass = () => {
    if (animationLevel === "none") return "";
    if (animationLevel === "minimal") return "transition-colors duration-200";
    if (animationLevel === "moderate") return "transition-all duration-300";
    return "transition-all duration-500 ease-in-out";
  };

  return (
    <div
      className={cn(
        "min-h-screen",
        getBackgroundClass(),
        getAnimationClass(),
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

      {/* Panel Sidebar - Contextual Options - Only show if current item has children */}
      {hasChildren && (
        <NavigationPanelSidebar
          selectedMainItem={selectedMainItem}
          open={shouldShowPanel}
          onOpenChange={setPanelSidebarOpen}
          hasChildren={hasChildren}
        />
      )}

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
          "min-h-screen pt-16",
          getAnimationClass(),
          // Dynamic margins based on sidebar states and direction
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
        <main
          className={cn(
            "min-h-screen",
            cardStyle === "glass"
              ? "bg-gradient-to-br from-background/20 to-background/10"
              : "bg-muted/20"
          )}
        >
          <div className="p-4 lg:p-6">
            <div
              className={cn(
                animationLevel === "high" && "animate-fade-in",
                animationLevel === "moderate" &&
                  "transition-opacity duration-300"
              )}
            >
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {(sidebarOpen || (shouldShowPanel && isMobile)) && (
        <div
          className={cn(
            "fixed inset-0 z-40 lg:hidden backdrop-blur-sm",
            cardStyle === "glass" ? "bg-black/20" : "bg-black/50",
            getAnimationClass()
          )}
          onClick={() => {
            onSidebarOpenChange(false);
            if (isMobile) setPanelSidebarOpen(false);
          }}
        />
      )}
    </div>
  );
}
