"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { AreaChartsProps } from "./types";
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

export function BasicAreaChart({ 
  data = [], 
  className = "",
  title = "Area Chart",
  description = "Data visualization with area chart",
  height = 300,
  showCard = true
}: { data?: any[], className?: string, title?: string, description?: string, height?: number, showCard?: boolean }) {
  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomChartTooltip />} />
        <Legend />
        {data.length > 0 && Object.keys(data[0])
          .filter(key => key !== 'name')
          .map((key, index) => (
            <Area 
              key={key}
              type="monotone" 
              dataKey={key} 
              stroke={generateColor(index)} 
              fill={generateColor(index)} 
              fillOpacity={0.6}
            />
          ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  if (!showCard) return <div className={className}>{content}</div>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

export function StackedAreaChart({ 
  data = [], 
  className = "",
  title = "Stacked Area Chart",
  description = "Multiple data series stacked",
  height = 300,
  showCard = true
}: { data?: any[], className?: string, title?: string, description?: string, height?: number, showCard?: boolean }) {
  // Dynamically get all data keys except 'name'
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'name') : [];
  // Use the infinite color generator
  
  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomChartTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => (
          <Area 
            key={key}
            type="monotone" 
            dataKey={key} 
            stackId="1" 
            stroke={generateColor(index)} 
            fill={generateColor(index)} 
            fillOpacity={0.6}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );

  if (!showCard) return <div className={className}>{content}</div>;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

export function AreaCharts({ 
  basicData = [], 
  stackedData = [], 
  className = ""
}: { basicData?: any[], stackedData?: any[], className?: string }) {
  const { t } = useI18n();
  
  return (
    <div className={`space-y-6 ${className}`}>
      <BasicAreaChart 
        data={basicData} 
        title={t("charts.area.basic.title")}
        description={t("charts.area.basic.description")}
      />
      <StackedAreaChart 
        data={stackedData} 
        title={t("charts.area.stacked.title")}
        description={t("charts.area.stacked.description")}
      />
    </div>
  );
}
