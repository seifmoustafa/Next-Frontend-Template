"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { LineChartsProps } from "./types";
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

export function LineCharts({ 
  basicData = [],
  multiSeriesData = [],
  curvedData = [],
  steppedData = []
}: LineChartsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Basic Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.basic.title")}</CardTitle>
          <CardDescription>{t("charts.line.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={basicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {basicData.length > 0 && Object.keys(basicData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={generateColor(index)} 
                    strokeWidth={2} 
                  />
                ))}

            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.line.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={multiSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {multiSeriesData.length > 0 && Object.keys(multiSeriesData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={generateColor(index)} 
                    strokeWidth={2} 
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Curved Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.curved.title")}</CardTitle>
          <CardDescription>{t("charts.line.curved.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={curvedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {curvedData.length > 0 && Object.keys(curvedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={generateColor(index)} 
                    strokeWidth={3}
                    dot={{ fill: generateColor(index), strokeWidth: 2, r: 4 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stepped Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.line.stepped.title")}</CardTitle>
          <CardDescription>{t("charts.line.stepped.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={steppedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {steppedData.length > 0 && Object.keys(steppedData[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="step" 
                    dataKey={key} 
                    stroke={generateColor(index)} 
                    strokeWidth={2}
                    dot={{ fill: generateColor(index), strokeWidth: 2, r: 3 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
