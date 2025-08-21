"use client";

import React from "react";
import {
  Treemap,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/providers/i18n-provider";
import { GenericChartsProps } from "./types";

// Custom Treemap Content Component
const CustomTreemapContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : '#fff',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
          {index + 1}
        </text>
      ) : null}
    </g>
  );
};

// Custom Heatmap Component with Enhanced Tooltips
const HeatmapChart = ({ data, title }: { data: any[]; title: string }) => {
  if (!data || data.length === 0) return null;
  
  // Handle both array of arrays and array of objects
  const processedData = Array.isArray(data[0]) ? 
    data.map((row, rowIndex) => 
      row.map((value: number, colIndex: number) => ({
        x: colIndex,
        y: rowIndex, 
        value,
        label: `Day ${rowIndex + 1}, Week ${colIndex + 1}`
      }))
    ).flat() :
    data;
    
  const maxValue = Math.max(...processedData.map((item: any) => item.value || 0));
  const minValue = Math.min(...processedData.map((item: any) => item.value || 0));
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">{title}</h4>
      <div className="grid grid-cols-12 gap-1 max-w-2xl">
        {processedData.map((item: any, index: number) => {
          const intensity = (item.value - minValue) / (maxValue - minValue);
          return (
            <div
              key={index}
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform relative group"
              style={{
                backgroundColor: `hsl(${120 - intensity * 120}, 70%, ${50 + intensity * 30}%)`,
                color: intensity > 0.6 ? 'white' : 'black',
              }}
            >
              <span className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                {item.label || `Value: ${item.value}`}
              </span>
              {item.value}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <span>Low: {minValue}</span>
        <span>High: {maxValue}</span>
      </div>
    </div>
  );
};

export function HeatmapTreemapCharts({ 
  data = [],
  heatmapData1 = [],
  heatmapData2 = [],
  hierarchicalData = []
}: GenericChartsProps & {
  heatmapData1?: any[];
  heatmapData2?: any[];
  hierarchicalData?: any[];
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
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.treemap.basic.title")}</CardTitle>
          <CardDescription>{t("charts.treemap.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={data}
              dataKey="size"
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip />
            </Treemap>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
                content={<CustomTreemapContent colors={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"]} />}
              >
                <Tooltip />
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
              {heatmapData1.length > 0 && <HeatmapChart data={heatmapData1} title="Activity Pattern A" />}
              {heatmapData2.length > 0 && <HeatmapChart data={heatmapData2} title="Activity Pattern B" />}
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
              {Array.from({ length: 365 }, (_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${intensity})`,
                    }}
                    title={`Day ${i + 1}: ${Math.floor(intensity * 100)} commits`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Less</span>
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
              <span>More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
