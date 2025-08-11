"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";

interface CustomCalendarProps {
  value?: string;
  onChange?: (value: string) => void;
  onClose?: () => void;
  type?: "date" | "datetime-local";
  className?: string;
}

export function CustomCalendar({
  value = "",
  onChange,
  onClose,
  type = "date",
  className,
}: CustomCalendarProps) {
  const { calendarStyle, colorTheme, borderRadius } = useSettings();
  const { t, language, direction } = useI18n();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const [selectedTime, setSelectedTime] = useState(
    value && type === "datetime-local" 
      ? value.split("T")[1] || "12:00"
      : "12:00"
  );

  const months = [
    t("months.jan"), t("months.feb"), t("months.mar"), t("months.apr"),
    t("months.may"), t("months.jun"), t("months.jul"), t("months.aug"),
    t("months.sep"), t("months.oct"), t("months.nov"), t("months.dec")
  ];

  const weekDays = language === "ar" 
    ? ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
    : ["S", "M", "T", "W", "T", "F", "S"];

  const getBorderRadius = () => {
    switch (borderRadius) {
      case "none": return "rounded-none";
      case "small": return "rounded-sm";
      case "large": return "rounded-lg";
      case "full": return "rounded-xl";
      default: return "rounded-md";
    }
  };

  const getCalendarStyles = () => {
    const baseStyles = "w-80 bg-background border shadow-lg transition-all duration-200";
    
    switch (calendarStyle) {
      case "modern":
        return cn(
          baseStyles,
          "bg-gradient-to-br from-background to-muted/20",
          "border-border/50 shadow-xl backdrop-blur-sm",
          "ring-1 ring-primary/10",
          getBorderRadius()
        );
        
      case "glass":
        return cn(
          baseStyles,
          "bg-background/80 backdrop-blur-md",
          "border-white/20 shadow-2xl",
          "ring-1 ring-white/10",
          getBorderRadius()
        );
        
      case "elegant":
        return cn(
          baseStyles,
          "bg-gradient-to-br from-background via-background to-primary/5",
          "border-primary/20 shadow-xl",
          "ring-1 ring-primary/20",
          getBorderRadius()
        );
        
      case "minimal":
        return cn(
          baseStyles,
          "bg-background border-border shadow-md",
          "ring-0",
          getBorderRadius()
        );
        
      case "dark":
        return cn(
          baseStyles,
          "bg-slate-900 border-slate-700 shadow-2xl",
          "ring-1 ring-slate-600/50",
          getBorderRadius()
        );
        
      default:
        return cn(baseStyles, "border-border shadow-lg", getBorderRadius());
    }
  };

  const getHeaderStyles = () => {
    switch (calendarStyle) {
      case "modern":
        return "p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50";
      case "glass":
        return "p-4 bg-white/10 border-b border-white/20 backdrop-blur-sm";
      case "elegant":
        return "p-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/20";
      case "minimal":
        return "p-3 border-b border-border";
      case "dark":
        return "p-4 bg-slate-800 border-b border-slate-700";
      default:
        return "p-4 border-b border-border";
    }
  };

  const getButtonStyles = (isSelected = false, isToday = false, isOtherMonth = false) => {
    const baseStyles = "w-8 h-8 flex items-center justify-center text-sm transition-all duration-200 hover:scale-105";
    
    if (isSelected) {
      switch (calendarStyle) {
        case "modern":
          return cn(baseStyles, "bg-primary text-primary-foreground rounded-lg shadow-md font-semibold");
        case "glass":
          return cn(baseStyles, "bg-primary/80 text-white rounded-lg shadow-lg backdrop-blur-sm font-medium");
        case "elegant":
          return cn(baseStyles, "bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg shadow-lg font-semibold");
        case "minimal":
          return cn(baseStyles, "bg-primary text-primary-foreground rounded-md font-medium");
        case "dark":
          return cn(baseStyles, "bg-blue-600 text-white rounded-lg shadow-md font-semibold");
        default:
          return cn(baseStyles, "bg-primary text-primary-foreground rounded-md");
      }
    }
    
    if (isToday) {
      switch (calendarStyle) {
        case "modern":
          return cn(baseStyles, "bg-primary/20 text-primary rounded-lg font-semibold ring-2 ring-primary/30");
        case "glass":
          return cn(baseStyles, "bg-white/20 text-primary rounded-lg font-medium ring-1 ring-primary/50");
        case "elegant":
          return cn(baseStyles, "bg-primary/10 text-primary rounded-lg font-semibold ring-1 ring-primary/40");
        case "minimal":
          return cn(baseStyles, "bg-muted text-primary rounded-md font-medium");
        case "dark":
          return cn(baseStyles, "bg-blue-900/50 text-blue-300 rounded-lg font-semibold");
        default:
          return cn(baseStyles, "bg-muted text-primary rounded-md");
      }
    }
    
    if (isOtherMonth) {
      return cn(baseStyles, "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/50 rounded-md");
    }
    
    switch (calendarStyle) {
      case "modern":
        return cn(baseStyles, "text-foreground hover:bg-primary/10 hover:text-primary rounded-lg");
      case "glass":
        return cn(baseStyles, "text-foreground/80 hover:bg-white/10 hover:text-foreground rounded-lg");
      case "elegant":
        return cn(baseStyles, "text-foreground hover:bg-primary/5 hover:text-primary rounded-lg");
      case "minimal":
        return cn(baseStyles, "text-foreground hover:bg-muted rounded-md");
      case "dark":
        return cn(baseStyles, "text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg");
      default:
        return cn(baseStyles, "text-foreground hover:bg-muted rounded-md");
    }
  };

  const getTimeInputStyles = () => {
    const baseStyles = "w-full px-3 py-2 text-sm bg-transparent border outline-none transition-all duration-200";
    
    switch (calendarStyle) {
      case "modern":
        return cn(baseStyles, "border-border/50 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20");
      case "glass":
        return cn(baseStyles, "border-white/20 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/30 bg-white/5");
      case "elegant":
        return cn(baseStyles, "border-primary/20 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/30");
      case "minimal":
        return cn(baseStyles, "border-border rounded-md focus:border-primary");
      case "dark":
        return cn(baseStyles, "border-slate-600 rounded-lg focus:border-blue-500 bg-slate-800 text-slate-200");
      default:
        return cn(baseStyles, "border-border rounded-md focus:border-primary");
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number, isOtherMonth = false) => {
    let newDate: Date;
    
    if (isOtherMonth) {
      if (day > 15) {
        // Previous month
        newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      } else {
        // Next month
        newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      }
    } else {
      newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    }
    
    setSelectedDate(newDate);
    
    if (type === "date") {
      const dateString = newDate.toISOString().split("T")[0];
      onChange?.(dateString);
      onClose?.();
    } else {
      const dateString = `${newDate.toISOString().split("T")[0]}T${selectedTime}`;
      onChange?.(dateString);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const dateString = `${selectedDate.toISOString().split("T")[0]}T${time}`;
      onChange?.(dateString);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <button
          key={`prev-${day}`}
          onClick={() => handleDateSelect(day, true)}
          className={getButtonStyles(false, false, true)}
        >
          {day}
        </button>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate ? 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear() : false;
      
      const isToday = today.getDate() === day && 
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={getButtonStyles(isSelected, isToday)}
        >
          {day}
        </button>
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <button
          key={`next-${day}`}
          onClick={() => handleDateSelect(day, true)}
          className={getButtonStyles(false, false, true)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className={cn(getCalendarStyles(), className)}>
      {/* Header */}
      <div className={getHeaderStyles()}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>
          
          <button
            onClick={() => navigateMonth("next")}
            className="p-1 hover:bg-primary/10 rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="w-8 h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Time Picker for datetime-local */}
      {type === "datetime-local" && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t("common.time") || "Time"}</span>
          </div>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className={getTimeInputStyles()}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 border-t border-border flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("common.cancel")}
        </button>
        {type === "datetime-local" && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {t("common.ok") || "OK"}
          </button>
        )}
      </div>
    </div>
  );
}
