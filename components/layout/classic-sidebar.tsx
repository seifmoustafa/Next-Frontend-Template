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

interface ClassicSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassicSidebar({ open, onOpenChange }: ClassicSidebarProps) {
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
                "group flex items-center justify-between w-full px-6 py-4 rounded-xl text-base font-medium transition-all duration-300 cursor-pointer",
                level > 0 && "ml-6 rtl:ml-0 rtl:mr-6 py-3 text-sm",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-md"
              )}
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-300",
                    level === 0 ? "w-10 h-10" : "w-8 h-8",
                    isActive
                      ? "bg-white/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all duration-300 group-hover:scale-110",
                      level === 0 ? "w-5 h-5" : "w-4 h-4",
                      isActive ? "text-white" : "text-primary"
                    )}
                  />
                </div>
                <span className="flex-1">{item.name}</span>
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
                  "w-5 h-5 transition-transform duration-300",
                  isExpanded && "rotate-180",
                  isActive ? "text-white" : "text-primary"
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
          "group flex items-center justify-between px-6 py-4 rounded-xl text-base font-medium transition-all duration-300",
          level > 0 && "ml-6 rtl:ml-0 rtl:mr-6 py-3 text-sm",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
            : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-md"
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg transition-all duration-300",
              level === 0 ? "w-10 h-10" : "w-8 h-8",
              isActive
                ? "bg-white/20"
                : "bg-primary/10 group-hover:bg-primary/20"
            )}
          >
            <Icon
              className={cn(
                "transition-all duration-300 group-hover:scale-110",
                level === 0 ? "w-5 h-5" : "w-4 h-4",
                isActive ? "text-white" : "text-primary"
              )}
            />
          </div>
          <span className="flex-1">{item.name}</span>
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
          "sidebar fixed inset-y-0 z-50 w-80 bg-gradient-to-b from-sidebar via-sidebar/98 to-sidebar border-r-2 border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 custom-scrollbar overflow-y-auto sidebar-shadow",
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Logo size="md" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">
                  {t("app.title")}
                </h1>
                <p className="text-xs text-sidebar-foreground/60 flex items-center">
                  <Logo size="xs" className="mr-1 rtl:mr-0 rtl:ml-1" />
                  {t("app.classic")}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300",
                "rounded-xl shadow-md hover:shadow-lg hover:scale-105"
              )}
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-8 border-b-2 border-sidebar-border">
              <div
                className={cn(
                  "flex items-center space-x-4 rtl:space-x-reverse p-4 rounded-2xl",
                  "bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10",
                  "shadow-lg hover:shadow-xl transition-all duration-300"
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      "h-16 w-16 ring-2 ring-primary/30 shadow-lg",
                      "transition-all duration-300 hover:scale-105"
                    )}
                  >
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-xl">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Fixed online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sidebar-foreground font-medium text-lg truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sidebar-foreground/60 text-sm truncate">
                    {user.adminTypeName}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">
                      متصل
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-4">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t-2 border-sidebar-border">
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start space-x-4 rtl:space-x-reverse text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 px-6 py-4 h-auto text-base",
                "rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              )}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-destructive/10">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span>{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
