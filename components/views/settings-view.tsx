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
import { useTheme } from "next-themes"
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
  Globe,
  Languages,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export function SettingsView() {
  const { t, language, setLanguage } = useI18n()
  const settings = useSettings()
  const { setTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  // Color themes
  const colorThemes = [
    { value: "purple", label: t("color.purple"), lightClass: "bg-[#7c3aed]", darkClass: "bg-[#6d28d9]" },
    { value: "blue", label: t("color.blue"), lightClass: "bg-[#2563eb]", darkClass: "bg-[#1d4ed8]" },
    { value: "green", label: t("color.green"), lightClass: "bg-[#16a34a]", darkClass: "bg-[#15803d]" },
    { value: "orange", label: t("color.orange"), lightClass: "bg-[#ea580c]", darkClass: "bg-[#c2410c]" },
    { value: "red", label: t("color.red"), lightClass: "bg-[#dc2626]", darkClass: "bg-[#b91c1c]" },
    { value: "teal", label: t("color.teal"), lightClass: "bg-[#0d9488]", darkClass: "bg-[#0f766e]" },
  ]

  // Layout templates - Updated with new layouts
  const layoutTemplates = [
    {
      value: "classic",
      label: t("layout.classic"),
      description: t("layout.classicDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Classic+Layout",
    },
    {
      value: "elegant",
      label: t("layout.elegant"),
      description: t("layout.elegantDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Elegant+Layout",
    },
    {
      value: "modern",
      label: t("layout.modern"),
      description: t("layout.modernDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Modern+Layout",
    },
    {
      value: "minimal",
      label: t("layout.minimal"),
      description: t("layout.minimalDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Minimal+Layout",
    },
    {
      value: "compact",
      label: t("layout.compact"),
      description: t("layout.compactDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Compact+Layout",
    },
    {
      value: "floating",
      label: t("layout.floating"),
      description: t("layout.floatingDesc"),
      image: "/placeholder.svg?height=100&width=200&text=Floating+Layout",
    },
  ]

  // Card styles
  const cardStyles = [
    { value: "default", label: t("cardStyle.default"), description: t("cardStyle.defaultDesc") },
    { value: "glass", label: t("cardStyle.glass"), description: t("cardStyle.glassDesc") },
    { value: "solid", label: t("cardStyle.solid"), description: t("cardStyle.solidDesc") },
    { value: "bordered", label: t("cardStyle.bordered"), description: t("cardStyle.borderedDesc") },
  ]

  // Logo types
  const logoTypes = [
    { value: "image", label: t("logoType.image"), description: t("logoType.imageDesc") },
    { value: "sparkles", label: t("logoType.sparkles"), description: t("logoType.sparklesDesc") },
    { value: "shield", label: t("logoType.shield"), description: t("logoType.shieldDesc") },
    { value: "custom", label: t("logoType.custom"), description: t("logoType.customDesc") },
  ]

  // Animation levels
  const animationLevels = [
    { value: "none", label: t("animation.none"), description: t("animation.noneDesc") },
    { value: "minimal", label: t("animation.minimal"), description: t("animation.minimalDesc") },
    { value: "moderate", label: t("animation.moderate"), description: t("animation.moderateDesc") },
    { value: "high", label: t("animation.high"), description: t("animation.highDesc") },
  ]

  // Font sizes
  const fontSizes = [
    { value: "small", label: t("fontSize.small"), description: t("fontSize.smallDesc") },
    { value: "default", label: t("fontSize.default"), description: t("fontSize.defaultDesc") },
    { value: "large", label: t("fontSize.large"), description: t("fontSize.largeDesc") },
  ]

  // Border radius options
  const borderRadiusOptions = [
    { value: "none", label: t("radius.none"), icon: CircleOff },
    { value: "small", label: t("radius.small"), icon: Circle },
    { value: "default", label: t("radius.default"), icon: Circle },
    { value: "large", label: t("radius.large"), icon: Circle },
    { value: "full", label: t("radius.full"), icon: Circle },
  ]

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("nav.settings")}</h1>
        <p className="text-muted-foreground mt-2">
          {language === "ar" ? "تخصيص واجهة التطبيق والإعدادات العامة" : "Customize app interface and general settings"}
        </p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>{t("settings.appearance")}</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>{t("settings.layout")}</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span>{t("settings.localization")}</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>{t("settings.advanced")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          {/* Color Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <span>{t("settings.colorTheme")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t("settings.darkMode")}</Label>
                  <p className="text-sm text-muted-foreground">{t("settings.lightDarkToggle")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => setTheme('light')}>{t('theme.light')}</Button>
                    <Button variant="outline" onClick={() => setTheme('dark')}>{t('theme.dark')}</Button>
                    <Button variant="outline" onClick={() => setTheme('system')}>{t('theme.system')}</Button>
                  </div>
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <Separator />

              {/* Color Theme Selection */}
              <div className="space-y-4">
                <Label>{t("settings.selectColorTheme")}</Label>
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
                <span>{t("settings.cardStyle")}</span>
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

          {/* Logo Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>{t("settings.logoType")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.logoType}
                onValueChange={(value) => settings.setLogoType(value as any)}
                className="grid grid-cols-2 gap-4"
              >
                {logoTypes.map((type) => (
                  <div key={type.value}>
                    <RadioGroupItem value={type.value} id={`logo-type-${type.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`logo-type-${type.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-2 rounded-md border p-2 w-full h-12 flex items-center justify-center">
                        <Logo size="sm" />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">{type.description}</p>
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
                <span>{t("settings.fontSize")}</span>
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
                <span>{t("settings.borderRadius")}</span>
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
                <span>{t("settings.layoutTemplates")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <span>{t("settings.sidebarPosition")}</span>
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
                    <span className="text-sm">{t("sidebar.right")}</span>
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
                    <span className="text-sm">{t("sidebar.left")}</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t("settings.languageSettings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>{t("settings.selectLanguage")}</Label>
                <RadioGroup value={language} onValueChange={(value) => setLanguage(value as any)} className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <RadioGroupItem value="ar" id="lang-ar" />
                    <Label htmlFor="lang-ar" className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                      <span className="text-2xl">🇸🇦</span>
                      <div>
                        <p className="font-medium">العربية</p>
                        <p className="text-sm text-muted-foreground">Arabic - اللغة العربية</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <RadioGroupItem value="en" id="lang-en" />
                    <Label htmlFor="lang-en" className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <p className="font-medium">English</p>
                        <p className="text-sm text-muted-foreground">English - الإنجليزية</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>{language === "ar" ? "معلومات اللغة المحددة" : "Selected Language Information"}</Label>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">{t("settings.currentLanguage")}:</p>
                      <p>{language === "ar" ? "العربية" : "English"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">{t("settings.textDirection")}:</p>
                      <p>{language === "ar" ? "من اليمين إلى اليسار (RTL)" : "Left to Right (LTR)"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">{t("settings.fontUsed")}:</p>
                      <p>{language === "ar" ? "Cairo" : "Inter"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">{t("settings.sidebarPos")}:</p>
                      <p>
                        {settings.sidebarPosition === "right"
                          ? language === "ar"
                            ? "يمين"
                            : "Right"
                          : language === "ar"
                            ? "يسار"
                            : "Left"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                <span>{t("settings.animationLevel")}</span>
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
                <span>{t("settings.resetSettings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground">{t("settings.resetDescription")}</p>
                <Button variant="destructive" className="w-full sm:w-auto" onClick={settings.resetSettings}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t("settings.resetAll")}
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
              {t("settings.settingsSaved")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("settings.saveSettings")}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
