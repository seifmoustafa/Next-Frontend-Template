"use client"

import { Menu, Bell, Search, Sun, Moon, Globe, Monitor, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"

interface ElegantHeaderProps {
  onMenuClick: () => void
}

export function ElegantHeader({ onMenuClick }: ElegantHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, direction } = useI18n()
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

      <div className="relative flex items-center justify-between px-8 py-6">
        {/* Left side */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover-lift sidebar-trigger rounded-full bg-primary/10 hover:bg-primary/20"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Elegant Search */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-sm"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/70" />
              <Input
                placeholder={t("common.search")}
                className="pl-12 rtl:pl-4 rtl:pr-12 w-96 h-12 bg-background/50 border-primary/20 focus:border-primary/50 rounded-full backdrop-blur-sm transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
              />
              <div className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-primary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-lift rounded-full bg-muted/50 hover:bg-primary/10">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className="backdrop-blur-xl bg-background/90"
            >
              <DropdownMenuItem onClick={() => setLanguage("ar")}>🇸🇦 العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>🇺🇸 English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-lift rounded-full bg-muted/50 hover:bg-primary/10">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className="backdrop-blur-xl bg-background/90"
            >
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                فاتح
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                داكن
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                النظام
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover-lift rounded-full bg-muted/50 hover:bg-primary/10"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-primary to-primary/80 animate-pulse">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 rounded-full hover-lift bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    {user?.firstName.charAt(0)}
                    {user?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className="w-56 backdrop-blur-xl bg-background/90"
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.adminTypeName}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">الملف الشخصي</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">الإعدادات</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
