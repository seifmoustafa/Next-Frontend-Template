"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isModern?: boolean;
}

export function Sidebar({
  open,
  onOpenChange,
  isModern = false,
}: SidebarProps) {
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
    const indent = level * 16; // 16px per level

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
                "group flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
                  : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
              )}
              style={{ paddingLeft: `${16 + indent}px` }}
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
                      "w-4 h-4 transition-all duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-primary"
                    )}
                  />
                </div>
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
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
          "group flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md"
            : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-sm"
        )}
        style={{ paddingLeft: `${16 + indent}px` }}
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
                "w-4 h-4 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-primary"
              )}
            />
          </div>
          <span className="truncate">{item.name}</span>
        </div>
        {item.badge && (
          <Badge
            variant="secondary"
            className={cn(
              "text-xs",
              isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col h-full bg-gradient-to-b from-sidebar via-sidebar/98 to-sidebar border-r border-sidebar-border sidebar-shadow",
          "backdrop-blur-sm"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <Logo size="sm" className="text-primary-foreground" />
            </div>
            <div className={cn(isModern && "sidebar-text")}>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                {t("app.title")}
              </h1>
              <p className="text-xs text-sidebar-foreground/60 flex items-center">
                <Logo size="xs" className="mr-1 rtl:mr-0 rtl:ml-1" />
                {isModern ? t("app.modern") : t("app.default")}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300",
              "rounded-lg shadow-sm hover:shadow-md hover:scale-105"
            )}
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
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
              <div className={cn("flex-1 min-w-0", isModern && "sidebar-text")}>
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
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
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start space-x-3 rtl:space-x-reverse text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 px-3 py-2 h-auto rounded-lg",
              "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <span className={cn("text-sm", isModern && "sidebar-text")}>
              {t("nav.logout")}
            </span>
          </Button>
          <div
            className={cn(
              "text-xs text-sidebar-foreground/60 text-center mt-2",
              isModern && "sidebar-text"
            )}
          >
            {t("app.version")}
          </div>
        </div>
      </div>
    </>
  );
}
