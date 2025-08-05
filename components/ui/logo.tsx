import { Sparkles, Shield } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { logoConfig } from "@/config/logo";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "outline";
  className?: string;
}

export function Logo({ size = "md", variant = "default", className }: LogoProps) {
  const logoType = logoConfig.type;
  const logoImage = logoConfig.imagePath;
  const logoText = logoConfig.text;
  
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
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
            "flex items-center justify-center rounded-full",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}>
            <Sparkles className={cn(
              size === "sm" ? "w-4 h-4" : 
              size === "md" ? "w-5 h-5" :
              size === "lg" ? "w-6 h-6" : "w-7 h-7"
            )} />
          </div>
        );
        
      case "shield":
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full",
            sizeClasses[size],
            variantClasses[variant],
            className
          )}>
            <Shield className={cn(
              size === "sm" ? "w-4 h-4" : 
              size === "md" ? "w-5 h-5" :
              size === "lg" ? "w-6 h-6" : "w-7 h-7"
            )} />
          </div>
        );
        
      case "image":
        return (
          <div className={cn(
            "flex items-center justify-center rounded-full overflow-hidden",
            sizeClasses[size],
            className
          )}>
            <Image
              src={logoImage}
              alt="Logo"
              width={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
              height={size === "sm" ? 24 : size === "md" ? 32 : size === "lg" ? 40 : 48}
              className="w-full h-full object-cover"
            />
          </div>
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
              size === "sm" ? "w-4 h-4" : 
              size === "md" ? "w-5 h-5" :
              size === "lg" ? "w-6 h-6" : "w-7 h-7"
            )} />
          </div>
        );
    }
  };

  return renderLogo();
} 