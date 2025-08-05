import { Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { logoConfig } from "@/config/logo";
import { useSettings } from "@/providers/settings-provider";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "outline";
  className?: string;
  /**
   * Animation for icon logos: 'none' (default), 'spin', 'pulse', or 'fancy' (strong effect).
   */
  animation?: "none" | "spin" | "pulse" | "fancy";
}

export function Logo({ size = "md", variant = "default", className, animation = "none" }: LogoProps) {
  const settings = useSettings();
  const logoType = settings?.logoType || logoConfig.type;
  const logoImage = logoConfig.imagePath;
  const logoText = logoConfig.text;
  
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-32 h-32" // 128px for extra large
  };
  
  const variantClasses = {
    default: "text-primary",
    gradient: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
    outline: "border-2 border-primary text-primary"
  };

  const renderLogo = () => {
    switch (logoType) {
      case "sparkles":
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg",
            sizeClasses[size],
            className
          )}>
            <div className={cn(
              "flex items-center justify-center rounded-full bg-background",
              // Slightly smaller to create a border effect
              size === "xs" ? "w-3 h-3" : size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : size === "lg" ? "w-9 h-9" : "w-28 h-28"
            )}>
              <Sparkles className={cn(
                size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : 
                size === "md" ? "w-5 h-5" :
                size === "lg" ? "w-6 h-6" : "w-7 h-7",
                animation === "spin" && "animate-spin",
                animation === "pulse" && "animate-pulse",
                animation === "fancy" && "animate-spin animate-pulse shadow-[0_0_32px_theme('colors.primary.DEFAULT')] text-primary drop-shadow-lg",
              )} />
            </div>
          </div>
        );
        
      case "shield":
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg",
            sizeClasses[size],
            className
          )}>
            <div className={cn(
              "flex items-center justify-center rounded-full bg-background",
              size === "xs" ? "w-3 h-3" : size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : size === "lg" ? "w-9 h-9" : "w-28 h-28"
            )}>
              <Shield className={cn(
                size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : 
                size === "md" ? "w-5 h-5" :
                size === "lg" ? "w-6 h-6" : "w-7 h-7",
                animation === "spin" && "animate-spin",
                animation === "pulse" && "animate-pulse",
                animation === "fancy" && "animate-spin animate-pulse shadow-[0_0_32px_theme('colors.primary.DEFAULT')] text-primary drop-shadow-lg",
              )} />
            </div>
          </div>
        );
        
      case "image":
        return (
          <Image
            src={logoImage}
            alt="Logo"
            width={size === "xs" ? 16 : size === "sm" ? 32 : size === "md" ? 46 : size === "lg" ? 72 : 128}
            height={size === "xs" ? 16 : size === "sm" ? 32 : size === "md" ? 46 : size === "lg" ? 72 : 128}
            className={cn(
              "object-cover rounded-full",
              sizeClasses[size],
              className
            )}
          />
        );
        
      case "custom":
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full font-bold text-primary-foreground",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}>
            {logoText}
          </div>
        );
        
      default:
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}>
            <Sparkles className={cn(
              size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : 
              size === "md" ? "w-5 h-5" :
              size === "lg" ? "w-6 h-6" : "w-7 h-7"
            )} />
          </div>
        );
    }
  };

  return renderLogo();
} 