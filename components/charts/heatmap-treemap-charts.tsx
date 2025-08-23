"use client";

import React from "react";
import { Treemap, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { HeatmapTreemapChartsProps } from "./types";
import { CustomChartTooltip, HeatmapTooltip } from "./chart-tooltip";

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

// Enhanced Custom Treemap Content Component
const CustomTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, name, value } = props;

  // Don't render if too small
  if (width < 10 || height < 10) return null;

  const colorIndex = depth === 0 ? index : (payload?.parentIndex || 0) + index;
  const fillColor = generateColor(colorIndex);
  const textColor = depth === 0 ? '#fff' : '#333';
  const fontSize = Math.min(width / 8, height / 4, 14);
  const shouldShowText = width > 30 && height > 20;
  const shouldShowValue = width > 50 && height > 30;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: fillColor,
          fillOpacity: depth === 0 ? 0.8 : 0.6,
          stroke: '#fff',
          strokeWidth: depth === 0 ? 2 : 1,
          strokeOpacity: 1,
        }}
      />
      
      {/* Main label */}
      {shouldShowText && name && (
        <text 
          x={x + width / 2} 
          y={y + height / 2 - (shouldShowValue ? fontSize / 2 : 0)} 
          textAnchor="middle" 
          fill={textColor} 
          fontSize={fontSize}
          fontWeight={depth === 0 ? 'bold' : 'normal'}
        >
          {name.length > width / 8 ? name.substring(0, Math.floor(width / 8)) + '...' : name}
        </text>
      )}
      
      {/* Value label */}
      {shouldShowValue && value && (
        <text 
          x={x + width / 2} 
          y={y + height / 2 + fontSize} 
          textAnchor="middle" 
          fill={textColor} 
          fontSize={fontSize * 0.8}
          opacity={0.8}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </text>
      )}
      
      {/* Depth indicator removed for localization */}
    </g>
  );
};

// Enhanced Generic Heatmap Component
const HeatmapChart = ({ data, title, rows = 12, cols = 12 }: { data: any[]; title: string; rows?: number; cols?: number }) => {
  const { t } = useI18n();

  // Handle multiple data formats
  const processedData = Array.isArray(data[0])
    ? data
        .map((row, rowIndex) =>
          row.map((value: number, colIndex: number) => ({
            x: colIndex,
            y: rowIndex,
            value,
            label: t("charts.heatmap.rowCol", { row: rowIndex + 1, col: colIndex + 1 }),
          }))
        )
        .flat()
    : data.map((item: any, index: number) => ({
        x: item.x ?? (index % cols),
        y: item.y ?? Math.floor(index / cols),
        value: item.value ?? item,
        label:
          item.label ||
          t("charts.heatmap.cell", {
            row: Math.floor(index / cols) + 1,
            col: (index % cols) + 1,
          }),
        ...item,
      }));

  const maxValue = Math.max(...processedData.map((item: any) => Number(item.value) || 0));
  const minValue = Math.min(...processedData.map((item: any) => Number(item.value) || 0));
  const range = maxValue - minValue || 1;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <div
        className={`grid gap-1 max-w-2xl`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {processedData.map((item: any, index: number) => {
          const intensity = (Number(item.value) - minValue) / range;
          const colorIndex = Math.floor(intensity * 10);
          return (
            <HeatmapTooltip key={index} item={item}>
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
                style={{
                  backgroundColor: generateColor(colorIndex),
                  opacity: 0.3 + intensity * 0.7,
                  color: intensity > 0.6 ? "white" : "black",
                }}
              >
                {item.showValue !== false && (Number(item.value) < 100 ? item.value : "")}
              </div>
            </HeatmapTooltip>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>{t("charts.heatmap.min", { value: minValue })}</span>
        <span>{t("charts.heatmap.max", { value: maxValue })}</span>
      </div>
    </div>
  );
};

export function HeatmapTreemapCharts({ 
  data = [],
  heatmapData1 = [],
  heatmapData2 = [],
  calendarData = [],
  hierarchicalData = [],
  treemapData = []
}: HeatmapTreemapChartsProps & { 
  heatmapData1?: any[];
  heatmapData2?: any[];
  hierarchicalData?: any[];
  calendarData?: any[];
  treemapData?: any[];
}) {
  const { t } = useI18n();
  
  // Custom tooltip for dark theme compatibility
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="text-foreground font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Basic Treemap */}
      {(data.length > 0 || treemapData.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.treemap.basic.title")}</CardTitle>
            <CardDescription>{t("charts.treemap.basic.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={
                  treemapData.length > 0
                    ? treemapData
                    : data.length > 0
                    ? data
                    : [
                        { name: t("departments.technology"), size: 400, fill: generateColor(0) },
                        { name: t("departments.marketing"), size: 300, fill: generateColor(1) },
                        { name: t("departments.sales"), size: 250, fill: generateColor(2) },
                        { name: t("departments.support"), size: 200, fill: generateColor(3) },
                        { name: t("departments.operations"), size: 150, fill: generateColor(4) },
                      ]
                }
                dataKey="size"
                stroke="#fff"
                fill="#8884d8"
              >
                <CustomChartTooltip />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Hierarchical Treemap */}
      {hierarchicalData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.treemap.hierarchical.title")}</CardTitle>
            <CardDescription>{t("charts.treemap.hierarchical.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <Treemap
                data={hierarchicalData}
                dataKey="size"
                stroke="#fff"
                content={<CustomTreemapContent />}
              >
                <CustomChartTooltip />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Heatmap Grids */}
      {(heatmapData1.length > 0 || heatmapData2.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.heatmap.title")}</CardTitle>
            <CardDescription>{t("charts.heatmap.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heatmapData1.length > 0 && (
                <HeatmapChart
                  data={heatmapData1}
                  title={t("charts.heatmap.patternA")}
                />
              )}
              {heatmapData2.length > 0 && (
                <HeatmapChart
                  data={heatmapData2}
                  title={t("charts.heatmap.patternB")}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.heatmap.calendar.title")}</CardTitle>
          <CardDescription>{t("charts.heatmap.calendar.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-1">
              {(calendarData.length > 0 ? calendarData : data.length > 0 ? data : []).map(
                (item: any, i: number) => {
                  const intensity =
                    typeof item === "object" ? item.value || Math.random() : Math.random();
                  return (
                    <HeatmapTooltip
                      key={i}
                      item={{
                        ...item,
                        label: t("charts.heatmap.calendar.dayLabel", { day: i + 1 }),
                        value: Math.floor(intensity * 100),
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-sm cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: `rgba(34, 197, 94, ${intensity})`,
                        }}
                      />
                    </HeatmapTooltip>
                  );
                },
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t("charts.heatmap.calendar.less")}</span>
              <div className="flex space-x-1">
                {[0, 0.25, 0.5, 0.75, 1].map((intensity, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${intensity})`,
                    }}
                  />
                ))}
              </div>
              <span>{t("charts.heatmap.calendar.more")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
