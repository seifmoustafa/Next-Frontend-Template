"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { CustomCalendar } from "./custom-calendar";

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "date" | "datetime-local";
}

export function DatePicker({
  id,
  value = "",
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className,
  type = "date",
}: DatePickerProps) {
  const { datePickerStyle, colorTheme, borderRadius } = useSettings();
  const { t, language, direction } = useI18n();
  const [isFocused, setIsFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleCalendarChange = (newValue: string) => {
    onChange?.(newValue);
    setShowCalendar(false);
  };

  const handleIconClick = () => {
    setShowCalendar(!showCalendar);
  };

  const formatDisplayValue = (dateValue: string) => {
    if (!dateValue) return "";
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return dateValue;
      
      if (type === "datetime-local") {
        // Format: dd/mm/yyyy HH:MM
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      } else {
        // Format: dd/mm/yyyy
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    } catch {
      return dateValue;
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const IconComponent = type === "datetime-local" ? Clock : CalendarDays;

  const getBorderRadius = () => {
    switch (borderRadius) {
      case "none": return "rounded-none";
      case "small": return "rounded-sm";
      case "large": return "rounded-lg";
      case "full": return "rounded-full";
      default: return "rounded-md";
    }
  };

  const getDatePickerStyles = () => {
    const baseStyles = "relative w-full transition-all duration-200 ease-in-out";
    
    switch (datePickerStyle) {
      case "modern":
        return cn(
          baseStyles,
          "group bg-gradient-to-r from-background to-muted/20",
          "border border-border/50 hover:border-border",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "shadow-sm hover:shadow-md focus-within:shadow-lg",
          getBorderRadius()
        );

      case "glass":
        return cn(
          baseStyles,
          "group bg-background/60 backdrop-blur-sm",
          "border border-white/20 hover:border-white/30",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10",
          "shadow-lg hover:shadow-xl focus-within:shadow-2xl",
          getBorderRadius()
        );

      case "outlined":
        return cn(
          baseStyles,
          "group bg-transparent",
          "border-2 border-border hover:border-primary/50",
          "focus-within:border-primary focus-within:ring-0",
          "hover:shadow-sm focus-within:shadow-md",
          getBorderRadius()
        );

      case "filled":
        return cn(
          baseStyles,
          "group bg-muted/50 hover:bg-muted/70",
          "border border-transparent hover:border-border/30",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          "focus-within:bg-background",
          getBorderRadius()
        );

      case "minimal":
        return cn(
          baseStyles,
          "group bg-transparent",
          "border-b-2 border-border hover:border-primary/50",
          "focus-within:border-primary focus-within:ring-0",
          "rounded-none hover:shadow-sm"
        );

      case "elegant":
        return cn(
          baseStyles,
          "group bg-gradient-to-br from-background via-background to-muted/10",
          "border border-border/30 hover:border-primary/30",
          "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30",
          "shadow-sm hover:shadow-lg focus-within:shadow-xl",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
          getBorderRadius()
        );

      default:
        return cn(
          baseStyles,
          "group bg-background",
          "border border-border hover:border-primary/50",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          getBorderRadius()
        );
    }
  };

  const getInputStyles = () => {
    const baseInputStyles = "relative w-full h-12 px-4 py-3 text-sm bg-background border transition-all duration-300 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50";
    const borderRadiusClass = getBorderRadius();
    
    switch (datePickerStyle) {
      case "modern":
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "bg-gradient-to-r from-background via-background to-muted/10 border-border/40 shadow-lg",
          "hover:shadow-xl hover:border-primary/40 hover:from-background hover:to-primary/5",
          "focus:shadow-2xl focus:border-primary focus:from-background focus:to-primary/10",
          "focus:ring-4 focus:ring-primary/10"
        );
      case "glass":
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "bg-background/60 backdrop-blur-xl border-border/20 shadow-2xl",
          "hover:bg-background/70 hover:border-border/40 hover:shadow-2xl",
          "focus:bg-background/80 focus:border-primary/60 focus:shadow-2xl",
          "focus:ring-4 focus:ring-primary/20 backdrop-saturate-150"
        );
      case "outlined":
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "bg-transparent border-2 border-border/60 shadow-sm",
          "hover:border-primary/60 hover:shadow-lg hover:bg-muted/5",
          "focus:border-primary focus:shadow-xl focus:bg-background/50",
          "focus:ring-4 focus:ring-primary/15"
        );
      case "filled":
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "bg-muted/80 border-transparent shadow-inner",
          "hover:bg-muted hover:shadow-lg",
          "focus:bg-background focus:border-primary focus:shadow-xl",
          "focus:ring-4 focus:ring-primary/10"
        );
      case "minimal":
        return cn(
          "relative w-full h-12 px-4 py-3 text-sm bg-transparent border-0 border-b-2 border-border/60 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 rounded-none",
          "hover:border-primary/60 hover:bg-muted/5",
          "focus:border-primary focus:bg-background/30",
          "focus:shadow-lg focus:shadow-primary/10"
        );
      case "elegant":
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "bg-gradient-to-br from-background via-muted/5 to-primary/5 border-border/50 shadow-lg",
          "hover:shadow-xl hover:border-primary/50 hover:from-background hover:via-muted/10 hover:to-primary/10",
          "focus:shadow-2xl focus:border-primary focus:from-background focus:via-primary/5 focus:to-primary/15",
          "focus:ring-4 focus:ring-primary/15"
        );
      default:
        return cn(
          baseInputStyles,
          borderRadiusClass,
          "border-border/60 shadow-sm hover:border-primary/50 hover:shadow-lg focus:border-primary focus:shadow-xl",
          "focus:ring-4 focus:ring-primary/10"
        );
    }
  };

  const getIconStyles = () => {
    const baseIconStyles = "absolute top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none";
    const iconPosition = direction === "rtl" ? "right-3" : "left-3";
    
    switch (datePickerStyle) {
      case "modern":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground group-hover:text-primary group-focus-within:text-primary",
          "group-focus-within:scale-105"
        );
      case "glass":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-foreground/60 group-hover:text-primary/80 group-focus-within:text-primary",
          "group-focus-within:scale-110 group-focus-within:drop-shadow-md",
          "drop-shadow-sm"
        );
      case "outlined":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground group-hover:text-primary group-focus-within:text-primary",
          "group-focus-within:scale-105"
        );
      case "filled":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground group-hover:text-foreground group-focus-within:text-primary"
        );
      case "minimal":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground group-hover:text-primary group-focus-within:text-primary",
          "group-focus-within:scale-110"
        );
      case "elegant":
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground/70 group-hover:text-primary/80 group-focus-within:text-primary",
          "group-focus-within:scale-105 drop-shadow-sm"
        );
      default:
        return cn(
          baseIconStyles,
          iconPosition,
          "text-muted-foreground group-hover:text-primary group-focus-within:text-primary"
        );
    }
  };

  const getLabelStyles = () => {
    if (!placeholder || value) return "hidden";
    
    const baseLabelStyles = "absolute transition-all duration-300 pointer-events-none select-none z-10";
    const labelPosition = language === "ar" ? "right-4" : "left-4";
    
    switch (datePickerStyle) {
      case "modern":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground text-sm bg-background px-2 rounded",
          (isFocused || showCalendar) && "top-0 text-xs text-primary font-medium scale-90 -translate-y-1/2"
        );
      case "glass":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-foreground/60 text-sm bg-background/80 backdrop-blur-sm px-2 rounded",
          (isFocused || showCalendar) && "top-0 text-xs text-primary font-medium scale-90 -translate-y-1/2"
        );
      case "outlined":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground text-sm bg-background px-2",
          (isFocused || showCalendar) && "top-0 text-xs text-primary font-medium scale-90 -translate-y-1/2"
        );
      case "filled":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground text-sm bg-background px-2 rounded",
          (isFocused || showCalendar) && "top-0 text-xs text-primary font-medium scale-90 -translate-y-1/2"
        );
      case "elegant":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground/70 text-sm font-medium bg-gradient-to-r from-background to-background px-2 rounded",
          (isFocused || showCalendar) && "top-0 text-xs text-primary font-semibold scale-90 -translate-y-1/2"
        );
      case "minimal":
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground text-sm",
          (isFocused || showCalendar) && "top-2 text-xs text-primary font-medium"
        );
      default:
        return cn(
          baseLabelStyles,
          labelPosition,
          "top-1/2 -translate-y-1/2 text-muted-foreground text-sm bg-background px-2 rounded",
          (isFocused || showCalendar) && "top-0 text-xs text-primary scale-90 -translate-y-1/2"
        );
    }
  };

  return (
    <div ref={containerRef} className={cn(getDatePickerStyles(), className)}>
      {/* Hidden native input for form compatibility */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
      />
      
      {/* Custom Professional Input Display */}
      <div
        className={cn(getInputStyles(), "cursor-pointer flex items-center justify-between")}
        onClick={handleIconClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={placeholder}
      >
        {/* Display Value or Placeholder */}
        <span className={cn(
          "flex-1 text-left select-none",
          value ? "text-foreground" : "text-muted-foreground"
        )}>
          {value ? formatDisplayValue(value) : (placeholder || t("common.selectDate") || "Select date")}
        </span>
        
        {/* Professional Icon */}
        <IconComponent 
          className={cn(
            "h-4 w-4 transition-all duration-200 flex-shrink-0 ml-2",
            showCalendar ? "text-primary scale-110" : "text-muted-foreground",
            "hover:text-primary hover:scale-105"
          )} 
        />
      </div>
      
      {/* Focus Ring Enhancement for Glass Style */}
      {datePickerStyle === "glass" && isFocused && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-inherit pointer-events-none" />
      )}
      
      {/* Elegant Style Accent */}
      {datePickerStyle === "elegant" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Custom Calendar Dropdown */}
      {showCalendar && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <CustomCalendar
            value={value}
            onChange={handleCalendarChange}
            onClose={() => setShowCalendar(false)}
            type={type}
          />
        </div>
      )}
    </div>
  );
}
