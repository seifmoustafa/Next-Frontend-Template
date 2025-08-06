"use client";

import { Search, Settings, Menu, Sun, Moon, Globe, Zap } from "lucide-react";
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

interface ElegantHeaderProps {
  onMenuClick: () => void;
}

export function ElegantHeader({ onMenuClick }: ElegantHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useI18n();
  const { user } = useAuth();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-20",
        "bg-gradient-to-r from-background/98 via-background/95 to-background/98",
        "backdrop-blur-3xl border-b border-gradient-to-r from-transparent via-border/60 to-transparent",
        "shadow-2xl shadow-primary/10",
        "transition-all duration-700 ease-out",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/8 before:via-primary/4 before:to-primary/8 before:opacity-60",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/50 after:to-transparent"
      )}
    >
      <div className="relative flex items-center justify-between h-full px-6 lg:px-8 z-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-2xl animate-pulse" />
          <div className="absolute -top-4 -right-10 w-40 h-40 bg-gradient-to-bl from-primary/12 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-2 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-sm animate-pulse delay-2000" />
        </div>

        {/* Left Section */}
        <div className="relative flex items-center space-x-4 rtl:space-x-reverse z-20">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-12 w-12 rounded-3xl",
              "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5",
              "hover:from-primary/25 hover:via-primary/15 hover:to-primary/10",
              "border border-primary/20 hover:border-primary/40",
              "shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30",
              "transition-all duration-500 ease-out",
              "hover:scale-110 active:scale-95",
              "backdrop-blur-xl",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5 text-primary drop-shadow-sm" />
          </Button>

          {/* Logo/Title - Enhanced with gradients and animations */}
          <div className="hidden md:flex items-center space-x-5 rtl:space-x-reverse">
            <div
              className={cn(
                "relative w-14 h-14 rounded-3xl",
                "bg-gradient-to-br from-primary via-primary/90 to-primary/70",
                "shadow-2xl shadow-primary/40",
                "flex items-center justify-center",
                "transition-all duration-700 ease-out",
                "hover:shadow-3xl hover:shadow-primary/50 hover:scale-110",
                "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/25 before:via-white/10 before:to-transparent before:opacity-100",
                "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-transparent after:via-white/15 after:to-transparent after:animate-pulse",
                "group cursor-pointer"
              )}
            >
              <Logo
                size="lg"
                variant="default"
                className="relative z-10 group-hover:animate-spin transition-transform duration-700"
              />
              <Zap className="absolute top-1 right-1 w-4 h-4 text-primary-foreground/80 animate-pulse" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse opacity-50" />
            </div>
            <div className="space-y-1">
              <h1
                className={cn(
                  "text-2xl font-bold tracking-tight",
                  "bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent",
                  "animate-gradient-x drop-shadow-sm"
                )}
              >
                {t("app.title")}
              </h1>
              {/* <p className="text-sm text-muted-foreground/90 font-semibold tracking-widest uppercase flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full mr-2 rtl:mr-0 rtl:ml-2 animate-pulse" />
                ELEGANT DESIGN
              </p> */}
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="flex-1 max-w-2xl mx-8 lg:mx-12">
          <div className="relative group">
            <div
              className={cn(
                "absolute inset-0 rounded-3xl",
                "bg-gradient-to-r from-primary/15 via-primary/8 to-primary/15",
                "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                "transition-all duration-500 ease-out",
                "blur-lg group-hover:blur-sm group-focus-within:blur-sm",
                "scale-105 group-hover:scale-100 group-focus-within:scale-100"
              )}
            />
            <div
              className={cn(
                "absolute inset-0 rounded-3xl",
                "bg-gradient-to-r from-background/80 via-background/90 to-background/80",
                "backdrop-blur-xl border border-border/50",
                "group-focus-within:border-primary/40 group-hover:border-primary/30",
                "transition-all duration-500 ease-out",
                "shadow-lg group-focus-within:shadow-xl group-focus-within:shadow-primary/20"
              )}
            />
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-5 w-5 z-10",
                "text-muted-foreground/60 group-focus-within:text-primary group-hover:text-primary/80",
                "transition-all duration-500 ease-out",
                "group-focus-within:scale-110",
                direction === "rtl" ? "right-5" : "left-5"
              )}
            />
            <Input
              placeholder={t("nav.search")}
              className={cn(
                "relative w-full h-14 rounded-3xl border-0 bg-transparent z-10",
                "text-base font-medium",
                "focus:ring-0 focus:outline-none",
                "transition-all duration-500 ease-out",
                "placeholder:text-muted-foreground/60 placeholder:font-medium",
                direction === "rtl" ? "pr-14 text-right" : "pl-14"
              )}
            />
          </div>
        </div>

        {/* Right Section - Enhanced buttons */}
        <div className="relative flex items-center space-x-4 rtl:space-x-reverse z-20">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-3xl",
              "bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20",
              "hover:from-primary/15 hover:via-primary/10 hover:to-primary/5",
              "border border-border/60 hover:border-primary/40",
              "shadow-lg hover:shadow-xl hover:shadow-primary/15",
              "transition-all duration-500 ease-out",
              "hover:scale-110 active:scale-95",
              "backdrop-blur-xl",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-700 dark:-rotate-180 dark:scale-0 text-primary" />
            <Moon className="absolute h-5 w-5 rotate-180 scale-0 transition-all duration-700 dark:rotate-0 dark:scale-100 text-primary" />
          </Button>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-3xl",
              "bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20",
              "hover:from-primary/15 hover:via-primary/10 hover:to-primary/5",
              "border border-border/60 hover:border-primary/40",
              "shadow-lg hover:shadow-xl hover:shadow-primary/15",
              "transition-all duration-500 ease-out",
              "hover:scale-110 active:scale-95",
              "backdrop-blur-xl",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            )}
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            <Globe className="h-5 w-5 text-primary" />
          </Button>

          {/* User Menu - Enhanced */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-14 px-5 rounded-3xl",
                  "bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20",
                  "hover:from-primary/15 hover:via-primary/10 hover:to-primary/5",
                  "border border-border/60 hover:border-primary/40",
                  "shadow-lg hover:shadow-xl hover:shadow-primary/15",
                  "transition-all duration-500 ease-out",
                  "hover:scale-105 active:scale-95",
                  "backdrop-blur-xl",
                  "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                )}
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Avatar
                    className={cn(
                      "h-9 w-9",
                      "ring-2 ring-primary/40 hover:ring-primary/60",
                      "shadow-xl shadow-primary/30",
                      "transition-all duration-500",
                      "hover:scale-110"
                    )}
                  >
                    <AvatarFallback
                      className={cn(
                        "bg-gradient-to-br from-primary/25 via-primary/15 to-primary/10",
                        "text-primary font-bold text-sm",
                        "border border-primary/20"
                      )}
                    >
                      {user?.firstName.charAt(0)}
                      {user?.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left rtl:text-right">
                    <p className="text-sm font-bold text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground/90 font-medium">
                      {user?.adminTypeName}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className={cn(
                "w-72 mt-3 p-3",
                "bg-background/98 backdrop-blur-3xl",
                "border border-border/60",
                "shadow-2xl shadow-primary/15",
                "rounded-3xl",
                "animate-in slide-in-from-top-2 duration-300"
              )}
              sideOffset={8}
            >
              <DropdownMenuLabel className="text-lg font-bold px-2 py-3">
                {t("profile.title")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              <DropdownMenuItem
                className={cn(
                  "rounded-2xl p-4 my-2",
                  "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
                  "transition-all duration-300",
                  "cursor-pointer"
                )}
              >
                <Settings className="mr-3 h-5 w-5 rtl:mr-0 rtl:ml-3" />
                <span className="font-medium">{t("nav.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />
              <DropdownMenuItem
                className={cn(
                  "rounded-2xl p-4 my-2",
                  "text-destructive hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5",
                  "transition-all duration-300",
                  "cursor-pointer"
                )}
              >
                <span className="font-medium">{t("nav.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
