"use client";

import { Search, Settings, Menu, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

interface FloatingHeaderProps {
  onMenuClick: () => void;
}

export function FloatingHeader({ onMenuClick }: FloatingHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useI18n();
  const { user } = useAuth();

  return (
    <header
      className={cn(
        "fixed top-6 left-4 right-4 sm:left-8 sm:right-8 z-50 h-16",
        "bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-2xl",
        "rounded-2xl border border-border/60 shadow-2xl shadow-primary/10",
        "transition-all duration-500 hover:shadow-3xl hover:shadow-primary/15"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo/Title - Keep this for floating layout */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Logo
                size="sm"
                className="text-primary-foreground animate-pulse"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("app.title")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("app.floating")}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative group">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300",
                direction === "rtl" ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t("nav.search")}
              className={cn(
                "w-full h-11 rounded-xl border-0 bg-muted/50 backdrop-blur-sm shadow-sm",
                "focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-md",
                "transition-all duration-300",
                direction === "rtl" ? "pr-10 text-right" : "pl-10"
              )}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
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
              "h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            )}
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-10 px-3 rounded-xl hover:bg-primary/10",
                  "shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                )}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                      {user?.firstName.charAt(0)}
                      {user?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left rtl:text-right">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.adminTypeName}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className="w-56 mt-2 rounded-xl shadow-2xl"
              sideOffset={8}
            >
              <DropdownMenuLabel>{t("profile.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg">
                <Settings className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2" />
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive rounded-lg">
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
