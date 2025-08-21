"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
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

export function ScatterBubbleCharts({ 
  data = [],
  scatterData = [],
  bubbleData = []
}: GenericChartsProps & { scatterData?: any[]; bubbleData?: any[] }) {
  const { t } = useI18n();
  
  // Use provided data only (no sample data in components)
  const finalScatterData = scatterData.length > 0 ? scatterData : data;
  const finalBubbleData = bubbleData.length > 0 ? bubbleData : data;

  return (
    <div className="space-y-6">
      {/* Basic Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.basic.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomChartTooltip />} />
              <Scatter name="Data" data={finalScatterData} fill={generateColor(0)} />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomChartTooltip />} />
              <Scatter name="Series 1" data={finalScatterData} fill={generateColor(0)} />
              <Scatter 
                name="Series 2" 
                data={finalBubbleData.map(item => ({ x: item.x + 20, y: item.y + 50, z: item.z, name: item.name }))} 
                fill={generateColor(1)} 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bubble Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.bubble.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.bubble.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="GDP per capita" 
                unit="k$" 
                domain={[60, 100]}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Life expectancy" 
                unit="years" 
                domain={[0, 150]}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Country: ${label}`}
              />
              <Scatter name="Countries" data={finalBubbleData} fill={generateColor(0)}>
                {finalBubbleData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={generateColor(index)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Custom Shape Scatter Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.scatter.customShape.title")}</CardTitle>
          <CardDescription>{t("charts.scatter.customShape.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="stature" unit="cm" />
              <YAxis type="number" dataKey="y" name="weight" unit="kg" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomChartTooltip />} />
              <Scatter 
                name="Data points" 
                data={finalScatterData}
                fill={generateColor(0)}
                shape="diamond"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
