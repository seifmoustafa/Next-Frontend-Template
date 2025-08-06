"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, type NavigationItem } from "@/config/navigation";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { Logo } from "@/components/ui/logo";

export function NavigationSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { sidebarPosition } = useSettings();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => isItemActive(child));
    }
    return false;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const displayName = item.name.startsWith("nav.") ? t(item.name) : item.name;

    const itemClasses = cn(
      "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
      "hover:bg-slate-800/60 hover:text-white",
      level === 0 && "mx-2",
      level > 0 && `ml-${4 + level * 4} mr-2`,
      isActive && "bg-blue-600/20 text-blue-400 border-r-2 border-blue-500",
      item.disabled && "opacity-50 cursor-not-allowed"
    );

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className={itemClasses}
            disabled={item.disabled}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-right">
              {displayName}
            </span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                {item.badge}
              </span>
            )}
            {sidebarPosition === "right" ? (
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
            ) : (
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </button>

          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children?.map((child) =>
                renderNavigationItem(child, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link key={item.name} href={item.href || "#"} className={itemClasses}>
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium text-right">
          {displayName}
        </span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-slate-950 border-l border-slate-800 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <div className="flex-1 text-right">
            <h1 className="text-lg font-bold text-white leading-tight">
              منظومة إدارة العقود والسيطرة علي مخزون العالم كله
            </h1>
            <p className="text-xs text-slate-400 mt-1">النسخة المتقدمة</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => renderNavigationItem(item))}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            SM
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium text-white">Seif Moustafa</p>
            <p className="text-xs text-slate-400">SuperAdmin</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}
