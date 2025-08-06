"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getNavigationItems,
  isNavigationItemActive,
  type NavigationItem,
} from "@/config/navigation";
import { Logo } from "@/components/ui/logo";

interface FloatingNavigationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FloatingNavigation({
  open,
  onOpenChange,
}: FloatingNavigationProps) {
  const pathname = usePathname();
  const { t, direction } = useI18n();
  const { logout, user } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Get navigation items with translations
  const navigation = getNavigationItems(t);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isNavigationItemActive(item, pathname);
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <Collapsible
          key={item.name}
          open={isExpanded}
          onOpenChange={() => toggleExpanded(item.name)}
        >
          <CollapsibleTrigger asChild>
            <div
              className={cn(
                "group flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-md"
                  : "bg-background/60 text-foreground/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
              )}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-300",
                    level === 0
                      ? "w-8 h-8 bg-primary/10"
                      : "w-6 h-6 bg-primary/5"
                  )}
                >
                  <Icon
                    className={cn(
                      level === 0 ? "h-4 w-4" : "h-3 w-3",
                      "text-primary"
                    )}
                  />
                </div>
                <span>{item.name}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {item.children?.map((child) =>
              renderNavigationItem(child, level + 1)
            )}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href || "#"}
        className={cn(
          "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-md"
            : "bg-background/60 text-foreground/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-300",
              level === 0 ? "w-8 h-8 bg-primary/10" : "w-6 h-6 bg-primary/5"
            )}
          >
            <Icon
              className={cn(
                level === 0 ? "h-4 w-4" : "h-3 w-3",
                "text-primary"
              )}
            />
          </div>
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <Badge
            variant="secondary"
            className="text-xs bg-primary/10 text-primary border-0"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <Card
      className={cn(
        "fixed z-40 w-80 max-h-[calc(100vh-8rem)] border-0 bg-background/95 backdrop-blur-xl transition-all duration-300 ease-in-out sidebar-shadow",
        // Responsive positioning
        "top-24 left-4 right-4 sm:left-8 sm:right-auto sm:w-80",
        // Show/hide animation
        open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        // Always visible on large screens
        "lg:translate-y-0 lg:opacity-100",
        // RTL support
        direction === "rtl" && "sm:left-auto sm:right-8"
      )}
    >
      <CardContent className="p-0">
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border/50">
              <div
                className={cn(
                  "flex items-center space-x-4 rtl:space-x-reverse p-4 rounded-2xl",
                  "bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10",
                  "shadow-sm hover:shadow-md transition-all duration-300"
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      "h-12 w-12 ring-2 ring-primary/20 shadow-lg",
                      "transition-all duration-300 hover:scale-105"
                    )}
                  >
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Fixed online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.adminTypeName}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigation.map((item) => renderNavigationItem(item))}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start h-10 px-4 text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all duration-300 rounded-xl",
                "shadow-sm hover:shadow-md hover:scale-105"
              )}
              onClick={logout}
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-lg mr-3 rtl:mr-0 rtl:ml-3 bg-destructive/10">
                <LogOut className="h-3 w-3 text-destructive" />
              </div>
              <span>{t("nav.logout")}</span>
            </Button>
            <div className="text-xs text-muted-foreground text-center mt-3">
              v2.1.0 • Floating Design
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
