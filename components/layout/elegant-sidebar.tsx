"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, X, ChevronDown, ChevronRight, Sparkles, Crown, Star } from "lucide-react"
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
                "group flex items-center justify-between w-full px-5 py-5 rounded-3xl text-sm font-semibold transition-all duration-700 cursor-pointer relative overflow-hidden",
                level > 0 && "ml-6 rtl:ml-0 rtl:mr-6",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary via-primary/95 to-primary/85 text-primary-foreground shadow-2xl shadow-primary/40"
                  : "text-foreground/85 hover:bg-gradient-to-r hover:from-primary/15 hover:via-primary/8 hover:to-primary/15 hover:text-primary hover:shadow-xl hover:shadow-primary/15",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:via-white/5 before:to-white/15 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
              )}
            >
              <div className="flex items-center space-x-5 rtl:space-x-reverse relative z-10">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-3xl transition-all duration-700 relative",
                    level === 0 ? "w-14 h-14" : "w-12 h-12",
                    isActive
                      ? "bg-white/25 shadow-xl"
                      : "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 group-hover:from-primary/25 group-hover:via-primary/15 group-hover:to-primary/10",
                    "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/25 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
                    "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-transparent after:via-white/10 after:to-transparent after:animate-pulse after:opacity-50",
                  )}
                >
                  <Icon
                    className={cn(
                      level === 0 ? "w-7 h-7" : "w-6 h-6",
                      isActive ? "text-white drop-shadow-sm" : "text-primary",
                      "transition-all duration-500 group-hover:scale-110 relative z-10",
                    )}
                  />
                </div>
                <span className="truncate font-bold tracking-wide">{item.name}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs h-7 px-3 border-0 font-bold tracking-wide",
                      isActive
                        ? "bg-white/25 text-white shadow-lg"
                        : "bg-gradient-to-r from-primary/15 to-primary/10 text-primary shadow-md",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-6 h-6 transition-all duration-700 relative z-10",
                  isExpanded && "rotate-180",
                  isActive ? "text-white" : "text-primary",
                  "group-hover:scale-110",
                )}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
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
          "group flex items-center justify-between px-5 py-5 rounded-3xl text-sm font-semibold transition-all duration-700 relative overflow-hidden",
          level > 0 && "ml-6 rtl:ml-0 rtl:mr-6",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary via-primary/95 to-primary/85 text-primary-foreground shadow-2xl shadow-primary/40"
            : "text-foreground/85 hover:bg-gradient-to-r hover:from-primary/15 hover:via-primary/8 hover:to-primary/15 hover:text-primary hover:shadow-xl hover:shadow-primary/15",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/15 before:via-white/5 before:to-white/15 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
          "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500",
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-5 rtl:space-x-reverse relative z-10">
          <div
            className={cn(
              "flex items-center justify-center rounded-3xl transition-all duration-700 relative",
              level === 0 ? "w-14 h-14" : "w-12 h-12",
              isActive
                ? "bg-white/25 shadow-xl"
                : "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 group-hover:from-primary/25 group-hover:via-primary/15 group-hover:to-primary/10",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/25 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
              "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-transparent after:via-white/10 after:to-transparent after:animate-pulse after:opacity-50",
            )}
          >
            <Icon
              className={cn(
                level === 0 ? "w-7 h-7" : "w-6 h-6",
                isActive ? "text-white drop-shadow-sm" : "text-primary",
                "transition-all duration-500 group-hover:scale-110 relative z-10",
              )}
            />
          </div>
          <span className="truncate font-bold tracking-wide">{item.name}</span>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse relative z-10">
          {item.badge && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs h-7 px-3 border-0 font-bold tracking-wide",
                isActive
                  ? "bg-white/25 text-white shadow-lg"
                  : "bg-gradient-to-r from-primary/15 to-primary/10 text-primary shadow-md",
              )}
            >
              {item.badge}
            </Badge>
          )}
          {level === 0 && (
            <ChevronRight
              className={cn(
                "w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-1",
                isActive ? "text-white" : "text-primary",
                "group-hover:scale-110",
              )}
            />
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 z-40 w-80 xl:w-72",
          "bg-gradient-to-b from-background/99 via-background/97 to-background/99",
          "backdrop-blur-3xl border-r border-gradient-to-b from-border/40 via-border/60 to-border/40",
          "shadow-2xl shadow-primary/15",
          "transform transition-all duration-700 ease-out lg:translate-x-0 overflow-y-auto",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-primary/8 before:via-primary/4 before:to-primary/8 before:opacity-60",
          "after:absolute after:top-0 after:bottom-0 after:right-0 after:w-px after:bg-gradient-to-b after:from-transparent after:via-primary/40 after:to-transparent",
        )}
      >
        <div className="relative flex flex-col h-full">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-24 -left-12 w-40 h-40 bg-gradient-to-br from-primary/12 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-80 -right-12 w-32 h-32 bg-gradient-to-bl from-primary/18 to-transparent rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute bottom-60 -left-8 w-36 h-36 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-2000" />
            <div className="absolute bottom-24 -right-10 w-28 h-28 bg-gradient-to-tl from-primary/15 to-transparent rounded-full blur-2xl animate-pulse delay-3000" />

            {/* Floating particles */}
            <Star className="absolute top-32 left-8 w-3 h-3 text-primary/30 animate-pulse" />
            <Sparkles className="absolute top-64 right-12 w-4 h-4 text-primary/40 animate-bounce delay-500" />
            <Crown className="absolute bottom-80 left-12 w-3 h-3 text-primary/35 animate-pulse delay-1000" />
          </div>

          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden absolute top-4 right-4 h-12 w-12 rounded-full z-50",
              "bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20",
              "hover:from-primary/15 hover:via-primary/10 hover:to-primary/5",
              "border border-border/60 hover:border-primary/40",
              "shadow-xl hover:shadow-2xl hover:shadow-primary/15",
              "transition-all duration-500 ease-out",
              "hover:scale-110 active:scale-95",
              "backdrop-blur-xl",
            )}
            onClick={() => onOpenChange(false)}
          >
            <X className="w-6 h-6 text-primary" />
          </Button>

          {/* User Info - Enhanced and moved to top */}
          {user && (
            <div className="relative mt-16 p-8 pt-10 border-b border-gradient-to-r from-transparent via-border/60 to-transparent">
              <div
                className={cn(
                  "flex items-center space-x-5 rtl:space-x-reverse p-6 rounded-3xl",
                  "bg-gradient-to-br from-primary/8 via-primary/4 to-transparent",
                  "border border-primary/15",
                  "shadow-xl shadow-primary/10",
                  "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/15",
                  "backdrop-blur-xl",
                  "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      "h-16 w-16",
                      "ring-4 ring-primary/30",
                      "shadow-2xl shadow-primary/40",
                      "transition-all duration-500 hover:scale-110",
                    )}
                  >
                    <AvatarFallback
                      className={cn(
                        "bg-gradient-to-br from-primary/25 via-primary/20 to-primary/15",
                        "text-primary font-bold text-xl",
                        "border-2 border-primary/30",
                      )}
                    >
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Fixed online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-background shadow-lg">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-foreground truncate tracking-wide">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground/90 truncate font-semibold tracking-wide">
                    {user.adminTypeName}
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 rtl:mr-0 rtl:ml-3 animate-pulse shadow-lg shadow-green-500/50" />
                    <span className="text-xs text-green-600 font-bold tracking-widest uppercase">ONLINE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="relative flex-1 p-6 space-y-4 overflow-y-auto">
            {navigation.map((item) => renderNavigationItem(item))}
          </nav>

          {/* Footer - Enhanced */}
          <div className="relative p-6 border-t border-gradient-to-r from-transparent via-border/60 to-transparent">
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full justify-start space-x-5 rtl:space-x-reverse px-6 py-6 h-auto rounded-3xl",
                "text-foreground/85 hover:text-destructive",
                "bg-gradient-to-r from-muted/40 via-muted/30 to-muted/20",
                "hover:from-destructive/15 hover:via-destructive/8 hover:to-destructive/15",
                "border border-border/40 hover:border-destructive/40",
                "shadow-lg hover:shadow-xl hover:shadow-destructive/15",
                "transition-all duration-500 ease-out",
                "hover:scale-105 active:scale-95",
                "backdrop-blur-xl",
                "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-3xl",
                  "bg-gradient-to-br from-destructive/15 via-destructive/10 to-destructive/5",
                  "transition-all duration-500",
                  "shadow-lg",
                )}
              >
                <LogOut className="w-6 h-6 text-destructive" />
              </div>
              <span className="font-bold text-lg tracking-wide">{t("nav.logout")}</span>
            </Button>
            <div className="text-xs text-muted-foreground/70 text-center mt-6 font-bold tracking-widest uppercase">
              v2.1.0 • ELEGANT DESIGN SYSTEM
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
