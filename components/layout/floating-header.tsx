"use client";

import { Search, Menu, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useLayoutStyles } from "./use-layout-styles";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

interface FloatingHeaderProps {
  onMenuClick: () => void;
}

export function FloatingHeader({ onMenuClick }: FloatingHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useI18n();
  const {
    getHeaderStyleClass,
    getAnimationClass,
    getButtonStyleClass,
  } = useLayoutStyles();

  const headerClass = getHeaderStyleClass({
    compact: "h-14 top-4",
    elevated: "h-16 top-6 shadow-3xl shadow-primary/20",
    transparent: "h-16 top-6 bg-transparent backdrop-blur-3xl",
    default: "h-16 top-6",
  });

  const animationClass = getAnimationClass({
    default: "transition-all duration-500 hover:shadow-3xl hover:shadow-primary/15",
  });

  const buttonClass = getButtonStyleClass({
    modern: "rounded-3xl",
    default: "rounded-2xl",
  });

  return (
    <header
      className={cn(
        "fixed left-4 right-4 sm:left-8 sm:right-8 z-50",
        "bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-2xl",
        "border border-border/60 shadow-2xl shadow-primary/10",
        headerClass,
        buttonClass,
        animationClass
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
              "lg:hidden h-10 w-10 hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg hover:scale-105",
              buttonClass,
              animationClass
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo/Title - Keep this for floating layout */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div
              className={cn(
                "w-10 h-10 bg-primary flex items-center justify-center shadow-lg",
                buttonClass
              )}
            >
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
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary",
                animationClass,
                direction === "rtl" ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t("nav.search")}
              className={cn(
                "w-full h-11 border-0 bg-muted/50 backdrop-blur-sm shadow-sm",
                "focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-md",
                buttonClass,
                animationClass,
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
              "h-10 w-10 hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg hover:scale-105",
              buttonClass,
              animationClass
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
              "h-10 w-10 hover:bg-primary/10 hover:text-primary",
              "shadow-md hover:shadow-lg hover:scale-105",
              buttonClass,
              animationClass
            )}
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* User Profile Dropdown */}
          <UserProfileDropdown variant="floating" showName={false} />
        </div>
      </div>
    </header>
  );
}
