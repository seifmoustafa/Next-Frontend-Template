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
import { ChevronDown, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface UserProfileDropdownProps {
  variant?:
    | "default"
    | "compact"
    | "minimal"
    | "elegant"
    | "floating"
    | "navigation";
  className?: string;
}

export function UserProfileDropdown({
  variant = "default",
  className,
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
    router.push("/profile");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push("/settings");
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
        return "text-xs";
      case "minimal":
        return "text-xs";
      case "floating":
        return "text-sm";
      case "navigation":
        return "text-sm";
      default:
        return "text-sm";
    }
  };

  const showUserInfo = variant !== "minimal" && variant !== "compact";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-3 p-2 hover:bg-accent/50 transition-colors",
            variant === "navigation" && "w-full justify-start",
            variant === "floating" && "rounded-full",
            className
          )}
        >
          <Avatar className={cn(getAvatarSize(), "border-2 border-primary/20")}>
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          {showUserInfo && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="text-right rtl:text-left min-w-0">
                <p className={cn("font-medium truncate", getTextSize())}>
                  {user.firstName} {user.lastName}
                </p>
                <p
                  className={cn(
                    "text-muted-foreground truncate",
                    variant === "navigation" ? "text-xs" : "text-xs"
                  )}
                >
                  {user.adminTypeName || "مستخدم"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "transition-transform duration-200 flex-shrink-0",
                  isOpen && "rotate-180",
                  variant === "compact" ? "h-3 w-3" : "h-4 w-4"
                )}
              />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2"
        side={variant === "navigation" ? "right" : "bottom"}
      >
        <div className="flex items-center gap-3 p-2 mb-2">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="text-right rtl:text-left min-w-0">
            <p className="font-medium text-sm truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.adminTypeName || "مستخدم"}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleProfileClick}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 rounded-md"
        >
          <User className="h-4 w-4" />
          <span>الملف الشخصي</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSettingsClick}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 rounded-md"
        >
          <Settings className="h-4 w-4" />
          <span>الإعدادات</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-destructive/10 text-destructive rounded-md"
        >
          <LogOut className="h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
