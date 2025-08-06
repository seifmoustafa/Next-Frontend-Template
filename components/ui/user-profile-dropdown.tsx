"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { ChevronDown, Settings, User, LogOut } from "lucide-react";

interface UserProfileDropdownProps {
  variant?:
    | "default"
    | "compact"
    | "minimal"
    | "elegant"
    | "floating"
    | "navigation";
  showName?: boolean;
  showRole?: boolean;
  className?: string;
}

export function UserProfileDropdown({
  variant = "default",
  showName = true,
  showRole = true,
  className = "",
}: UserProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getInitials = () => {
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}`;
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
    setIsOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  const getAvatarSize = () => {
    switch (variant) {
      case "compact":
        return "h-8 w-8";
      case "minimal":
        return "h-7 w-7";
      case "floating":
        return "h-9 w-9";
      case "navigation":
        return "h-10 w-10";
      default:
        return "h-9 w-9";
    }
  };

  const getTextSize = () => {
    switch (variant) {
      case "compact":
      case "minimal":
        return "text-xs";
      case "floating":
      case "navigation":
        return "text-sm";
      default:
        return "text-sm";
    }
  };

  const renderTrigger = () => {
    const avatarContent = (
      <Avatar className={`${getAvatarSize()} ring-2 ring-white/20`}>
        <AvatarFallback
          className={`bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold ${getTextSize()} shadow-lg`}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
    );

    if (variant === "minimal") {
      return (
        <Button variant="ghost" className={`h-auto p-1 ${className}`}>
          {avatarContent}
        </Button>
      );
    }

    if (variant === "compact") {
      return (
        <Button
          variant="ghost"
          className={`flex items-center gap-2 h-auto p-2 ${className}`}
        >
          {avatarContent}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      );
    }

    return (
      <Button
        variant="ghost"
        className={`flex items-center gap-3 h-auto p-2 hover:bg-accent/50 ${className}`}
      >
        {avatarContent}
        {(showName || showRole) && (
          <div className="flex flex-col items-start text-left">
            {showName && (
              <span className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </span>
            )}
            {showRole && (
              <span className="text-xs text-muted-foreground">
                {user.adminTypeName || "Admin"}
              </span>
            )}
          </div>
        )}
        <ChevronDown className="h-4 w-4 opacity-50 ml-auto" />
      </Button>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{renderTrigger()}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>{t("common.profile")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("common.settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("common.signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
