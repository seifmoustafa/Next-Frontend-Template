"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { BarChartsProps } from "./types";
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

export function BarCharts({ 
  basicData = [],
  stackedData = [],
  multiColorData = [],
  positiveNegativeData = []
}: BarChartsProps) {
  const { t } = useI18n();
  
  // Use provided data only (no sample data in components)

  return (
    <div className="space-y-6">
      {/* Basic Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.basic.title")}</CardTitle>
          <CardDescription>{t("charts.bar.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={basicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {basicData.length > 0 && Object.keys(basicData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={generateColor(index)} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.stacked.title")}</CardTitle>
          <CardDescription>{t("charts.bar.stacked.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {stackedData.length > 0 && Object.keys(stackedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={generateColor(index)} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Color Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.multiColor.title")}</CardTitle>
          <CardDescription>{t("charts.bar.multiColor.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={multiColorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {multiColorData.length > 0 && Object.keys(multiColorData[0])
                .filter(key => key !== 'name')
                .map((dataKey, dataIndex) => (
                  <Bar key={dataKey} dataKey={dataKey}>
                    {multiColorData.map((entry: any, index: number) => (
                      <Cell key={`cell-${dataKey}-${index}`} fill={generateColor(dataIndex + index)} />
                    ))}
                  </Bar>
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Positive and Negative Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.bar.positiveNegative.title")}</CardTitle>
          <CardDescription>{t("charts.bar.positiveNegative.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positiveNegativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {positiveNegativeData.length > 0 && Object.keys(positiveNegativeData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={generateColor(index)} />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
