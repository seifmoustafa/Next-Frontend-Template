"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
  Shield,
  User,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ElegantSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
}

export function ElegantSidebar({ open, onOpenChange }: ElegantSidebarProps) {
  const pathname = usePathname()
  const { t, direction } = useI18n()
  const { logout, user } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Main navigation items - clean and simple
  const navigation: NavigationItem[] = [
    {
      name: t("nav.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: t("nav.users"),
      href: "/dashboard/users",
      icon: Users,
    },
    {
      name: t("nav.analytics"),
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "الملف الشخصي",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      name: t("nav.settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  /* 
  ============================================================================
  NESTED MENU DOCUMENTATION - HOW TO ADD CHILDREN ITEMS
  ============================================================================
  
  To add nested/children menu items, modify the navigation array like this:
  
  const navigation: NavigationItem[] = [
    {
      name: t("nav.users"),
      icon: Users,
      children: [
        {
          name: "إدارة المستخدمين",
          href: "/dashboard/users",
          icon: Users,
        },
        {
          name: "الأدوار والصلاحيات", 
          icon: Shield,
          children: [  // Nested children (3rd level)
            {
              name: "عرض الأدوار",
              href: "/dashboard/users/roles",
              icon: UserCheck,
            },
            {
              name: "إنشاء دور جديد", 
              href: "/dashboard/users/roles/create",
              icon: UserPlus,
            },
            {
              name: "صلاحيات متقدمة",
              icon: Settings,
              children: [  // 4th level nesting
                {
                  name: "صلاحيات النظام",
                  href: "/dashboard/users/permissions/system",
                  icon: Cog,
                },
                {
                  name: "صلاحيات المحتوى",
                  href: "/dashboard/users/permissions/content", 
                  icon: FileText,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: t("nav.analytics"),
      icon: BarChart3,
      children: [
        {
          name: "التحليلات الأساسية",
          href: "/dashboard/analytics",
          icon: BarChart3,
        },
        {
          name: "التقارير المتقدمة",
          icon: PieChart,
          children: [  // Nested children (3rd level)
            {
              name: "تقارير الأداء",
              href: "/dashboard/analytics/performance",
              icon: TrendingUp,
            },
            {
              name: "تحليل البيانات", 
              href: "/dashboard/analytics/data-analysis",
              icon: BarChart,
            },
          ],
        },
      ],
    },
  ]

  The renderNavigationItem function below already supports unlimited nesting levels.
  Just add the children array to any navigation item and it will automatically
  render as a collapsible menu with elegant gradient styling and smooth animations.
  
  Features:
  - Unlimited nesting levels
  - Gradient-based active states
  - Smooth hover and expand animations
  - Proper indentation with elegant spacing
  - Glass morphism effects
  - Active state indicators with dots
  
  ============================================================================
  */

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href && pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => isItemActive(child))
    }
    return false
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = isItemActive(item)
    const isExpanded = expandedItems.includes(item.name)
    const hasChildren = item.children && item.children.length > 0
    const Icon = item.icon

    if (hasChildren) {
      return (
        <Collapsible key={item.name} open={isExpanded} onOpenChange={() => toggleExpanded(item.name)}>
          <CollapsibleTrigger asChild>
            <div
              className={cn(
                "group flex items-center justify-between w-full px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 hover-lift cursor-pointer relative overflow-hidden",
                level > 0 && "ml-6 rtl:ml-0 rtl:mr-6 py-3 text-sm",
                isActive
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25"
                  : "text-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-foreground",
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
              )}
              <div className="flex items-center space-x-4 rtl:space-x-reverse relative z-10">
                <Icon className={cn("w-6 h-6", isActive && "drop-shadow-sm")} />
                <span>{item.name}</span>
              </div>
              <ChevronDown
                className={cn("w-5 h-5 transition-transform duration-300 relative z-10", isExpanded && "rotate-180")}
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
          "group flex items-center space-x-4 rtl:space-x-reverse px-6 py-4 rounded-2xl text-base font-medium transition-all duration-300 hover-lift relative overflow-hidden",
          level > 0 && "ml-6 rtl:ml-0 rtl:mr-6 py-3 text-sm",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/25"
            : "text-foreground/70 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-foreground",
        )}
        onClick={() => onOpenChange(false)}
      >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>}
        <Icon className={cn("w-6 h-6 relative z-10", isActive && "drop-shadow-sm")} />
        <span className="relative z-10">{item.name}</span>
        {isActive && (
          <div className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
        )}
      </Link>
    )
  }

  return (
    <>
      <div
        className={cn(
          "sidebar fixed inset-y-0 z-50 w-72 backdrop-blur-xl bg-background/80 border-r border-border/50 transform transition-all duration-500 ease-in-out lg:translate-x-0 custom-scrollbar overflow-y-auto",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

        <div className="relative flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-border/50">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  لوحة التحكم
                </h1>
                <p className="text-sm text-muted-foreground">الأنيقة</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-primary/10 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-8 border-b border-border/50">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-primary font-semibold text-xl">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium text-lg truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-muted-foreground text-sm truncate">{user.adminTypeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">{navigation.map((item) => renderNavigationItem(item))}</nav>

          {/* Footer */}
          <div className="p-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start space-x-4 rtl:space-x-reverse text-foreground/70 hover:text-destructive hover:bg-destructive/10 px-6 py-4 h-auto rounded-2xl transition-all duration-300 text-base"
            >
              <LogOut className="w-6 h-6" />
              <span>{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
