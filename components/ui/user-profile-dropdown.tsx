"use client";

import { useState } from "react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useSettings } from "@/providers/settings-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileDropdownProps {
  variant?:
    | "default"
    | "compact"
    | "minimal"
    | "elegant"
    | "floating"
    | "navigation";
  showName?: boolean;
  className?: string;
}

export function UserProfileDropdown({
  variant = "default",
  showName = true,
  className,
}: UserProfileDropdownProps) {
  const { t, direction } = useI18n();
  const { user, logout } = useAuth();
  const { colorTheme, buttonStyle, animationLevel } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const getUserInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserDisplayName = () => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    router.push("/dashboard/settings");
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    setIsOpen(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "compact":
        return {
          trigger: "h-10 px-3 rounded-xl",
          avatar: "h-8 w-8",
          content: "w-56 mt-2 rounded-xl",
        };
      case "minimal":
        return {
          trigger: "h-10 px-2 rounded-lg",
          avatar: "h-8 w-8",
          content: "w-48 mt-1 rounded-lg",
        };
      case "elegant":
        return {
          trigger: "h-14 px-5 rounded-3xl",
          avatar: "h-9 w-9",
          content: "w-72 mt-3 p-3 rounded-3xl",
        };
      case "floating":
        return {
          trigger: "h-10 px-3 rounded-xl",
          avatar: "h-8 w-8",
          content: "w-56 mt-2 rounded-xl",
        };
      case "navigation":
        return {
          trigger: "h-12 px-4 rounded-lg",
          avatar: "h-10 w-10",
          content: "w-64 mt-2 rounded-lg",
        };
      default:
        return {
          trigger: "h-12 px-4 rounded-lg",
          avatar: "h-10 w-10",
          content: "w-64 mt-2 rounded-lg",
        };
    }
  };

  const styles = getVariantStyles();

  const getAnimationClass = () => {
    if (animationLevel === "none") return "";
    if (animationLevel === "minimal") return "transition-colors duration-200";
    if (animationLevel === "moderate") return "transition-all duration-300";
    return "transition-all duration-500 hover:scale-105";
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
        return styles.trigger.includes("rounded-") ? "" : "rounded-lg";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center space-x-3 rtl:space-x-reverse hover:bg-accent hover:text-accent-foreground",
            styles.trigger,
            getButtonStyleClass(),
            getAnimationClass(),
            variant === "elegant" && [
              "bg-gradient-to-br from-muted/60 via-muted/40 to-muted/20",
              "hover:from-primary/15 hover:via-primary/10 hover:to-primary/5",
              "border border-border/60 hover:border-primary/40",
              "shadow-lg hover:shadow-xl hover:shadow-primary/15",
              "backdrop-blur-xl",
              "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
            ],
            variant === "compact" && ["shadow-md hover:shadow-lg"],
            variant === "floating" && ["shadow-md hover:shadow-lg"],
            variant === "navigation" && ["shadow-sm hover:shadow-md"],
            className
          )}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Avatar
              className={cn(
                styles.avatar,
                "ring-2 ring-primary/20 shadow-md",
                variant === "elegant" &&
                  "ring-2 ring-primary/40 hover:ring-primary/60 shadow-xl shadow-primary/30 hover:scale-110",
                getAnimationClass()
              )}
            >
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
                    "bg-gradient-to-br from-cyan-500 to-cyan-600",
                  variant === "elegant" && "border border-primary/20"
                )}
              >
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {showName && (
              <div className="hidden lg:block text-left rtl:text-right min-w-0">
                <p
                  className={cn(
                    "font-medium truncate max-w-32",
                    variant === "elegant" ? "text-sm font-bold" : "text-sm"
                  )}
                >
                  {getUserDisplayName()}
                </p>
                <p
                  className={cn(
                    "text-muted-foreground truncate max-w-32",
                    variant === "elegant" ? "text-xs font-medium" : "text-xs"
                  )}
                >
                  {user.adminTypeName || user.role || t("common.user")}
                </p>
              </div>
            )}

            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={direction === "rtl" ? "start" : "end"}
        className={cn(
          styles.content,
          "bg-background/98 backdrop-blur-xl border border-border/60 shadow-2xl",
          variant === "elegant" && [
            "animate-in slide-in-from-top-2 duration-300",
            "shadow-2xl shadow-primary/15",
          ],
          getAnimationClass()
        )}
        sideOffset={8}
      >
        <DropdownMenuLabel
          className={cn(
            variant === "elegant"
              ? "text-lg font-bold px-2 py-3"
              : "text-sm font-medium"
          )}
        >
          <div className="flex flex-col space-y-1">
            <span>{getUserDisplayName()}</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user.email || user.adminTypeName || t("common.user")}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator
          className={cn(
            variant === "elegant" &&
              "bg-gradient-to-r from-transparent via-border/60 to-transparent"
          )}
        />

        <DropdownMenuItem
          onClick={handleProfileClick}
          className={cn(
            "flex items-center cursor-pointer",
            variant === "elegant" && [
              "rounded-2xl p-4 my-2",
              "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
              "transition-all duration-300",
            ],
            getAnimationClass()
          )}
        >
          <User
            className={cn(
              "mr-3 rtl:mr-0 rtl:ml-3",
              variant === "elegant" ? "h-5 w-5" : "h-4 w-4"
            )}
          />
          <span className={cn(variant === "elegant" && "font-medium")}>
            {t("nav.profile") || "Profile"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleSettingsClick}
          className={cn(
            "flex items-center cursor-pointer",
            variant === "elegant" && [
              "rounded-2xl p-4 my-2",
              "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:text-primary",
              "transition-all duration-300",
            ],
            getAnimationClass()
          )}
        >
          <Settings
            className={cn(
              "mr-3 rtl:mr-0 rtl:ml-3",
              variant === "elegant" ? "h-5 w-5" : "h-4 w-4"
            )}
          />
          <span className={cn(variant === "elegant" && "font-medium")}>
            {t("nav.settings") || "Settings"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator
          className={cn(
            variant === "elegant" &&
              "bg-gradient-to-r from-transparent via-border/60 to-transparent"
          )}
        />

        <DropdownMenuItem
          onClick={handleSignOut}
          className={cn(
            "text-destructive hover:text-destructive cursor-pointer",
            variant === "elegant" && [
              "rounded-2xl p-4 my-2",
              "hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5",
              "transition-all duration-300",
            ],
            getAnimationClass()
          )}
        >
          <LogOut
            className={cn(
              "mr-3 rtl:mr-0 rtl:ml-3",
              variant === "elegant" ? "h-5 w-5" : "h-4 w-4"
            )}
          />
          <span className={cn(variant === "elegant" && "font-medium")}>
            {t("nav.logout") || "Sign Out"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
