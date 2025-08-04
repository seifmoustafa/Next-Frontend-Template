"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, X, Shield, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getNavigationItems, isNavigationItemActive, type NavigationItem } from "@/config/navigation"

interface ElegantSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ElegantSidebar({ open, onOpenChange }: ElegantSidebarProps) {
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
                "group flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
              )}
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-xl transition-all duration-300",
                    level === 0 ? "w-10 h-10" : "w-8 h-8",
                    isActive ? "bg-white/20" : "bg-primary/10",
                  )}
                >
                  <Icon className={cn(level === 0 ? "w-5 h-5" : "w-4 h-4", isActive ? "text-white" : "text-primary")} />
                </div>
                <span className="truncate font-medium">{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs h-6 px-2 bg-primary/10 text-primary border-0">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
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
          "group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
            : "text-foreground/80 hover:bg-primary/10 hover:text-primary",
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div
            className={cn(
              "flex items-center justify-center rounded-xl transition-all duration-300",
              level === 0 ? "w-10 h-10" : "w-8 h-8",
              isActive ? "bg-white/20" : "bg-primary/10",
            )}
          >
            <Icon className={cn(level === 0 ? "w-5 h-5" : "w-4 h-4", isActive ? "text-white" : "text-primary")} />
          </div>
          <span className="truncate font-medium">{item.name}</span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {item.badge && (
            <Badge variant="secondary" className="text-xs h-6 px-2 bg-primary/10 text-primary border-0">
              {item.badge}
            </Badge>
          )}
          {level === 0 && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </div>
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 z-40 w-80 xl:w-72 bg-background/95 backdrop-blur-xl border-r border-border/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pt-8 border-b border-border/50">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {t("nav.dashboard")}
                </h1>
                <p className="text-sm text-muted-foreground">Elegant</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="relative">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{user.adminTypeName}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 rtl:mr-0 rtl:ml-2"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start space-x-4 rtl:space-x-reverse text-foreground/80 hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="font-medium">{t("nav.logout")}</span>
            </Button>
            <div className="text-xs text-muted-foreground text-center mt-4">v2.1.0 • Elegant Design</div>
          </div>
        </div>
      </div>
    </>
  )
}
