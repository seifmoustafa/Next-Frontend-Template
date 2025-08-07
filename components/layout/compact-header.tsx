"use client";

import { Search, Menu, Sun, Moon, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { cn } from "@/lib/utils";
import { Logo } from "../ui/logo";

interface CompactHeaderProps {
  onMenuClick: () => void;
}

export function CompactHeader({ onMenuClick }: CompactHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useI18n();
  const { headerStyle, animationLevel, buttonStyle } = useSettings();

  const getHeaderStyleClass = () => {
    switch (headerStyle) {
      case "compact":
        return "h-14 px-3";
      case "elevated":
        return "h-16 px-4 shadow-lg";
      case "transparent":
        return "h-16 px-4 bg-transparent backdrop-blur-md";
      default:
        return "h-16 px-4";
    }
  };

  const getAnimationClass = () => {
    if (animationLevel === "none") return "";
    if (animationLevel === "minimal") return "transition-colors duration-200";
    if (animationLevel === "moderate") return "transition-all duration-300";
    return "transition-all duration-500";
  };

  const getButtonStyleClass = () => {
    switch (buttonStyle) {
      case "rounded":
        return "rounded-full";
      case "sharp":
        return "rounded-none";
      case "modern":
        return "rounded-2xl";
      default:
        return "rounded-xl";
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background via-background/98 to-background border-b border-border/80",
        "shadow-lg shadow-primary/5 backdrop-blur-xl",
        getHeaderStyleClass(),
        getAnimationClass()
      )}
    >
      <div className="flex items-center justify-between h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <Logo size="xs" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">
                {t("app.title")}
              </h1>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-8 w-8 hover:bg-primary/10",
              "shadow-sm hover:shadow-md hover:scale-105",
              getButtonStyleClass(),
              getAnimationClass()
            )}
            onClick={() => onchange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {/* Left Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden h-9 w-9 hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md hover:scale-105",
              getButtonStyleClass(),
              getAnimationClass()
            )}
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="relative group">
            <Search
              className={cn(
                "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary",
                getAnimationClass(),
                direction === "rtl" ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t("nav.search")}
              className={cn(
                "w-full h-9 border-0 bg-muted/50 shadow-sm",
                "focus:bg-background focus:ring-2 focus:ring-primary/20 focus:shadow-md",
                getAnimationClass(),
                getButtonStyleClass(),
                direction === "rtl" ? "pr-9 text-right" : "pl-9"
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
              "h-9 w-9 hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md hover:scale-105",
              getButtonStyleClass(),
              getAnimationClass()
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
              "h-9 w-9 hover:bg-primary/10 hover:text-primary",
              "shadow-sm hover:shadow-md hover:scale-105",
              getButtonStyleClass(),
              getAnimationClass()
            )}
            onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          >
            <Globe className="h-4 w-4" />
          </Button>

          {/* User Profile Dropdown */}
          <UserProfileDropdown variant="compact" showName={false} />
        </div>
      </div>
    </header>
  );
}
