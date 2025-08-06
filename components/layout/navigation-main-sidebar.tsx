"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/ui/logo";

interface NavigationMainSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: string;
  onItemSelect: (item: string) => void;
}

export function NavigationMainSidebar({
  open,
  onOpenChange,
  selectedItem,
  onItemSelect,
}: NavigationMainSidebarProps) {
  const pathname = usePathname();
  const { direction, t } = useI18n();
  const { user } = useAuth();

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const isItemActive = (item: any) => {
    if (item.name === selectedItem) return true;
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child: any) => pathname === child.href);
    }
    return false;
  };

  const getChildrenCount = (item: any) => {
    return item.children ? item.children.length : 0;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "navigation-main-sidebar fixed inset-y-0 z-50 w-16 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 transform transition-all duration-300 ease-in-out",
          direction === "rtl" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : direction === "rtl"
            ? "translate-x-full"
            : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-3 border-b border-slate-800/50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Logo className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-2 px-2">
              {navigation.map((item) => {
                const isActive = isItemActive(item);
                const childrenCount = getChildrenCount(item);
                const displayName = t(item.name) || item.name;

                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-12 h-12 rounded-xl transition-all duration-200 relative group",
                          "hover:bg-slate-800/60 hover:scale-105",
                          isActive
                            ? "bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/20 border border-blue-500/30"
                            : "text-slate-400 hover:text-white"
                        )}
                        onClick={() => onItemSelect(item.name)}
                        disabled={item.disabled}
                      >
                        <item.icon className="w-5 h-5" />
                        {childrenCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-blue-600 text-white border-2 border-slate-900">
                            {childrenCount}
                          </Badge>
                        )}
                        {isActive && (
                          <div
                            className={cn(
                              "absolute w-1 h-8 bg-blue-500 rounded-full transition-all duration-200",
                              direction === "rtl" ? "right-0" : "left-0"
                            )}
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side={direction === "rtl" ? "left" : "right"}
                      className="bg-slate-800 border-slate-700 text-white"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{displayName}</span>
                        {childrenCount > 0 && (
                          <span className="text-xs text-slate-400">
                            {childrenCount} {t("layout.items") || "items"}
                          </span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </ScrollArea>

          {/* User Section */}
          <div className="p-3 border-t border-slate-800/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-xl hover:bg-slate-800/60"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side={direction === "rtl" ? "left" : "right"}
                className="bg-slate-800 border-slate-700 text-white"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                      : "User"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {user?.adminTypeName || user?.role || "User"}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
