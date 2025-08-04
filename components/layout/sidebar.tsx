"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, X, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isModern?: boolean
}

export function Sidebar({ open, onOpenChange, isModern = false }: SidebarProps) {
  const pathname = usePathname()
  const { t, direction } = useI18n()
  const { logout, user } = useAuth()

  const navigation = [
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

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className={isModern ? "sidebar-text" : ""}>
              <h1 className="text-xl font-bold text-sidebar-foreground">لوحة التحكم</h1>
              <p className="text-xs text-sidebar-foreground/60">الإدارية</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info */}
        {user && !isModern && (
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sidebar-foreground font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sidebar-foreground/60 text-sm truncate">{user.adminTypeName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modern User Avatar */}
        {user && isModern && (
          <div className="p-4 flex justify-center border-b border-sidebar-border">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-lg">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isModern && "justify-center md:justify-start",
                )}
                onClick={() => onOpenChange(false)}
              >
                <Icon className="w-5 h-5" />
                <span className={isModern ? "sidebar-text" : ""}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10",
              isModern ? "justify-center" : "justify-start space-x-3 rtl:space-x-reverse",
            )}
          >
            <LogOut className="w-5 h-5" />
            <span className={isModern ? "sidebar-text" : ""}>{t("nav.logout")}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
