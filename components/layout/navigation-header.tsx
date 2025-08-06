"use client";

import type React from "react";
import {
  Search,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Settings,
  User,
  LogOut,
  Globe,
} from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
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
import { Badge } from "@/components/ui/badge";

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
  const { language, direction, t, setLanguage } = useI18n();
  const { user, logout } = useAuth();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800/50">
      {/* Header Content Container - This is what adapts to sidebar states */}
      <div
        className={cn(
          "h-full flex items-center justify-between px-4 lg:px-6 gap-4 transition-all duration-300",
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
            className="sidebar-trigger text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Panel Toggle Button - Only show if there's a panel and not mobile */}
          {hasPanel && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPanelToggle}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
              title={
                panelOpen
                  ? t("layout.hide_panel") || "Hide Panel"
                  : t("layout.show_panel") || "Show Panel"
              }
            >
              {panelOpen ? (
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="search"
              placeholder={t("layout.search_placeholder") || "Search here..."}
              className="w-full pl-10 pr-12 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-xs text-slate-400">
              /
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700"
            >
              <DropdownMenuLabel className="text-white">
                {t("layout.language") || "Language"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                🇸🇦 العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-slate-800 relative"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 text-white border-2 border-slate-900">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-2 h-auto hover:bg-slate-800"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.avatar || undefined}
                    alt={getUserDisplayName()}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {/* Show user name only when there's enough space */}
                <div className="hidden xl:block text-left min-w-0">
                  <div className="text-sm font-medium text-white truncate max-w-32">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-slate-400 truncate max-w-32">
                    {user?.adminTypeName || user?.role || "User"}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-slate-800 border-slate-700"
            >
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-slate-400">
                    {user?.email || "No email"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                <span>{t("layout.profile") || "Profile"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("layout.account_settings") || "Settings"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="text-red-400 hover:text-red-300 hover:bg-slate-700"
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
