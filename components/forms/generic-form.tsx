"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import GenericSelect from "@/components/ui/generic-select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettings } from "@/providers/settings-provider";
import { useI18n } from "@/providers/i18n-provider";
import { cn, toDateInputValue, fromDateInputValue } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label?: string; // Optional for hidden fields
  type: "text" | "password" | "email" | "number" | "tel" | "url" | "textarea" | "richtext" | "select" | "searchable-select" | "server-select" | "multi-select" | "switch" | "checkbox" | "radio" | "slider" | "range" | "hidden" | "date" | "datetime" | "datetime-local" | "time" | "month" | "week" | "color" | "file";
  placeholder?: string;
  searchPlaceholder?: string; // For searchable selects
  required?: boolean;
  options?: FieldOption[];
  defaultValue?: any;
  // Input specific options
  min?: number | string; // For number, date, range inputs
  max?: number | string; // For number, date, range inputs
  step?: number | string; // For number, range inputs
  rows?: number; // For textarea
  cols?: number; // For textarea
  accept?: string; // For file inputs
  multiple?: boolean; // For file inputs and multi-select
  // Searchable select specific options
  searchType?: "client" | "server";
  onServerSearch?: (query: string) => Promise<FieldOption[]>;
  searchEndpoint?: string;
  debounceMs?: number;
  allowClear?: boolean;
  noResultsText?: string;
  searchingText?: string;
  // Dynamic field behavior
  dependsOn?: string; // Field name this field depends on
  isVisible?: (formData: Record<string, any>) => boolean; // Function to determine visibility
  onChange?: (value: any, formData: Record<string, any>) => void; // Callback when field value changes
  loading?: boolean; // Show loading state
  disabled?: boolean; // Disable field
  // Validation
  pattern?: string; // For text inputs
  minLength?: number; // For text inputs
  maxLength?: number; // For text inputs
}

interface GenericFormProps {
  fields: FieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  readOnly?: boolean; // New prop for read-only mode
}

