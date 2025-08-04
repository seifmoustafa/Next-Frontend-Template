"use client"

import { Menu, Search, Sun, Moon, Globe, Monitor, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ClassicHeaderProps {
  onMenuClick: () => void
}

export function ClassicHeader({ onMenuClick }: ClassicHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, direction } = useI18n()
  const { user } = useAuth()

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-gradient-to-r from-background via-background/95 to-background border-b-2 border-border/80",
        "shadow-lg shadow-primary/5 backdrop-blur-sm",
      )}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300",
              "rounded-xl shadow-md hover:shadow-lg hover:scale-105",
            )}
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80",
                "flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300",
              )}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              لوحة التحكم
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className={cn(
                "pl-10 rtl:pl-4 rtl:pr-10 w-64 bg-muted/50 border-0 focus:bg-background transition-all duration-300",
                "rounded-xl shadow-sm focus:shadow-md hover:shadow-md",
              )}
            />
          </div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-all duration-300",
                  "rounded-xl shadow-md hover:shadow-lg hover:scale-105",
                )}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="rounded-xl shadow-xl">
              <DropdownMenuItem onClick={() => setLanguage("ar")} className="rounded-lg">
                🇸🇦 العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} className="rounded-lg">
                🇺🇸 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-all duration-300",
                  "rounded-xl shadow-md hover:shadow-lg hover:scale-105",
                )}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="rounded-xl shadow-xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="rounded-lg">
                <Sun className="mr-2 h-4 w-4" />
                فاتح
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="rounded-lg">
                <Moon className="mr-2 h-4 w-4" />
                داكن
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="rounded-lg">
                <Monitor className="mr-2 h-4 w-4" />
                النظام
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>



          {/* User Avatar */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar
              className={cn(
                "h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300",
                "shadow-lg hover:shadow-xl hover:scale-105",
              )}
            >
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {user?.firstName.charAt(0)}
                {user?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="font-medium text-foreground">
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
