"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/providers/i18n-provider"
import { useSettings } from "@/providers/settings-provider"
import {
  Palette,
  Layout,
  Sliders,
  RotateCcw,
  Check,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Type,
  CircleOff,
  Circle,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsView() {
  const { t } = useI18n()
  const settings = useSettings()
  const [saved, setSaved] = useState(false)

  // Color themes
  const colorThemes = [
    { value: "purple", label: "أرجواني", lightClass: "bg-[#7c3aed]", darkClass: "bg-[#6d28d9]" },
    { value: "blue", label: "أزرق", lightClass: "bg-[#2563eb]", darkClass: "bg-[#1d4ed8]" },
    { value: "green", label: "أخضر", lightClass: "bg-[#16a34a]", darkClass: "bg-[#15803d]" },
    { value: "orange", label: "برتقالي", lightClass: "bg-[#ea580c]", darkClass: "bg-[#c2410c]" },
    { value: "red", label: "أحمر", lightClass: "bg-[#dc2626]", darkClass: "bg-[#b91c1c]" },
    { value: "teal", label: "فيروزي", lightClass: "bg-[#0d9488]", darkClass: "bg-[#0f766e]" },
  ]

  // Layout templates
  const layoutTemplates = [
    {
      value: "default",
      label: "الافتراضي",
      description: "تصميم كلاسيكي مع شريط جانبي وهيدر علوي",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      value: "modern",
      label: "عصري",
      description: "تصميم عصري مع شريط جانبي مصغر وهيدر كبير",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      value: "minimal",
      label: "بسيط",
      description: "تصميم بسيط مع شريط علوي فقط وقوائم منسدلة",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      value: "classic",
      label: "كلاسيكي",
      description: "تصميم كلاسيكي مع شريط جانبي عريض وأيقونات كبيرة",
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  // Card styles
  const cardStyles = [
    { value: "default", label: "افتراضي", description: "بطاقات بتصميم بسيط" },
    { value: "glass", label: "زجاجي", description: "تأثير زجاجي شفاف" },
    { value: "solid", label: "صلب", description: "بطاقات ملونة بالكامل" },
    { value: "bordered", label: "إطار", description: "بطاقات بإطار واضح" },
  ]

  // Animation levels
  const animationLevels = [
    { value: "none", label: "بدون", description: "بدون تأثيرات حركية" },
    { value: "minimal", label: "بسيط", description: "تأثيرات حركية بسيطة" },
    { value: "moderate", label: "متوسط", description: "تأثيرات حركية متوسطة" },
    { value: "high", label: "عالي", description: "تأثيرات حركية متقدمة" },
  ]

  // Font sizes
  const fontSizes = [
    { value: "small", label: "صغير", description: "خط أصغر للواجهة" },
    { value: "default", label: "متوسط", description: "حجم الخط الافتراضي" },
    { value: "large", label: "كبير", description: "خط أكبر للواجهة" },
  ]

  // Border radius options
  const borderRadiusOptions = [
    { value: "none", label: "بدون", icon: CircleOff },
    { value: "small", label: "صغير", icon: Circle },
    { value: "default", label: "متوسط", icon: Circle },
    { value: "large", label: "كبير", icon: Circle },
    { value: "full", label: "دائري", icon: Circle },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("nav.settings")}</h1>
        <p className="text-muted-foreground mt-2">تخصيص واجهة التطبيق والإعدادات العامة</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>المظهر</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>التخطيط</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>متقدم</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          {/* Color Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <span>سمة الألوان</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الوضع المظلم</Label>
                  <p className="text-sm text-muted-foreground">تبديل بين الوضع الفاتح والمظلم</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch checked={settings.darkMode} onCheckedChange={settings.setDarkMode} />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Separator />

              {/* Color Theme Selection */}
              <div className="space-y-4">
                <Label>اختر سمة الألوان</Label>
                <div className="grid grid-cols-3 gap-4">
                  {colorThemes.map((theme) => (
                    <div
                      key={theme.value}
                      className={cn(
                        "relative flex flex-col items-center gap-2 rounded-lg border p-4 hover:border-primary cursor-pointer transition-all",
                        settings.colorTheme === theme.value && "border-primary bg-primary/5",
                      )}
                      onClick={() => settings.setColorTheme(theme.value as any)}
                    >
                      <div className="flex gap-2">
                        <div className={cn("h-6 w-6 rounded-full", theme.lightClass)} />
                        <div className={cn("h-6 w-6 rounded-full", theme.darkClass)} />
                      </div>
                      <span className="text-sm font-medium">{theme.label}</span>
                      {settings.colorTheme === theme.value && (
                        <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Style */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>نمط البطاقات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.cardStyle}
                onValueChange={(value) => settings.setCardStyle(value as any)}
                className="grid grid-cols-2 gap-4"
              >
                {cardStyles.map((style) => (
                  <div key={style.value}>
                    <RadioGroupItem value={style.value} id={`card-style-${style.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`card-style-${style.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 rounded-md border p-2 w-full h-12 flex items-center justify-center">
                        <span className="text-xs">{style.label}</span>
                      </div>
                      <p className="text-xs text-center text-muted-foreground">{style.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                <span>حجم الخط</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.fontSize}
                onValueChange={(value) => settings.setFontSize(value as any)}
                className="grid grid-cols-3 gap-4"
              >
                {fontSizes.map((size) => (
                  <div key={size.value}>
                    <RadioGroupItem value={size.value} id={`font-size-${size.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`font-size-${size.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span
                        className={cn(
                          "mb-2",
                          size.value === "small" && "text-sm",
                          size.value === "default" && "text-base",
                          size.value === "large" && "text-lg",
                        )}
                      >
                        {size.label}
                      </span>
                      <p className="text-xs text-center text-muted-foreground">{size.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Border Radius */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Circle className="h-5 w-5" />
                <span>استدارة الحواف</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.borderRadius}
                onValueChange={(value) => settings.setBorderRadius(value as any)}
                className="grid grid-cols-5 gap-4"
              >
                {borderRadiusOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={`border-radius-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`border-radius-${option.value}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Icon
                          className={cn(
                            "mb-2 h-6 w-6",
                            option.value === "none" && "rounded-none",
                            option.value === "small" && "rounded-sm",
                            option.value === "default" && "rounded-md",
                            option.value === "large" && "rounded-lg",
                            option.value === "full" && "rounded-full",
                          )}
                        />
                        <span className="text-xs">{option.label}</span>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6">
          {/* Layout Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                <span>قوالب التخطيط</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {layoutTemplates.map((template) => (
                  <div
                    key={template.value}
                    className={cn(
                      "relative rounded-lg border p-4 hover:border-primary cursor-pointer transition-all",
                      settings.layoutTemplate === template.value && "border-primary bg-primary/5",
                    )}
                    onClick={() => settings.setLayoutTemplate(template.value as any)}
                  >
                    <div className="aspect-video w-full rounded-md overflow-hidden mb-4">
                      <img
                        src={template.image || "/placeholder.svg"}
                        alt={template.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{template.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    {settings.layoutTemplate === template.value && (
                      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                <span>موضع الشريط الجانبي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.sidebarPosition}
                onValueChange={(value) => settings.setSidebarPosition(value as any)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="right" id="sidebar-right" className="peer sr-only" />
                  <Label
                    htmlFor="sidebar-right"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 w-full h-16 flex items-center">
                      <div className="h-full w-1/4 bg-primary/20 rounded-md ml-2"></div>
                      <div className="h-full flex-1 flex flex-col justify-between">
                        <div className="h-3 w-full bg-muted-foreground/20 rounded-md"></div>
                        <div className="h-10 w-full bg-muted-foreground/10 rounded-md"></div>
                      </div>
                    </div>
                    <span className="text-sm">يمين (RTL)</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="left" id="sidebar-left" className="peer sr-only" />
                  <Label
                    htmlFor="sidebar-left"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 w-full h-16 flex items-center">
                      <div className="h-full flex-1 flex flex-col justify-between">
                        <div className="h-3 w-full bg-muted-foreground/20 rounded-md"></div>
                        <div className="h-10 w-full bg-muted-foreground/10 rounded-md"></div>
                      </div>
                      <div className="h-full w-1/4 bg-primary/20 rounded-md mr-2"></div>
                    </div>
                    <span className="text-sm">يسار (LTR)</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Animation Level */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>مستوى التأثيرات الحركية</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.animationLevel}
                onValueChange={(value) => settings.setAnimationLevel(value as any)}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {animationLevels.map((level) => (
                  <div key={level.value}>
                    <RadioGroupItem value={level.value} id={`animation-${level.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`animation-${level.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div
                        className={cn(
                          "mb-2 flex items-center justify-center w-10 h-10 rounded-full",
                          level.value === "none" && "bg-muted-foreground/20",
                          level.value === "minimal" && "bg-primary/30",
                          level.value === "moderate" && "bg-primary/60",
                          level.value === "high" && "bg-primary",
                        )}
                      >
                        <Sparkles
                          className={cn(
                            "h-5 w-5",
                            level.value === "none" && "text-muted-foreground",
                            level.value !== "none" && "text-primary-foreground",
                          )}
                        />
                      </div>
                      <span className="text-sm font-medium">{level.label}</span>
                      <p className="text-xs text-center text-muted-foreground mt-1">{level.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                <span>إعادة ضبط الإعدادات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">
                  إعادة جميع إعدادات الواجهة إلى الوضع الافتراضي. هذا سيؤدي إلى إعادة ضبط جميع التخصيصات التي قمت بها.
                </p>
                <Button variant="destructive" className="w-full sm:w-auto" onClick={settings.resetSettings}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  إعادة ضبط جميع الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className={cn(
            "shadow-lg transition-all duration-300",
            saved ? "bg-green-600 hover:bg-green-700" : "gradient-primary",
          )}
          size="lg"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              تم الحفظ!
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