export function GenericForm({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  readOnly = false,
}: GenericFormProps) {
  const settings = useSettings();
  const { t, direction } = useI18n();
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data = { ...initialValues };
    // Set default values for fields that have them and convert dates for HTML inputs
    fields.forEach(field => {
      if (field.defaultValue !== undefined && data[field.name] === undefined) {
        data[field.name] = field.defaultValue;
      }
      // Convert date fields from API format to HTML input format
      if ((field.type === "date" || field.type === "datetime" || field.type === "datetime-local" || field.type === "time" || field.type === "month" || field.type === "week") && data[field.name]) {
        data[field.name] = toDateInputValue(data[field.name]);
      }
    });
    return data;
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Find the field that changed and call its onChange callback if it exists
      const field = fields.find(f => f.name === name);
      if (field?.onChange) {
        field.onChange(value, newData);
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert date fields back to ISO format for API
      const submitData = { ...formData };
      fields.forEach(field => {
        if ((field.type === "date" || field.type === "datetime" || field.type === "datetime-local" || field.type === "time" || field.type === "month" || field.type === "week") && submitData[field.name]) {
          submitData[field.name] = fromDateInputValue(submitData[field.name]);
        }
      });
      await onSubmit(submitData);
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
    // Use formStyle for spacing if available, otherwise fallback to spacingSize
    const style = settings.formStyle || settings.spacingSize;
    switch (style) {
      case "compact":
        return "space-y-1";
      case "spacious":
        return "space-y-4";
      case "inline":
        return "flex items-center gap-4";
      case "modern":
        return "space-y-3";
      case "glass":
        return "space-y-3";
      case "minimal":
        return "space-y-2";
      case "card":
        return "space-y-3";
      default:
        // Handle spacingSize fallback for comfortable
        if (settings.spacingSize === "comfortable") {
          return "space-y-3";
        }
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

  const getFormContainerClasses = () => {
    const style = settings.formStyle;
    const baseClasses = "w-full max-h-[70vh] overflow-y-auto p-6";

    switch (style) {
      case "modern":
        return cn(baseClasses, "bg-gradient-to-br from-background to-muted/20 rounded-2xl border shadow-lg");
      case "glass":
        return cn(baseClasses, "bg-white/10 backdrop-blur-md rounded-2xl border border-white/20");
      case "minimal":
        return cn(baseClasses, "bg-transparent border-none shadow-none p-4");
      case "card":
        return cn(baseClasses, "bg-card rounded-xl border shadow-md");
      default:
        return cn(baseClasses);
    }
  };

  const getLabelClasses = () => {
    const style = settings.formStyle;
    const baseClasses = "font-medium";

    switch (style) {
      case "modern":
        return cn(baseClasses, "text-foreground/90 font-semibold");
      case "glass":
        return cn(baseClasses, "text-foreground/80");
      case "minimal":
        return cn(baseClasses, "text-sm text-muted-foreground uppercase tracking-wide");
      case "card":
        return cn(baseClasses, "text-card-foreground");
      default:
        return cn(baseClasses);
    }
  };

  const getInputClasses = (baseInputClasses: string) => {
    const style = settings.formStyle;

    switch (style) {
      case "modern":
        return cn(baseInputClasses, "rounded-xl border-2 bg-background/50 focus:bg-background transition-colors");
      case "glass":
        return cn(baseInputClasses, "rounded-xl bg-white/10 border-white/30 backdrop-blur-sm");
      case "minimal":
        return cn(baseInputClasses, "border-0 border-b-2 rounded-none bg-transparent focus:border-primary");
      case "card":
        return cn(baseInputClasses, "rounded-lg bg-muted/30 border-muted");
      case "neon":
        return cn(baseInputClasses, "rounded-xl border-2 border-cyan-400/50 bg-black/50 text-cyan-100 placeholder:text-cyan-400/60 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20");
      case "elegant":
        return cn(baseInputClasses, "rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-inner focus:ring-2 focus:ring-slate-400/20");
      case "organic":
        return cn(baseInputClasses, "rounded-full border-2 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 focus:border-green-500 focus:bg-green-100 dark:focus:bg-green-900/30");
      case "retro":
        return cn(baseInputClasses, "rounded border-2 border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20 focus:border-orange-600 shadow-sm");
      default:
        return cn(baseInputClasses);
    }
  };

  return (
    <div className={cn(
      getFormContainerClasses(),
      direction === "rtl" ? "text-right" : "text-left"
    )} dir={direction}>
      <form onSubmit={handleSubmit} className={getFormSpacing()}>
        {fields
          .filter(field => !field.isVisible || field.isVisible(formData))
          .map((field) =>
            field.type === "hidden" ? (
              <input
                key={field.name}
                type="hidden"
                name={field.name}
                value={formData[field.name] || ""}
              />
            ) : (
              <div key={field.name} className={getFieldSpacing()}>
                {field.type !== "switch" && (
                  <Label
                    htmlFor={field.name}
                    className={cn(
                      getLabelClasses(),
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                  >
                    {field.label}
                  </Label>
                )}
                {field.type === "select" ? (
                  <GenericSelect
                    type="single"
                    options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
                    value={formData[field.name] || ""}
                    onValueChange={(value: string | string[]) => handleChange(field.name, typeof value === 'string' ? value : value[0])}
                    placeholder={field.placeholder}
                    disabled={field.disabled || readOnly}
                    className={getInputClasses(getInputHeight())}
                  />
                ) : field.type === "searchable-select" || field.type === "server-select" ? (
                  <GenericSelect
                    type="searchable"
                    options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
                    value={formData[field.name] || ""}
                    onValueChange={(value: string | string[]) => handleChange(field.name, typeof value === 'string' ? value : value[0])}
                    placeholder={field.placeholder}
                    searchPlaceholder={field.searchPlaceholder}
                    searchType={field.searchType || "client"}
                    onServerSearch={field.onServerSearch ? async (query: string) => {
                      const results = await field.onServerSearch!(query);
                      return results.map(r => ({ value: r.value, label: r.label }));
                    } : undefined}
                    searchEndpoint={field.searchEndpoint}
                    debounceMs={field.debounceMs}
                    loading={field.loading}
                    noResultsText={field.noResultsText}
                    searchingText={field.searchingText}
                    disabled={field.disabled || readOnly}
                    className={getInputClasses(getInputHeight())}
                  />
                ) : field.type === "multi-select" ? (
                  <GenericSelect
                    type="multi"
                    options={field.options?.map(opt => ({ value: opt.value, label: opt.label })) || []}
                    value={formData[field.name] || []}
                    onValueChange={(value: string | string[]) => handleChange(field.name, Array.isArray(value) ? value : [value])}
                    placeholder={field.placeholder}
                    searchPlaceholder={field.searchPlaceholder}
                    searchType={field.searchType || "client"}
                    onServerSearch={field.onServerSearch ? async (query: string) => {
                      const results = await field.onServerSearch!(query);
                      return results.map(r => ({ value: r.value, label: r.label }));
                    } : undefined}
                    searchEndpoint={field.searchEndpoint}
                    debounceMs={field.debounceMs}
                    loading={field.loading}
                    noResultsText={field.noResultsText}
                    searchingText={field.searchingText}
                    disabled={field.disabled || readOnly}
                    className={getInputClasses(getInputHeight())}
                  />
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className={cn(
                      getInputClasses("min-h-[80px]"),
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                    placeholder={field.placeholder}
                    rows={field.rows || 4}
                    disabled={field.disabled || readOnly}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    dir={direction}
                  />
                ) : field.type === "richtext" ? (
                  <RichTextEditor
                    value={formData[field.name] || ""}
                    onChange={(value) => handleChange(field.name, value)}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    minHeight={field.rows ? field.rows * 20 : 200}
                    className={cn(
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                  />
                ) : field.type === "switch" ? (
                  <div className={cn(
                    "flex items-center justify-between"
                  )}>
                    <Label htmlFor={field.name} className={cn(
                      "font-medium",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}>
                      {field.label}
                    </Label>
                    <Switch
                      id={field.name}
                      checked={formData[field.name] || false}
                      onCheckedChange={(checked) => handleChange(field.name, checked)}
                      disabled={field.disabled || readOnly}
                    />
                  </div>
                ) : field.type === "checkbox" ? (
                  <div className={cn(
                    "flex items-center",
                    direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"
                  )}>
                    <Checkbox
                      id={field.name}
                      checked={formData[field.name] || false}
                      onCheckedChange={(checked) => handleChange(field.name, checked)}
                      disabled={field.disabled || readOnly}
                      design={settings.checkboxStyle}
                    />
                    <Label htmlFor={field.name} className={cn(
                      "text-sm",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}>
                      {field.label}
                    </Label>
                  </div>
                ) : field.type === "radio" ? (
                  <RadioGroup
                    value={formData[field.name] || ""}
                    onValueChange={(value) => handleChange(field.name, value)}
                    disabled={field.disabled || readOnly}
                    design={settings.radioStyle}
                  >
                    {field.options?.map((option) => (
                      <div key={option.value} className={cn(
                        "flex items-center",
                        direction === "rtl" ? "space-x-reverse space-x-2" : "space-x-2"
                      )}>
                        <RadioGroupItem
                          value={option.value}
                          id={`${field.name}-${option.value}`}
                          design={settings.radioStyle}
                        />
                        <Label htmlFor={`${field.name}-${option.value}`} className={cn(
                          "text-sm",
                          direction === "rtl" ? "text-right" : "text-left"
                        )}>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : field.type === "slider" || field.type === "range" ? (
                  <div className="space-y-2">
                    <Slider
                      value={[formData[field.name] || field.min || 0]}
                      onValueChange={(value) => handleChange(field.name, value[0])}
                      min={Number(field.min) || 0}
                      max={Number(field.max) || 100}
                      step={Number(field.step) || 1}
                      disabled={field.disabled || readOnly}
                      className="w-full"
                    />
                    <div className={cn(
                      "text-sm text-muted-foreground",
                      direction === "rtl" ? "text-right" : "text-left"
                    )}>
                      {t("common.value")}: {formData[field.name] || field.min || 0}
                    </div>
                  </div>
                ) : field.type === "date" || field.type === "datetime" || field.type === "datetime-local" || field.type === "time" || field.type === "month" || field.type === "week" ? (
                  <DatePicker
                    id={field.name}
                    type={field.type === "datetime" ? "datetime-local" : field.type as any}
                    value={formData[field.name] || ""}
                    onChange={(value) => handleChange(field.name, value)}
                    required={field.required}
                    className={getInputClasses(getInputHeight())}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "file" ? (
                  <Input
                    id={field.name}
                    type="file"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (field.multiple) {
                        handleChange(field.name, files ? Array.from(files) : []);
                      } else {
                        handleChange(field.name, files?.[0] || null);
                      }
                    }}
                    required={field.required}
                    className={cn(
                      getInputClasses(getInputHeight()),
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                    accept={field.accept}
                    multiple={field.multiple}
                    disabled={field.disabled || readOnly}
                    dir={direction}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required={field.required}
                    className={cn(
                      getInputClasses(getInputHeight()),
                      direction === "rtl" ? "text-right" : "text-left"
                    )}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    pattern={field.pattern}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    disabled={field.disabled || readOnly}
                    dir={direction}
                  />
                )}
              </div>
            )
          )}

        <Separator />

        {!readOnly && (
          <div className={cn(
            "flex flex-col sm:flex-row",
            direction === "rtl" ? "justify-start" : "justify-end",
            getGridGap(),
            getSeparatorSpacing()
          )}>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={cn(
                getInputHeight(),
                direction === "rtl" ? "order-1 sm:order-2" : "order-2 sm:order-1"
              )}
              disabled={loading}
              size={getButtonSize()}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                getInputHeight(),
                "gradient-primary",
                direction === "rtl" ? "order-2 sm:order-1" : "order-1 sm:order-2"
              )}
              size={getButtonSize()}
            >
              {loading ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        )}
        {readOnly && (
          <div className={cn(
            "flex justify-center",
            getSeparatorSpacing()
          )}>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={getInputHeight()}
              size={getButtonSize()}
            >
              {t("common.close")}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
