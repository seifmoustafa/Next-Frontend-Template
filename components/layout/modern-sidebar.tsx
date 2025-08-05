"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LogOut, X, Shield, ChevronDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getNavigationItems, isNavigationItemActive, type NavigationItem } from "@/config/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ModernSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onHoverChange: (hovered: boolean) => void
}

export function ModernSidebar({ open, onOpenChange, onHoverChange }: ModernSidebarProps) {
  const pathname = usePathname()
  const { t, direction } = useI18n()
  const { logout, user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isHovered, setIsHovered] = useState(false)

  // Get navigation items with translations
  const navigation = getNavigationItems(t)

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverChange(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverChange(false)
  }

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
                "group flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer",
                level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
                item.disabled && "opacity-50 cursor-not-allowed",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-md",
              )}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-300",
                    "w-12 h-12",
                    isActive ? "bg-white/20 shadow-md" : "bg-primary/10 group-hover:bg-primary/20",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                      isActive ? "text-white" : "text-primary",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "transition-opacity duration-300",
                    !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                  )}
                >
                  {item.name}
                </span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-auto text-xs",
                      !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                      isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-all duration-300 flex-shrink-0",
                  !isHovered && "lg:opacity-0",
                  isExpanded && "rotate-180",
                  isActive ? "text-white" : "text-primary",
                )}
              />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
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
          "group flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300",
          level > 0 && "ml-4 rtl:ml-0 rtl:mr-4",
          item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
            : "text-sidebar-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary hover:shadow-md",
        )}
        onClick={() => !item.disabled && onOpenChange(false)}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300",
            "w-12 h-12",
            isActive ? "bg-white/20 shadow-md" : "bg-primary/10 group-hover:bg-primary/20",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
              isActive ? "text-white" : "text-primary",
            )}
          />
        </div>
        <span className={cn("transition-opacity duration-300", !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden")}>
          {item.name}
        </span>
        {item.badge && (
          <Badge
            variant="secondary"
            className={cn(
              "ml-auto text-xs",
              !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
              isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
            )}
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn(
          "sidebar fixed inset-y-0 z-50 bg-gradient-to-b from-sidebar via-sidebar/98 to-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out lg:translate-x-0 custom-scrollbar overflow-y-auto",
          "shadow-2xl shadow-primary/10 backdrop-blur-sm",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
          isHovered ? "w-80" : "w-20",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div
                className={cn(
                  "w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0",
                  "shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
                )}
              >
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div
                className={cn(
                  "transition-opacity duration-300",
                  !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                )}
              >
                                 <h1 className="text-xl font-bold text-sidebar-foreground whitespace-nowrap">{t("app.title")}</h1>
                 <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap flex items-center">
                   <Sparkles className="w-2 h-2 mr-1 rtl:mr-0 rtl:ml-1" />
                   {t("app.modern")}
                 </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0",
                "rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105",
              )}
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-sidebar-border">
                             <div
                 className={cn(
                   "flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-2xl",
                   "bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10",
                   "shadow-sm hover:shadow-md transition-all duration-300",
                 )}
               >
                                                   <div className="relative">
                    <Avatar
                      className={cn(
                        "h-10 w-10 ring-1 ring-primary/20 shadow-md flex-shrink-0",
                        "transition-all duration-300 hover:scale-105",
                      )}
                    >
                     <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                       {user.firstName.charAt(0)}
                       {user.lastName.charAt(0)}
                     </AvatarFallback>
                   </Avatar>
                   {/* Fixed online indicator - positioned inside container */}
                   <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background shadow-sm">
                     <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
                   </div>
                 </div>
                <div
                  className={cn(
                    "flex-1 min-w-0 transition-opacity duration-300",
                    !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                  )}
                >
                  <p className="text-sidebar-foreground font-medium truncate text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sidebar-foreground/60 text-xs truncate">{user.adminTypeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2">{navigation.map((item) => renderNavigationItem(item))}</nav>

          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={logout}
              className={cn(
                "w-full text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all duration-300",
                "rounded-xl shadow-sm hover:shadow-md hover:scale-105",
                isHovered ? "justify-start space-x-3 rtl:space-x-reverse" : "justify-center",
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 flex-shrink-0">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span
                className={cn(
                  "transition-opacity duration-300",
                  !isHovered && "lg:opacity-0 lg:w-0 lg:overflow-hidden",
                )}
              >
                {t("nav.logout")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
