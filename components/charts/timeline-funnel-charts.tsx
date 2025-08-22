"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";
import { CustomChartTooltip } from "./chart-tooltip";

// Infinite color palette generator
const generateColor = (index: number) => {
  const baseColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0", "#387908", 
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd", "#98d8c8", 
    "#f7dc6f", "#bb8fce", "#85c1e9", "#f8c471", "#82e0aa", "#f1948a", "#85929e",
    "#a569bd", "#5dade2", "#58d68d", "#f4d03f", "#ec7063", "#af7ac5", "#5499c7",
    "#52be80", "#f7dc6f", "#e74c3c", "#9b59b6", "#3498db", "#2ecc71", "#f39c12"
  ];
  
  if (index < baseColors.length) {
    return baseColors[index];
  }
  
  // Generate colors dynamically for unlimited series
  const hue = (index * 137.508) % 360; // Golden angle approximation
  const saturation = 65 + (index % 3) * 15; // Vary saturation
  const lightness = 45 + (index % 4) * 10; // Vary lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Enhanced Generic Timeline Component
const TimelineChart = ({ data, title, showProgress = true }: { data: any[]; title: string; showProgress?: boolean }) => {
  const { t } = useI18n();
  // Return empty state if no data provided
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("charts.timeline.noData")}</p>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: string, index: number) => {
    const statusColors = {
      "completed": "#22c55e",
      "in-progress": "#3b82f6", 
      "pending": "#9ca3af",
      "cancelled": "#ef4444",
      "on-hold": "#f59e0b"
    };
    return statusColors[status as keyof typeof statusColors] || generateColor(index);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-4">
        {data.map((item, index) => {
          const statusColor = getStatusColor(item.status, index);
          const progress = item.progress ?? (item.status === 'completed' ? 100 : item.status === 'in-progress' ? 50 : 0);
          
          return (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < data.length - 1 && (
                <div className="absolute left-1.5 top-6 w-0.5 h-8 bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                <div 
                  className="w-3 h-3 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1"
                  style={{ backgroundColor: statusColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {item.task || item.name || t("charts.timeline.defaultTask", { index: index + 1 })}
                      </span>
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.date && (
                          <span>{t("charts.timeline.date")}: {item.date}</span>
                        )}
                        {item.duration && (
                          <span className="ml-3">
                            {t("charts.timeline.duration")}: {item.duration} {t(`charts.timeline.${item.durationUnit || 'weeks'}`)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: statusColor }}>
                      {t(`charts.timeline.statuses.${item.status}`)}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  {showProgress && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{t("charts.timeline.progress")}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: statusColor,
                            opacity: 0.8
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Generic Funnel Component
const FunnelChart = ({ data, title, showConversion = true, showDropoff = false }: {
  data: any[];
  title: string;
  showConversion?: boolean;
  showDropoff?: boolean;
}) => {
  const { t } = useI18n();
  // Return empty state if no data provided
  if (!data || data.length === 0) {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("charts.funnel.noData")}</p>
        </div>
      </div>
    );
  }
  
  const maxValue = Math.max(...data.map((d: any) => Number(d.value) || 0));
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-3">
        {data.map((item: any, index: number) => {
          const value = Number(item.value) || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const conversionRate = index > 0 && data[index - 1] ? 
            ((value / (Number(data[index - 1].value) || 1)) * 100).toFixed(1) : "100.0";
          const dropoffCount = index > 0 && data[index - 1] ? 
            (Number(data[index - 1].value) || 0) - value : 0;
          const dropoffRate = index > 0 && data[index - 1] ? 
            ((dropoffCount / (Number(data[index - 1].value) || 1)) * 100).toFixed(1) : "0.0";
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">
                  {item.stage || item.name || t("charts.funnel.defaultStage", { index: index + 1 })}
                </span>
                <div className="text-right">
                  <div className="font-bold">{value.toLocaleString()}</div>
                  {showConversion && (
                    <div className="text-xs text-muted-foreground">
                      {t("charts.funnel.conversion")}: {conversionRate}%
                    </div>
                  )}
                  {showDropoff && index > 0 && (
                    <div className="text-xs text-red-500">
                      {t("charts.funnel.dropoff")}: {dropoffCount.toLocaleString()} ({dropoffRate}%)
                    </div>
                  )}
                </div>
              </div>
              
              {/* Funnel bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all duration-500 hover:opacity-90"
                    style={{
                      width: `${Math.max(percentage, 5)}%`, // Minimum 5% width for visibility
                      backgroundColor: item.color || generateColor(index),
                    }}
                  >
                    {percentage > 15 && `${percentage.toFixed(0)}%`}
                  </div>
                </div>
                
                {/* Funnel shape indicator */}
                <div className="absolute right-0 top-0 h-8 w-4 flex items-center">
                  <div 
                    className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent"
                    style={{
                      borderBottomColor: item.color || generateColor(index),
                      opacity: 0.7
                    }}
                  />
                </div>
              </div>
              
              {/* Additional metrics */}
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">{t("charts.funnel.totalConversion")}</span>
            <div className="font-medium">
              {data.length > 0 && maxValue > 0 ? 
                ((Number(data[data.length - 1]?.value) || 0) / maxValue * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">{t("charts.funnel.totalVolume")}</span>
            <div className="font-medium">{maxValue.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function TimelineFunnelCharts({ 
  data = [],
  conversionData = [],
  salesData = [],
  funnelData = [],
  salesFunnelData = []
}: GenericChartsProps & {
  conversionData?: any[];
  salesData?: any[];
  funnelData?: any[];
  salesFunnelData?: any[];
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Timeline and Funnel Charts */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.timeline.title")}</CardTitle>
          <CardDescription>{t("charts.timeline.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimelineChart 
              data={data} 
              title={t("charts.timeline.basic.title")} 
              showProgress={true}
            />
            <FunnelChart 
              data={conversionData.length > 0 ? conversionData : funnelData} 
              title={t("charts.timeline.funnel.title")}
              showConversion={true}
              showDropoff={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Funnel Chart */}
      {(salesData.length > 0 || salesFunnelData.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.funnel.advanced.title")}</CardTitle>
            <CardDescription>{t("charts.funnel.advanced.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart
              data={salesData.length > 0 ? salesData : salesFunnelData}
              title={t("charts.funnel.advanced.salesTitle")}
              showConversion={true}
              showDropoff={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
