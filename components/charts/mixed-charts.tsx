"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { CustomChartTooltip } from "./chart-tooltip";
import { GenericChartsProps } from "./types";

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

export function MixedCharts({ 
  data = [],
  lineBarData = [],
  dualAxisData = [],
  areaLineData = [],
  barAreaLineData = []
}: GenericChartsProps & { lineBarData?: any[]; dualAxisData?: any[]; areaLineData?: any[]; barAreaLineData?: any[] }) {
  const { t } = useI18n();

  // Use provided data or fallback to empty arrays (no sample data in components)
  const finalLineBarData = lineBarData.length > 0 ? lineBarData : data;
  const finalDualAxisData = dualAxisData.length > 0 ? dualAxisData : data;
  const finalAreaLineData = areaLineData.length > 0 ? areaLineData : data;
  const finalBarAreaLineData = barAreaLineData.length > 0 ? barAreaLineData : data;

  return (
    <div className="space-y-6">
      {/* Line + Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.lineBar.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.lineBar.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalLineBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {finalLineBarData.length > 0 && (() => {
                const chartData = finalLineBarData;
                const keys = Object.keys(chartData[0]).filter(key => key !== 'name');
                const barKeys = keys.slice(0, Math.ceil(keys.length / 2));
                const lineKeys = keys.slice(Math.ceil(keys.length / 2));
                return [
                  ...barKeys.map((key, index) => (
                    <Bar key={key} dataKey={key} barSize={20} fill={generateColor(index)} />
                  )),
                  ...lineKeys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={generateColor(barKeys.length + index)} strokeWidth={2} />
                  ))
                ];
              })()}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area + Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.areaLine.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.areaLine.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalAreaLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {finalAreaLineData.length > 0 && (() => {
                const chartData = finalAreaLineData;
                const keys = Object.keys(chartData[0]).filter(key => key !== 'name');
                const areaKeys = keys.slice(0, Math.ceil(keys.length / 2));
                const lineKeys = keys.slice(Math.ceil(keys.length / 2));
                return [
                  ...areaKeys.map((key, index) => (
                    <Area key={key} type="monotone" dataKey={key} fill={generateColor(index)} stroke={generateColor(index)} />
                  )),
                  ...lineKeys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={generateColor(areaKeys.length + index)} strokeWidth={2} />
                  ))
                ];
              })()}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar + Area + Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.barAreaLine.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.barAreaLine.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalBarAreaLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {finalBarAreaLineData.length > 0 && (() => {
                const keys = Object.keys(finalBarAreaLineData[0]).filter(key => key !== 'name');
                const areaKeys = keys.slice(0, Math.floor(keys.length / 3));
                const barKeys = keys.slice(Math.floor(keys.length / 3), Math.floor(2 * keys.length / 3));
                const lineKeys = keys.slice(Math.floor(2 * keys.length / 3));
                return [
                  ...areaKeys.map((key, index) => (
                    <Area key={key} type="monotone" dataKey={key} fill={generateColor(index)} stroke={generateColor(index)} />
                  )),
                  ...barKeys.map((key, index) => (
                    <Bar key={key} dataKey={key} barSize={20} fill={generateColor(areaKeys.length + index)} />
                  )),
                  ...lineKeys.map((key, index) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={generateColor(areaKeys.length + barKeys.length + index)} strokeWidth={2} />
                  ))
                ];
              })()}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Dual Y-Axis Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.mixed.dualAxis.title")}</CardTitle>
          <CardDescription>{t("charts.mixed.dualAxis.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={finalDualAxisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              {finalDualAxisData.length > 0 && (() => {
                const keys = Object.keys(finalDualAxisData[0]).filter(key => key !== 'name');
                const leftKeys = keys.slice(0, Math.ceil(keys.length / 2));
                const rightKeys = keys.slice(Math.ceil(keys.length / 2));
                return [
                  ...leftKeys.map((key, index) => (
                    <Bar key={key} yAxisId="left" dataKey={key} barSize={20} fill={generateColor(index)} />
                  )),
                  ...rightKeys.map((key, index) => (
                    <Line key={key} yAxisId="right" type="monotone" dataKey={key} stroke={generateColor(leftKeys.length + index)} strokeWidth={2} />
                  ))
                ];
              })()}
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
