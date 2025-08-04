"use client"

import { Menu, Bell, Search, Sun, Moon, Globe, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ClassicHeaderProps {
  onMenuClick: () => void
}

export function ClassicHeader({ onMenuClick }: ClassicHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, direction } = useI18n()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-background border-b-2 border-border">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="text-2xl font-bold">لوحة التحكم</div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className="pl-10 rtl:pl-4 rtl:pr-10 w-64 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
          </div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-lift">
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"}>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>🇸🇦 العربية</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")}>🇺🇸 English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-lift">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"}>
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary">
              3
            </Badge>
          </Button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.firstName.charAt(0)}
                {user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user?.adminTypeName}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
