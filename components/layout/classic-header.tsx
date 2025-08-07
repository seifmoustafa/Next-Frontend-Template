"use client";

import { Menu, Search, Sun, Moon, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useLayoutStyles } from "./use-layout-styles";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { cn } from "@/lib/utils";

interface ClassicHeaderProps {
  onMenuClick: () => void;
}

export function ClassicHeader({ onMenuClick }: ClassicHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, direction } = useI18n();
  const { user } = useAuth();
  const {
    getSpacingClass,
    getHeaderStyleClass,
    getShadowClass,
    getAnimationClass,
    getBorderRadiusClass,
  } = useLayoutStyles();

  const animationClass = getAnimationClass();

  const headerClass = getHeaderStyleClass({
    compact: "h-14 bg-background/95 border-b",
    elevated:
      "bg-gradient-to-r from-background via-background/98 to-background border-b-2 border-border/80 shadow-xl shadow-primary/10",
    transparent: "bg-transparent backdrop-blur-xl border-b border-border/30",
    default:
      "bg-gradient-to-r from-background via-background/95 to-background border-b-2 border-border/80 shadow-lg shadow-primary/5 backdrop-blur-sm",
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        headerClass,
        getShadowClass(),
        animationClass
      )}
    >
      <div
        className={cn("flex items-center justify-between", getSpacingClass())}
      >
        {/* Left side */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden hover:bg-primary/10 hover:text-primary",
              getBorderRadiusClass(),
              animationClass,
              "shadow-md hover:shadow-lg hover:scale-105"
            )}
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              className={cn(
                "pl-10 rtl:pl-4 rtl:pr-10 w-64 bg-muted/50 border-0 focus:bg-background",
                getBorderRadiusClass(),
                animationClass,
                "shadow-sm focus:shadow-md hover:shadow-md"
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
                  "hover:bg-primary/10 hover:text-primary",
                  getBorderRadiusClass(),
                  animationClass,
                  "shadow-md hover:shadow-lg hover:scale-105"
                )}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className={cn(getBorderRadiusClass(), "shadow-xl")}
            >
              <DropdownMenuItem
                onClick={() => setLanguage("ar")}
                className="rounded-lg"
              >
                🇸🇦 {t("language.arabic")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage("en")}
                className="rounded-lg"
              >
                🇺🇸 {t("language.english")}
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
                  "hover:bg-primary/10 hover:text-primary",
                  getBorderRadiusClass(),
                  animationClass,
                  "shadow-md hover:shadow-lg hover:scale-105"
                )}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={direction === "rtl" ? "start" : "end"}
              className={cn(getBorderRadiusClass(), "shadow-xl")}
            >
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="rounded-lg"
              >
                <Sun className="mr-2 h-4 w-4" />
                {t("theme.light")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="rounded-lg"
              >
                <Moon className="mr-2 h-4 w-4" />
                {t("theme.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="rounded-lg"
              >
                <Monitor className="mr-2 h-4 w-4" />
                {t("theme.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <UserProfileDropdown variant="default" />
        </div>
      </div>
    </header>
  );
}
