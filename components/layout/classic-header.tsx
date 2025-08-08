"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { useLayoutStyles } from "./use-layout-styles";
import { UserProfileDropdown } from "@/components/ui/user-profile-dropdown";
import { cn } from "@/lib/utils";
import { LanguageSwitcher, ThemeSwitcher, HeaderSearch } from "./common";

interface ClassicHeaderProps {
  onMenuClick: () => void;
}

export function ClassicHeader({ onMenuClick }: ClassicHeaderProps) {
  const { t } = useI18n();
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
          <HeaderSearch
            containerClassName="hidden md:block"
            inputClassName={cn(
              "w-64 bg-muted/50 border-0 focus:bg-background",
              getBorderRadiusClass(),
              animationClass,
              "shadow-sm focus:shadow-md hover:shadow-md",
              "pl-10 rtl:pl-4 rtl:pr-10"
            )}
            iconClassName="left-3 rtl:left-auto rtl:right-3"
          />

          <LanguageSwitcher
            buttonClassName={cn(
              "hover:bg-primary/10 hover:text-primary",
              getBorderRadiusClass(),
              animationClass,
              "shadow-md hover:shadow-lg hover:scale-105"
            )}
            contentClassName={cn(getBorderRadiusClass(), "shadow-xl")}
          />
          <ThemeSwitcher
            buttonClassName={cn(
              "hover:bg-primary/10 hover:text-primary",
              getBorderRadiusClass(),
              animationClass,
              "shadow-md hover:shadow-lg hover:scale-105"
            )}
            contentClassName={cn(getBorderRadiusClass(), "shadow-xl")}
          />

          {/* User Profile Dropdown */}
          <UserProfileDropdown variant="default" />
        </div>
      </div>
    </header>
  );
}
