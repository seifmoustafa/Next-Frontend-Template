"use client";

import type React from "react";
import {
  Search,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Globe,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useSettings } from "@/providers/settings-provider";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationHeaderProps {
  onMenuClick: () => void;
  onPanelToggle: () => void;
  panelOpen: boolean;
  hasPanel: boolean;
  selectedMainItem: string;
  isMobile: boolean;
}

export function NavigationHeader({
  onMenuClick,
  onPanelToggle,
  panelOpen,
  hasPanel,
  selectedMainItem,
  isMobile,
}: NavigationHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, direction, t, setLanguage } = useI18n();
  const { user, logout } = useAuth();
  const { colorTheme, cardStyle, animationLevel } = useSettings();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 h-16 backdrop-blur-xl border-b transition-all duration-300 header-shadow",
        cardStyle === "glass"
          ? "bg-background/80 border-border/30"
          : cardStyle === "solid"
          ? "bg-background border-border"
          : "bg-background/95 border-border/50"
      )}
    >
      {/* Header Content Container */}
      <div
        className={cn(
          "h-full flex items-center justify-between px-4 lg:px-6 transition-all duration-300",
          animationLevel !== "none" && "transition-all duration-300",
          // Dynamic margins based on sidebar states
          direction === "rtl"
            ? cn(
                isMobile ? "mr-0" : "mr-16", // Account for main sidebar on desktop
                !isMobile && panelOpen && hasPanel && "mr-80" // Account for panel sidebar when open
              )
            : cn(
                isMobile ? "ml-0" : "ml-16", // Account for main sidebar on desktop
                !isMobile && panelOpen && hasPanel && "ml-80" // Account for panel sidebar when open
              )
        )}
      >
        {/* Left Section - Mobile Menu + Panel Toggle + Title */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="sidebar-trigger hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Panel Toggle Button - Only show if there's a panel and not mobile */}
          {hasPanel && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPanelToggle}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground transition-colors",
                panelOpen
                  ? cn(
                      "text-white",
                      colorTheme === "blue" && "bg-blue-600 hover:bg-blue-700",
                      colorTheme === "purple" &&
                        "bg-purple-600 hover:bg-purple-700",
                      colorTheme === "green" &&
                        "bg-green-600 hover:bg-green-700",
                      colorTheme === "orange" &&
                        "bg-orange-600 hover:bg-orange-700",
                      colorTheme === "red" && "bg-red-600 hover:bg-red-700",
                      colorTheme === "teal" && "bg-teal-600 hover:bg-teal-700",
                      colorTheme === "pink" && "bg-pink-600 hover:bg-pink-700",
                      colorTheme === "indigo" &&
                        "bg-indigo-600 hover:bg-indigo-700",
                      colorTheme === "cyan" && "bg-cyan-600 hover:bg-cyan-700"
                    )
                  : "text-muted-foreground"
              )}
              title={
                panelOpen
                  ? t("layout.hide_panel") || "Hide Panel"
                  : t("layout.show_panel") || "Show Panel"
              }
            >
              {language === "ar" ? (
                panelOpen ? (
                  <PanelLeftOpen className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )
              ) : panelOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </Button>
          )}

          {/* App Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {t("app.title")}
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8 min-w-0 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder={t("layout.search_placeholder") || "Search here..."}
              className={cn(
                "w-full pl-10 pr-12 transition-all duration-200",
                cardStyle === "glass"
                  ? "bg-background/50 backdrop-blur-sm border-border/30"
                  : "bg-background/80 border-border",
                "focus:border-primary focus:ring-primary/20"
              )}
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
              /
            </kbd>
          </div>
        </div>

        {/* Right Section - Theme, Language, Profile */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Search Button for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent hover:text-accent-foreground md:hidden"
            title={t("layout.search")}
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
                title={t("layout.changeTheme")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                {t("theme.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                {t("theme.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                {t("theme.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
                title={t("layout.changeLanguage")}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border"
            >
              <DropdownMenuLabel>
                {t("layout.language")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                🇺🇸 {t("language.english")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                🇸🇦 {t("language.arabic")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <UserProfileDropdown
            variant="navigation"
            showName={!isMobile}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </header>
  );
}
