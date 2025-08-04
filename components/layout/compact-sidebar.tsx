"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, X, Shield, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getNavigationItems, isNavigationItemActive, type NavigationItem } from "@/config/navigation"

interface CompactSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompactSidebar({ open, onOpenChange }: CompactSidebarProps) {
  const pathname = usePathname()
  const { t, direction } = useI18n()
  const { logout, user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Get navigation items with translations
  const navigation = getNavigationItems(t)

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isNavigationItemActive(item, pathname)
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    if (hasChildren) {
      return (
        <Collapsible key={item.name} open={isExpanded} onOpenChange={() => toggleExpanded(item.name)}>
          <CollapsibleTrigger asChild>
            <div
              className={cn(
                "group flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs h-5 px-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-1">
            {item.children?.map((child) => renderNavigationItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href || "#"}
        className={cn(
          "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{item.name}</span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {item.badge && (
            <Badge variant="secondary" className="text-xs h-5 px-2">
              {item.badge}
            </Badge>
          )}
          {level === 0 && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn(
          "sidebar fixed inset-y-0 z-50 w-72 bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Improved Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">المدمجة</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Improved User Info */}
          {user && (
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.adminTypeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Improved Navigation */}
          <nav className="flex-1 p-4 space-y-2">{navigation.map((item) => renderNavigationItem(item))}</nav>

          {/* Improved Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start space-x-3 rtl:space-x-reverse text-foreground/80 hover:text-destructive hover:bg-destructive/10 px-3 py-2.5 h-auto rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span>{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
