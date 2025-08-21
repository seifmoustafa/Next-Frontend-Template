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
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#8884d8" 
          fill="#8884d8" 
          fillOpacity={0.6}
        />
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
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  
  const content = (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {dataKeys.map((key, index) => (
          <Area 
            key={key}
            type="monotone" 
            dataKey={key} 
            stackId="1" 
            stroke={colors[index % colors.length]} 
            fill={colors[index % colors.length]} 
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
