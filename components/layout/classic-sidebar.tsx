"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, X, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

interface ClassicSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClassicSidebar({ open, onOpenChange }: ClassicSidebarProps) {
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
      <div
        className={cn(
          "sidebar fixed inset-y-0 z-50 w-80 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 custom-scrollbar overflow-y-auto",
          direction === "rtl" ? "right-0" : "left-0",
          open ? "translate-x-0" : direction === "rtl" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-sidebar-border">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sidebar-foreground">لوحة التحكم</h1>
                <p className="text-sm text-sidebar-foreground/60">الإدارية</p>
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
          {user && (
            <div className="p-8 border-b border-sidebar-border">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-xl">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sidebar-foreground font-medium text-lg">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sidebar-foreground/60 text-sm">{user.adminTypeName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center space-x-4 rtl:space-x-reverse px-6 py-4 rounded-xl text-base font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  <Icon className="sidebar-icon w-6 h-6" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-sidebar-border">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start space-x-4 rtl:space-x-reverse text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 px-6 py-4 h-auto"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
