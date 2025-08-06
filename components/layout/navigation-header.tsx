"use client";

import type React from "react";
import {
  Search,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  LogOut,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useSettings } from "@/providers/settings-provider";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const getUserInitials = () => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 h-16 backdrop-blur-xl border-b transition-all duration-300",
        cardStyle === "glass"
          ? "bg-background/80 border-border/30"
          : cardStyle === "solid"
          ? "bg-background border-border"
          : "bg-background/95 border-border/50"
      )}
    >
      {/* Header Content Container - This is what adapts to sidebar states */}
      <div
        className={cn(
          "h-full flex items-center justify-between px-4 lg:px-6 gap-4 transition-all duration-300",
          animationLevel !== "none" && "transition-all duration-300",
          // Dynamic margins based on sidebar states - content starts after sidebars
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
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
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
                      colorTheme === "teal" && "bg-teal-600 hover:bg-teal-700"
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
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md min-w-0">
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

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent hover:text-accent-foreground"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-popover border-border"
            >
              <DropdownMenuLabel>
                {t("layout.language") || "Language"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className="hover:bg-accent hover:text-accent-foreground"
              >
                🇸🇦 العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-2 h-auto hover:bg-accent hover:text-accent-foreground"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback
                    className={cn(
                      "text-white text-sm font-semibold",
                      colorTheme === "blue" &&
                        "bg-gradient-to-br from-blue-500 to-blue-600",
                      colorTheme === "purple" &&
                        "bg-gradient-to-br from-purple-500 to-purple-600",
                      colorTheme === "green" &&
                        "bg-gradient-to-br from-green-500 to-green-600",
                      colorTheme === "orange" &&
                        "bg-gradient-to-br from-orange-500 to-orange-600",
                      colorTheme === "red" &&
                        "bg-gradient-to-br from-red-500 to-red-600",
                      colorTheme === "teal" &&
                        "bg-gradient-to-br from-teal-500 to-teal-600"
                    )}
                  >
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {/* Show user name only when there's enough space */}
                <div className="hidden xl:block text-left min-w-0">
                  <div className="text-sm font-medium truncate max-w-32">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-32">
                    {user?.adminTypeName || user?.role || "User"}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-popover border-border"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                <User className="mr-2 h-4 w-4" />
                <span>{t("layout.profile") || "Profile"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("layout.account_settings") || "Settings"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("layout.logout") || "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
