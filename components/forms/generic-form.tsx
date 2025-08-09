"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "password" | "select" | "switch" | "hidden";
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  defaultValue?: any;
}

interface GenericFormProps {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export function GenericForm({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
}: GenericFormProps) {
  const settings = useSettings();
  const { t } = useI18n();
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data = { ...initialValues };
    // Set default values for fields that have them
    fields.forEach(field => {
      if (field.defaultValue !== undefined && data[field.name] === undefined) {
        data[field.name] = field.defaultValue;
      }
    });
    return data;
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const getFormSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-3";
      case "comfortable":
        return "space-y-6";
      case "spacious":
        return "space-y-8";
      default:
        return "space-y-4";
    }
  };

  const getFieldSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "space-y-1";
      case "comfortable":
        return "space-y-3";
      case "spacious":
        return "space-y-4";
      default:
        return "space-y-2";
    }
  };

  const getGridGap = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "gap-3";
      case "comfortable":
        return "gap-6";
      case "spacious":
        return "gap-8";
      default:
        return "gap-4";
    }
  };

  const getInputHeight = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "h-9";
      case "comfortable":
        return "h-12";
      case "spacious":
        return "h-14";
      default:
        return "h-10";
    }
  };

  const getButtonSize = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "sm";
      case "comfortable":
      case "spacious":
        return "lg";
      default:
        return "default";
    }
  };

  const getSeparatorSpacing = () => {
    switch (settings.spacingSize) {
      case "compact":
        return "pt-4 mt-4";
      case "comfortable":
        return "pt-8 mt-8";
      case "spacious":
        return "pt-10 mt-10";
      default:
        return "pt-6 mt-6";
    }
  };

  return (
    <div className="w-full max-h-[70vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className={getFormSpacing()}>
        {fields.map((field) => 
          field.type === "hidden" ? (
            <input
              key={field.name}
              type="hidden"
              name={field.name}
              value={formData[field.name] || ""}
            />
          ) : (
            <div key={field.name} className={getFieldSpacing()}>
              <Label htmlFor={field.name} className="font-medium">
                {field.label}
              </Label>
              {field.type === "select" ? (
                <Select
                  value={formData[field.name] || ""}
                  onValueChange={(value) => handleChange(field.name, value)}
                >
                  <SelectTrigger className={getInputHeight()}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "switch" ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={field.name}
                    checked={formData[field.name] || false}
                    onCheckedChange={(checked) => handleChange(field.name, checked)}
                  />
                  <Label htmlFor={field.name} className="text-sm text-muted-foreground">
                    {formData[field.name] ? t("common.yes") : t("common.no")}
                  </Label>
                </div>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                  className={getInputHeight()}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          )
        )}

        <Separator />

        <div className={cn("flex flex-col sm:flex-row justify-end", getGridGap(), getSeparatorSpacing())}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className={cn(getInputHeight(), "order-2 sm:order-1")}
            disabled={loading}
            size={getButtonSize()}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={cn(getInputHeight(), "gradient-primary order-1 sm:order-2")}
            size={getButtonSize()}
          >
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
