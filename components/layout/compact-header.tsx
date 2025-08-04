"use client"

import { Search, Bell, Settings, Menu, Sun, Moon, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useI18n } from "@/providers/i18n-provider"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

interface CompactHeaderProps {
  onMenuClick: () => void
}

export function CompactHeader({ onMenuClick }: CompactHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t, direction } = useI18n()
  const { user } = useAuth()

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 bg-gradient-to-r from-background via-background/98 to-background border-b border-border/80",
        "shadow-lg shadow-primary/5 backdrop-blur-xl",
      )}
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105",
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>

          {/* Title - Hidden on small screens */}
          <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t("nav.dashboard")}
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative group">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300",
                direction === "rtl" ? "right-3" : "left-3",
              )}
            />
            <Input
              placeholder={t("nav.search")}
              className={cn(
                "w-full h-9 rounded-xl border-0 bg-muted/50 shadow-sm",
                "focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-md",
                "transition-all duration-300",
                direction === "rtl" ? "pr-9 text-right" : "pl-9",
              )}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105",
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105",
            )}
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl relative hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105",
            )}
          >
            <Bell className="h-4 w-4" />
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs",
                "bg-gradient-to-br from-red-500 to-red-600 shadow-md animate-pulse",
              )}
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 px-2 rounded-xl hover:bg-primary/10",
                  "shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105",
                )}
              >
                <Avatar className="h-7 w-7 ring-1 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                    {user?.firstName.charAt(0)}
                    {user?.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-48 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-sm">
                {user?.firstName} {user?.lastName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm rounded-lg">
                <Settings className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive text-sm rounded-lg">{t("nav.logout")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
