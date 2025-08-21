"use client";

import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
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

// Custom Gauge Component
const GaugeChart = ({ value, max = 100, title }: { value: number; max?: number; title: string }) => {
  const percentage = (value / max) * 100;
  const angle = (percentage / 100) * 180;
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-32 h-16">
        <svg width="128" height="64" viewBox="0 0 128 64">
          {/* Background arc */}
          <path
            d="M 10 54 A 54 54 0 0 1 118 54"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 10 54 A 54 54 0 0 1 118 54"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 170} 170`}
            className="transition-all duration-1000"
          />
          {/* Needle */}
          <line
            x1="64"
            y1="54"
            x2={64 + 40 * Math.cos((angle - 90) * (Math.PI / 180))}
            y2={54 + 40 * Math.sin((angle - 90) * (Math.PI / 180))}
            stroke="#1f2937"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Center dot */}
          <circle cx="64" cy="54" r="3" fill="#1f2937" />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center">
          <span className="text-lg font-bold">{value}</span>
        </div>
      </div>
      <span className="text-sm text-gray-600">{title}</span>
    </div>
  );
};

export function RadarGaugeCharts({ 
  data = [] 
}: GenericChartsProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Basic Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.basic.title")}</CardTitle>
          <CardDescription>{t("charts.radar.basic.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 150]} />
              {data.length > 0 && Object.keys(data[0])
                .filter(key => key !== 'subject' && key !== 'skill' && key !== 'fullMark')
                .map((key, index) => (
                  <Radar
                    key={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    dataKey={key}
                    stroke={generateColor(index)}
                    fill={generateColor(index)}
                    fillOpacity={0.6}
                  />
                ))}
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Series Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.multiSeries.title")}</CardTitle>
          <CardDescription>{t("charts.radar.multiSeries.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 150]} />
              {data.length > 0 && Object.keys(data[0])
                .filter(key => key !== 'subject' && key !== 'skill' && key !== 'fullMark')
                .map((key, index) => (
                  <Radar
                    key={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    dataKey={key}
                    stroke={generateColor(index)}
                    fill={generateColor(index)}
                    fillOpacity={0.4}
                  />
                ))}
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Skills Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.radar.skills.title")}</CardTitle>
          <CardDescription>{t("charts.radar.skills.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              {data.length > 0 && Object.keys(data[0])
                .filter(key => key !== 'subject' && key !== 'skill' && key !== 'fullMark')
                .map((key, index) => (
                  <Radar
                    key={key}
                    name={key.charAt(0).toUpperCase() + key.slice(1)}
                    dataKey={key}
                    stroke={generateColor(index)}
                    fill={generateColor(index)}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                ))}
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gauge Charts */}
      <Card>
        <CardHeader>
          <CardTitle>{t("charts.gauge.title")}</CardTitle>
          <CardDescription>{t("charts.gauge.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GaugeChart value={75} title="Performance" />
            <GaugeChart value={88} title="Quality" />
            <GaugeChart value={92} title="Efficiency" />
            <GaugeChart value={67} title="Satisfaction" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
