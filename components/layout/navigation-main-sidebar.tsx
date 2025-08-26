"use client";

import type React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/providers/i18n-provider";
import { useDynamicNavigation } from "@/components/navigation/dynamic-navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/ui/logo";
import { useSettings } from "@/providers/settings-provider";

interface NavigationMainSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: string;
  onItemSelect: (itemName: string) => void;
}

export function NavigationMainSidebar({
  open,
  onOpenChange,
  selectedItem,
  onItemSelect,
}: NavigationMainSidebarProps) {
  const router = useRouter();
  const { direction, t } = useI18n();
  const navigation = useDynamicNavigation();
  const {
    colorTheme,
    cardStyle,
    animationLevel,
    borderRadius,
    navigationStyle,
    iconStyle,
  } = useSettings();


  const getBorderRadiusClass = () => {
    switch (borderRadius) {
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

  const getAnimationClass = () => {
    if (animationLevel === "none") return "";
    if (animationLevel === "minimal") return "transition-colors duration-200";
    if (animationLevel === "moderate") return "transition-all duration-200";
    return "transition-all duration-300 hover:scale-105";
  };

  const getIconClasses = () => {
    const baseClasses = "w-5 h-5";

    switch (iconStyle) {
      case "filled":
        return cn(baseClasses, "fill-current");
      case "duotone":
        return cn(baseClasses, "fill-current opacity-75");
      case "minimal":
        return cn(baseClasses, "stroke-2");
      default: // "outline"
        return cn(baseClasses, "stroke-current fill-none");
    }
  };

  const getNavigationStyleClasses = (isActive: boolean, isMobile = false) => {
    const baseClasses = isMobile ? "w-full justify-start gap-3 h-12" : "w-12 h-12 relative group";

    if (!isActive) {
      return cn(baseClasses, "hover:bg-accent hover:text-accent-foreground");
    }

    // Active item styling based on navigation style
    switch (navigationStyle) {
      case "pills":
        return cn(
          baseClasses,
          "text-white shadow-lg",
          isMobile ? "rounded-full" : "rounded-full",
          colorTheme === "blue" && "bg-blue-600 hover:bg-blue-700",
          colorTheme === "purple" && "bg-purple-600 hover:bg-purple-700",
          colorTheme === "green" && "bg-green-600 hover:bg-green-700",
          colorTheme === "orange" && "bg-orange-600 hover:bg-orange-700",
          colorTheme === "red" && "bg-red-600 hover:bg-red-700",
          colorTheme === "teal" && "bg-teal-600 hover:bg-teal-700"
        );
      case "underline":
        return cn(
          baseClasses,
          "rounded-none border-b-2",
          colorTheme === "blue" && "border-blue-600 text-blue-600",
          colorTheme === "purple" && "border-purple-600 text-purple-600",
          colorTheme === "green" && "border-green-600 text-green-600",
          colorTheme === "orange" && "border-orange-600 text-orange-600",
          colorTheme === "red" && "border-red-600 text-red-600",
          colorTheme === "teal" && "border-teal-600 text-teal-600"
        );
      case "sidebar":
        return cn(
          baseClasses,
          "rounded-none", // Remove border radius for clean sidebar style
          // For desktop main sidebar: right border for LTR, left border for RTL
          // For mobile: left border for LTR, right border for RTL
          isMobile
            ? (direction === "rtl" ? "border-r-4" : "border-l-4")
            : (direction === "rtl" ? "border-l-4" : "border-r-4"),
          colorTheme === "blue" && "bg-blue-600/20 border-blue-600 text-blue-600",
          colorTheme === "purple" && "bg-purple-600/20 border-purple-600 text-purple-600",
          colorTheme === "green" && "bg-green-600/20 border-green-600 text-green-600",
          colorTheme === "orange" && "bg-orange-600/20 border-orange-600 text-orange-600",
          colorTheme === "red" && "bg-red-600/20 border-red-600 text-red-600",
          colorTheme === "teal" && "bg-teal-600/20 border-teal-600 text-teal-600"
        );
      default: // "default"
        return cn(
          baseClasses,
          "text-white shadow-lg",
          colorTheme === "blue" && "bg-blue-600 hover:bg-blue-700",
          colorTheme === "purple" && "bg-purple-600 hover:bg-purple-700",
          colorTheme === "green" && "bg-green-600 hover:bg-green-700",
          colorTheme === "orange" && "bg-orange-600 hover:bg-orange-700",
          colorTheme === "red" && "bg-red-600 hover:bg-red-700",
          colorTheme === "teal" && "bg-teal-600 hover:bg-teal-700"
        );
    }
  };

  const handleItemClick = (item: any) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
      // Item has children - show panel sidebar
      onItemSelect(item.name);
    } else if (item.href) {
      // Item has no children but has href - navigate directly
      onItemSelect(item.name);
      router.push(item.href);
      // Close mobile sidebar after navigation
      if (window.innerWidth < 1024) {
        onOpenChange(false);
      }
    } else {
      // Item has no children and no href - just select
      onItemSelect(item.name);
    }
  };

  const renderNavigationItem = (item: any) => {
    const isActive = selectedItem === item.name;
    const hasChildren = item.children && item.children.length > 0;
    const hasHref = !!item.href;
    const displayName = t(item.name) || item.name;

    return (
      <TooltipProvider key={item.name}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                getNavigationStyleClasses(isActive),
                getBorderRadiusClass(),
                getAnimationClass(),
                item.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.icon ? (
                <item.icon className={getIconClasses()} />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              )}

              {/* Active indicator - only show for non-sidebar navigation styles */}
              {isActive && navigationStyle !== "sidebar" && (
                <div
                  className={cn(
                    "absolute w-1 h-8 rounded-full",
                    direction === "rtl" ? "left-0" : "right-0",
                    colorTheme === "blue" && "bg-blue-300",
                    colorTheme === "purple" && "bg-purple-300",
                    colorTheme === "green" && "bg-green-300",
                    colorTheme === "orange" && "bg-orange-300",
                    colorTheme === "red" && "bg-red-300",
                    colorTheme === "teal" && "bg-teal-300"
                  )}
                />
              )}

              {/* Badge indicator for items with children */}
              {hasChildren && (
                <div
                  className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                    colorTheme === "blue" && "bg-blue-400",
                    colorTheme === "purple" && "bg-purple-400",
                    colorTheme === "green" && "bg-green-400",
                    colorTheme === "orange" && "bg-orange-400",
                    colorTheme === "red" && "bg-red-400",
                    colorTheme === "teal" && "bg-teal-400"
                  )}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side={direction === "rtl" ? "left" : "right"}
            className="bg-popover border-border"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{displayName}</span>
              {hasChildren && (
                <span className="text-xs text-muted-foreground">
                  {t("layout.click_to_expand") || "Click to expand"}
                </span>
              )}
              {!hasChildren && hasHref && (
                <span className="text-xs text-muted-foreground">
                  {t("layout.click_to_navigate") || "Click to navigate"}
                </span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "navigation-main-sidebar fixed inset-y-0 z-50 w-16 border-r transform transition-all duration-300 ease-in-out hidden lg:flex flex-col",
          cardStyle === "glass"
            ? "bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
            : cardStyle === "solid"
              ? "bg-background border-border backdrop-blur-sm"
              : "bg-background/95 border-border/50 backdrop-blur-sm",
          direction === "rtl" ? "right-0" : "left-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-border/50">
          <Logo size="sm" />
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 py-4">
          <div className="flex flex-col items-center space-y-2 px-2">
            {navigation.map(renderNavigationItem)}
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "navigation-main-sidebar fixed inset-y-0 z-50 w-64 border-r transform transition-all duration-300 ease-in-out lg:hidden",
          cardStyle === "glass"
            ? "bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] dark:shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
            : cardStyle === "solid"
              ? "bg-background border-border backdrop-blur-sm"
              : "bg-background/98 border-border/50 backdrop-blur-sm",
          direction === "rtl" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : direction === "rtl"
              ? "translate-x-full"
              : "-translate-x-full"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            ×
          </Button>
        </div>

        {/* Mobile Navigation Items */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = selectedItem === item.name;
              const hasChildren = item.children && item.children.length > 0;
              const hasHref = !!item.href;
              const displayName = t(item.name) || item.name;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    getNavigationStyleClasses(isActive, true),
                    getBorderRadiusClass(),
                    getAnimationClass(),
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                >
                  {item.icon ? (
                    <item.icon className={getIconClasses()} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                  <span className="flex-1">{displayName}</span>
                  {hasChildren && (
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        colorTheme === "blue" && "bg-blue-300",
                        colorTheme === "purple" && "bg-purple-300",
                        colorTheme === "green" && "bg-green-300",
                        colorTheme === "orange" && "bg-orange-300",
                        colorTheme === "red" && "bg-red-300",
                        colorTheme === "teal" && "bg-teal-300"
                      )}
                    />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
