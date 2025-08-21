"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";

// Timeline Component
const TimelineChart = ({ data, title }: { data: any[]; title: string }) => {
  if (!data || data.length === 0) return null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "in-progress": return "bg-blue-500";
      case "pending": return "bg-gray-300";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{item.task}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <div className="text-xs text-gray-400">Duration: {item.duration} weeks</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Funnel Component
const FunnelChart = ({ data, title }: { data: any[]; title: string }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map((d: any) => d.value));
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="space-y-2">
        {data.map((item: any, index: number) => {
          const percentage = (item.value / maxValue) * 100;
          const conversionRate = index > 0 ? ((item.value / data[index - 1].value) * 100).toFixed(1) : "100.0";
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{item.stage}</span>
                <div className="text-right">
                  <div className="font-bold">{item.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{conversionRate}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color || "#8884d8",
                  }}
                >
                  {percentage > 20 && `${percentage.toFixed(0)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function TimelineFunnelCharts({ 
  data = [],
  funnelData = [],
  salesFunnelData = []
}: GenericChartsProps & {
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
            <TimelineChart data={data} title="Project Timeline" />
            <FunnelChart data={funnelData} title="Sales Funnel" />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Funnel Chart */}
      {salesFunnelData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.funnel.advanced.title")}</CardTitle>
            <CardDescription>{t("charts.funnel.advanced.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart data={salesFunnelData} title="Sales Process Funnel" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
