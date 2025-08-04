"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, X, Shield, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getNavigationItems, isNavigationItemActive, type NavigationItem } from "@/config/navigation"

interface FloatingNavigationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FloatingNavigation({ open, onOpenChange }: FloatingNavigationProps) {
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
                "group flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-background/60 text-foreground/80 hover:bg-background/80 hover:text-foreground",
              )}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
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
          "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-background/60 text-foreground/80 hover:bg-background/80 hover:text-foreground",
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Icon className="w-4 h-4" />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <Badge variant="secondary" className="text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Improved Floating Navigation */}
      <div
        className={cn(
          "fixed top-24 z-50 w-80 transform transition-all duration-300 ease-in-out lg:translate-x-0",
          direction === "rtl" ? "right-6" : "left-6",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">لوحة التحكم</h1>
                <p className="text-xs text-muted-foreground">العائمة</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border/50">
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
                  <p className="font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">{user.adminTypeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="p-4">
            <nav className="space-y-2">{navigation.map((item) => renderNavigationItem(item))}</nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start space-x-3 rtl:space-x-reverse text-foreground/80 hover:text-destructive hover:bg-destructive/10 rounded-xl"
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
