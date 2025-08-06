"use client";

import { User, Settings, LogOut, Shield, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserProfileDropdownProps {
  variant?: "default" | "compact" | "minimal";
  showUserInfo?: boolean;
  className?: string;
}

export function UserProfileDropdown({
  variant = "default",
  showUserInfo = true,
  className,
}: UserProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { t, direction } = useI18n();
  const { colorTheme, buttonStyle, borderRadius } = useSettings();

  if (!user) return null;

  const getUserInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  const getButtonClass = () => {
    const baseClass = "transition-all duration-300 hover:scale-105";

    switch (buttonStyle) {
      case "rounded":
        return cn(baseClass, "rounded-full");
      case "square":
        return cn(baseClass, "rounded-none");
      case "pill":
        return cn(baseClass, "rounded-full px-6");
      default:
        return cn(baseClass, "rounded-xl");
    }
  };

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case "none":
        return "rounded-none";
      case "small":
        return "rounded-sm";
      case "large":
        return "rounded-lg";
      case "full":
        return "rounded-full";
      default:
        return "rounded-xl";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            getButtonClass(),
            "shadow-md hover:shadow-lg",
            variant === "compact" ? "h-9 px-2" : "h-10 px-3",
            variant === "minimal" ? "p-2" : "",
            className
          )}
        >
          <div
            className={cn(
              "flex items-center",
              direction === "rtl" ? "space-x-reverse" : "",
              variant === "minimal" ? "" : "space-x-3"
            )}
          >
            <Avatar
              className={cn(
                "ring-2 ring-primary/20 shadow-md transition-all duration-300 hover:scale-110",
                variant === "compact" ? "h-7 w-7" : "h-8 w-8",
                variant === "minimal" ? "h-6 w-6" : ""
              )}
            >
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={getUserDisplayName()}
              />
              <AvatarFallback
                className={cn(
                  "text-white font-semibold",
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
                    "bg-gradient-to-br from-teal-500 to-teal-600",
                  colorTheme === "pink" &&
                    "bg-gradient-to-br from-pink-500 to-pink-600",
                  colorTheme === "indigo" &&
                    "bg-gradient-to-br from-indigo-500 to-indigo-600",
                  colorTheme === "cyan" &&
                    "bg-gradient-to-br from-cyan-500 to-cyan-600",
                  variant === "compact" ? "text-xs" : "text-sm"
                )}
              >
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {showUserInfo && variant !== "minimal" && (
              <div
                className={cn(
                  "hidden lg:block min-w-0",
                  direction === "rtl" ? "text-right" : "text-left"
                )}
              >
                <div
                  className={cn(
                    "font-medium truncate max-w-32",
                    variant === "compact" ? "text-xs" : "text-sm"
                  )}
                >
                  {getUserDisplayName()}
                </div>
                <div
                  className={cn(
                    "text-muted-foreground truncate max-w-32",
                    variant === "compact" ? "text-xs" : "text-xs"
                  )}
                >
                  {user.adminTypeName || user.role || t("common.user")}
                </div>
              </div>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={direction === "rtl" ? "start" : "end"}
        className={cn(
          "w-72 mt-2 p-3 bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl",
          getBorderRadiusClass(),
          "animate-in slide-in-from-top-2 duration-300"
        )}
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-0 mb-3">
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/2 border border-primary/10",
              direction === "rtl" ? "flex-row-reverse" : ""
            )}
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/30 shadow-lg">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={getUserDisplayName()}
              />
              <AvatarFallback
                className={cn(
                  "text-white font-bold",
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
                    "bg-gradient-to-br from-teal-500 to-teal-600",
                  colorTheme === "pink" &&
                    "bg-gradient-to-br from-pink-500 to-pink-600",
                  colorTheme === "indigo" &&
                    "bg-gradient-to-br from-indigo-500 to-indigo-600",
                  colorTheme === "cyan" &&
                    "bg-gradient-to-br from-cyan-500 to-cyan-600"
                )}
              >
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex-1 min-w-0",
                direction === "rtl" ? "text-right" : "text-left"
              )}
            >
              <p className="font-bold text-lg truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {user.adminTypeName || user.role || t("common.user")}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        {/* Profile Menu Item */}
        <DropdownMenuItem
          asChild
          className={cn(
            "rounded-xl p-3 my-1 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all duration-300 cursor-pointer",
            direction === "rtl" ? "flex-row-reverse" : ""
          )}
        >
          <Link href="/dashboard/profile">
            <User
              className={cn("h-5 w-5", direction === "rtl" ? "ml-3" : "mr-3")}
            />
            <span className="font-medium">{t("nav.profile")}</span>
          </Link>
        </DropdownMenuItem>

        {/* Settings Menu Item */}
        <DropdownMenuItem
          asChild
          className={cn(
            "rounded-xl p-3 my-1 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary transition-all duration-300 cursor-pointer",
            direction === "rtl" ? "flex-row-reverse" : ""
          )}
        >
          <Link href="/dashboard/settings">
            <Settings
              className={cn("h-5 w-5", direction === "rtl" ? "ml-3" : "mr-3")}
            />
            <span className="font-medium">{t("nav.settings")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border/60 to-transparent" />

        {/* Logout Menu Item */}
        <DropdownMenuItem
          className={cn(
            "rounded-xl p-3 my-1 text-destructive hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5 transition-all duration-300 cursor-pointer",
            direction === "rtl" ? "flex-row-reverse" : ""
          )}
          onClick={() => logout()}
        >
          <LogOut
            className={cn("h-5 w-5", direction === "rtl" ? "ml-3" : "mr-3")}
          />
          <span className="font-medium">{t("nav.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
