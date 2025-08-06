"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavigationPanelSidebarProps {
  selectedMainItem: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasChildren: boolean;
}

export function NavigationPanelSidebar({
  selectedMainItem,
  open,
  onOpenChange,
  hasChildren,
}: NavigationPanelSidebarProps) {
  const pathname = usePathname();
  const { direction, t } = useI18n();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get the selected main navigation item
  const selectedNavItem = navigation.find(
    (item) => item.name === selectedMainItem
  );
  const children = selectedNavItem?.children || [];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: any) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child: any) => pathname === child.href);
    }
    return false;
  };

  const renderNavigationItem = (item: any, level: number = 0) => {
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const displayName = t(item.name) || item.name;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.name}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.name)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-10 px-3 rounded-lg transition-all duration-200",
                "hover:bg-slate-800/50 hover:text-white",
                isActive &&
                  "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500",
                level > 0 && "ml-4 w-[calc(100%-1rem)]"
              )}
              style={{ paddingLeft: `${12 + level * 16}px` }}
            >
              <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
              <span className="flex-1 truncate">{displayName}</span>
              {item.badge && (
                <Badge className="ml-2 h-5 px-1.5 text-xs bg-blue-600 text-white">
                  {item.badge}
                </Badge>
              )}
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {item.children.map((child: any) =>
              renderNavigationItem(child, level + 1)
            )}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.name}
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-10 px-3 rounded-lg transition-all duration-200",
          "hover:bg-slate-800/50 hover:text-white",
          isActive && "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500",
          level > 0 && "ml-4 w-[calc(100%-1rem)]"
        )}
        style={{ paddingLeft: `${12 + level * 16}px` }}
        asChild={!!item.href}
        disabled={item.disabled}
      >
        {item.href ? (
          <Link href={item.href}>
            <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-1 truncate">{displayName}</span>
            {item.badge && (
              <Badge className="ml-2 h-5 px-1.5 text-xs bg-blue-600 text-white">
                {item.badge}
              </Badge>
            )}
          </Link>
        ) : (
          <div className="flex items-center w-full">
            <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <span className="flex-1 truncate">{displayName}</span>
            {item.badge && (
              <Badge className="ml-2 h-5 px-1.5 text-xs bg-blue-600 text-white">
                {item.badge}
              </Badge>
            )}
          </div>
        )}
      </Button>
    );
  };

  // Don't render if no children or not open
  if (!hasChildren || !open) {
    return null;
  }

  return (
    <div
      className={cn(
        "navigation-panel-sidebar fixed inset-y-0 z-40 w-64 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800/50 transform transition-all duration-300 ease-in-out",
        direction === "rtl" ? "right-16" : "left-16",
        "lg:translate-x-0"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800/50">
          <h2 className="text-lg font-semibold text-white">
            {t(selectedNavItem?.name || selectedMainItem) || selectedMainItem}
          </h2>
          {children.length > 0 && (
            <p className="text-sm text-slate-400 mt-1">
              {children.length} {t("layout.items") || "items"}
            </p>
          )}
        </div>

        {/* Panel Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-1">
            {children.map((item) => renderNavigationItem(item))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
