"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

interface CompactSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompactSidebar({ open, onOpenChange }: CompactSidebarProps) {
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
                "group flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                  : "text-foreground/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
              )}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-300",
                    "w-8 h-8",
                    isActive
                      ? "bg-white/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-primary"
                    )}
                  />
                </div>
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs h-5 px-2",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isExpanded && "rotate-180",
                  isActive ? "text-white" : "text-primary"
                )}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
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
          "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
            : "text-foreground/80 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-300",
              "w-8 h-8",
              isActive
                ? "bg-white/20"
                : "bg-primary/10 group-hover:bg-primary/20"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-primary"
              )}
            />
          </div>
          <span className="truncate">{item.name}</span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {item.badge && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs h-5 px-2",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-primary/10 text-primary"
              )}
            >
              {item.badge}
            </Badge>
          )}
          {level === 0 && (
            <ChevronRight
              className={cn(
                "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                isActive ? "text-white" : "text-primary"
              )}
            />
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      <div
        className={cn(
          "mt-24",
          "fixed inset-y-0 z-40 w-64 bg-gradient-to-b from-background via-background/98 to-background border-r border-border/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto sidebar-shadow",
          "backdrop-blur-sm",
          direction === "rtl" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : direction === "rtl"
            ? "translate-x-full"
            : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-border/80">
              <div
                className={cn(
                  "flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-xl",
                  "bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10",
                  "shadow-sm hover:shadow-md transition-all duration-300"
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      "h-10 w-10 ring-1 ring-primary/20 shadow-md",
                      "transition-all duration-300 hover:scale-105"
                    )}
                  >
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-sm font-semibold">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Fixed online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background shadow-sm">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.adminTypeName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border/80">
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start space-x-3 rtl:space-x-reverse text-foreground/80 hover:text-destructive hover:bg-destructive/10 px-3 py-2 h-auto rounded-lg",
                "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                <LogOut className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm">{t("nav.logout")}</span>
            </Button>
            <div className="text-xs text-muted-foreground text-center mt-2">
              v2.1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
