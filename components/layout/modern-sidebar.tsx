"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/providers/i18n-provider";
import { Logo } from "@/components/ui/logo";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  disabled?: boolean;
  children?: NavigationItem[];
}

interface ModernSidebarProps {
  navigation: NavigationItem[];
  className?: string;
}

interface NavItemProps {
  item: NavigationItem;
  pathname: string;
  t: (key: string) => string;
  level?: number;
}

function NavItem({ item, pathname, t, level = 0 }: NavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const indent = level * 16;
  const baseIndent = 16; // Base padding for all items

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      {item.href ? (
        <Link
          href={item.href}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            item.disabled && "pointer-events-none opacity-50"
          )}
          style={{ paddingLeft: `${baseIndent + indent}px` }}
        >
          {item.icon && (
            <item.icon className="h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110" />
          )}
          <span className="truncate">{t(item.label)}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded();
              }}
              className="ml-auto p-0.5 hover:bg-accent-foreground/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
        </Link>
      ) : (
        <button
          onClick={toggleExpanded}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground text-left",
            item.disabled && "pointer-events-none opacity-50"
          )}
          style={{ paddingLeft: `${baseIndent + indent}px` }}
        >
          {item.icon && (
            <item.icon className="h-4 w-4 shrink-0 transition-all duration-200 group-hover:scale-110" />
          )}
          <span className="truncate">{t(item.label)}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <div className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          )}
        </button>
      )}

      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItem
              key={child.id}
              item={child}
              pathname={pathname}
              t={t}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ModernSidebar({ navigation, className }: ModernSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-background border-r",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Logo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            pathname={pathname}
            t={t}
            level={0}
          />
        ))}
      </nav>
    </div>
  );
}
