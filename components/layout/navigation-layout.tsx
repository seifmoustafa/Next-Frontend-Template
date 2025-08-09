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
import { Footer } from "@/components/layout/footer";

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
  const settings = useSettings();
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
    switch (settings.cardStyle) {
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
    if (settings.animationLevel === "none") return "";
    if (settings.animationLevel === "minimal") return "transition-colors duration-200";
    if (settings.animationLevel === "moderate") return "transition-all duration-300";
    return "transition-all duration-500 ease-in-out";
  };

  const getSpacingClass = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "p-2 lg:p-3";
      case "comfortable":
        return "p-6 lg:p-8";
      case "spacious":
        return "p-8 lg:p-12";
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

  const getBorderRadiusClass = () => {
    switch (settings.borderRadius) {
      case "none":
        return "rounded-none";
      case "small":
        return "rounded-sm";
      case "large":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-md";
    }
  };

  const getShadowClass = () => {
    switch (settings.shadowIntensity) {
      case "none":
        return "";
      case "subtle":
        return "shadow-sm";
      case "strong":
        return "shadow-lg";
      default:
        return "shadow-md";
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen",
        getBackgroundClass(),
        getAnimationClass(),
        getFontSizeClass(),
        direction === "rtl" ? "rtl" : "ltr",
        settings.compactMode && "compact-mode",
        settings.highContrast && "high-contrast",
        settings.reducedMotion && "reduce-motion"
      )}
      style={{
        fontSize: `var(--font-size-base)`,
      }}
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
          "min-h-screen",
          settings.stickyHeader ? "pt-16" : "pt-4",
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
            settings.cardStyle === "glass"
              ? "bg-gradient-to-br from-background/20 to-background/10"
              : "bg-muted/20"
          )}
        >
          <div className={cn(getSpacingClass())}>
            <div
              className={cn(
                settings.animationLevel === "high" && "animate-fade-in",
                settings.animationLevel === "moderate" &&
                  "transition-opacity duration-300",
                getBorderRadiusClass(),
                getShadowClass(),
                settings.cardStyle === "bordered" && "border border-border",
                settings.cardStyle === "elevated" && "bg-card shadow-lg"
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
      </div>

      {/* Mobile Overlay */}
      {(sidebarOpen || (shouldShowPanel && isMobile)) && (
        <div
          className={cn(
            "fixed inset-0 z-40 lg:hidden backdrop-blur-sm",
            settings.cardStyle === "glass" ? "bg-black/20" : "bg-black/50",
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
