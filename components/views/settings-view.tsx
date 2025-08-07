'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/providers/settings-provider'
import { Logo } from '@/components/ui/logo'
import { Palette, Layout, SettingsIcon, Globe, Zap, Image, Download, Upload, RotateCcw, Eye, EyeOff, Sparkles, Shield, Type, Check, Home, Users, BarChart3, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function SettingsView() {
const settings = useSettings()
const { toast } = useToast()
const [activeTab, setActiveTab] = useState('appearance')

const handleExportSettings = () => {
  const settingsJson = settings.exportSettings()
  const blob = new Blob([settingsJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'app-settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast({
    title: 'Settings Exported',
    description: 'Your settings have been exported successfully.',
  })
}

const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settingsJson = e.target?.result as string
        const success = settings.importSettings(settingsJson)
        if (success) {
          toast({
            title: 'Settings Imported',
            description: 'Your settings have been imported successfully.',
          })
        } else {
          throw new Error('Invalid format')
        }
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Failed to import settings. Please check the file format.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
  }
}

const handleResetSettings = () => {
  settings.resetSettings()
  toast({
    title: 'Settings Reset',
    description: 'All settings have been reset to default values.',
  })
}

// Color theme options with visual previews
const colorThemes = [
  { value: 'purple', name: 'Purple', color: 'bg-purple-500', accent: 'bg-purple-100' },
  { value: 'blue', name: 'Blue', color: 'bg-blue-500', accent: 'bg-blue-100' },
  { value: 'green', name: 'Green', color: 'bg-green-500', accent: 'bg-green-100' },
  { value: 'orange', name: 'Orange', color: 'bg-orange-500', accent: 'bg-orange-100' },
  { value: 'red', name: 'Red', color: 'bg-red-500', accent: 'bg-red-100' },
  { value: 'teal', name: 'Teal', color: 'bg-teal-500', accent: 'bg-teal-100' },
  { value: 'pink', name: 'Pink', color: 'bg-pink-500', accent: 'bg-pink-100' },
  { value: 'indigo', name: 'Indigo', color: 'bg-indigo-500', accent: 'bg-indigo-100' },
  { value: 'cyan', name: 'Cyan', color: 'bg-cyan-500', accent: 'bg-cyan-100' },
]

// Layout template options with mini previews
const layoutTemplates = [
  { 
    value: 'modern', 
    name: 'Modern', 
    description: 'Clean and contemporary',
    preview: (
      <div className="w-full h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded flex">
        <div className="w-12 bg-gray-300 rounded-l"></div>
        <div className="flex-1 p-2">
          <div className="h-2 bg-gray-400 rounded mb-1"></div>
          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    )
  },
  { 
    value: 'classic', 
    name: 'Classic', 
    description: 'Traditional layout',
    preview: (
      <div className="w-full h-16 bg-white border rounded flex">
        <div className="w-12 bg-gray-100 border-r"></div>
        <div className="flex-1 p-2">
          <div className="h-2 bg-gray-600 rounded mb-1"></div>
          <div className="h-2 bg-gray-400 rounded w-2/3"></div>
        </div>
      </div>
    )
  },
  { 
    value: 'compact', 
    name: 'Compact', 
    description: 'Space-efficient',
    preview: (
      <div className="w-full h-16 bg-gray-50 rounded flex">
        <div className="w-8 bg-gray-200"></div>
        <div className="flex-1 p-1">
          <div className="h-1.5 bg-gray-500 rounded mb-1"></div>
          <div className="h-1.5 bg-gray-400 rounded w-3/4 mb-1"></div>
          <div className="h-1.5 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  },
  { 
    value: 'elegant', 
    name: 'Elegant', 
    description: 'Sophisticated design',
    preview: (
      <div className="w-full h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded shadow-sm flex">
        <div className="w-12 bg-gradient-to-b from-gray-200 to-gray-300 rounded-l"></div>
        <div className="flex-1 p-2">
          <div className="h-2 bg-gradient-to-r from-gray-500 to-gray-400 rounded mb-1"></div>
          <div className="h-2 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    )
  },
  { 
    value: 'minimal', 
    name: 'Minimal', 
    description: 'Clean and simple',
    preview: (
      <div className="w-full h-16 bg-white rounded border-l-2 border-gray-300 flex">
        <div className="w-10 bg-gray-50"></div>
        <div className="flex-1 p-2">
          <div className="h-2 bg-gray-800 rounded mb-2"></div>
          <div className="h-1 bg-gray-400 rounded w-1/2"></div>
        </div>
      </div>
    )
  },
  { 
    value: 'floating', 
    name: 'Floating', 
    description: 'Cards and overlays',
    preview: (
      <div className="w-full h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded relative">
        <div className="absolute top-1 left-1 w-8 h-6 bg-white rounded shadow"></div>
        <div className="absolute top-2 right-2 w-16 h-4 bg-white rounded shadow"></div>
        <div className="absolute bottom-1 left-2 w-12 h-4 bg-white rounded shadow"></div>
      </div>
    )
  },
  { 
    value: 'navigation', 
    name: 'Navigation', 
    description: 'Dual sidebar system',
    preview: (
      <div className="w-full h-16 bg-gray-100 rounded flex">
        <div className="w-6 bg-gray-300"></div>
        <div className="w-8 bg-gray-200"></div>
        <div className="flex-1 p-2">
          <div className="h-2 bg-gray-500 rounded mb-1"></div>
          <div className="h-2 bg-gray-400 rounded w-2/3"></div>
        </div>
      </div>
    )
  },
]

// Font size options with visual examples
const fontSizes = [
  { value: 'small', name: 'Small', example: 'text-sm', description: '14px base size' },
  { value: 'default', name: 'Default', example: 'text-base', description: '16px base size' },
  { value: 'large', name: 'Large', example: 'text-lg', description: '18px base size' },
]

// Border radius options with visual examples
const borderRadiusOptions = [
  { value: 'none', name: 'None', class: 'rounded-none' },
  { value: 'small', name: 'Small', class: 'rounded-sm' },
  { value: 'default', name: 'Default', class: 'rounded' },
  { value: 'large', name: 'Large', class: 'rounded-lg' },
  { value: 'full', name: 'Full', class: 'rounded-full' },
]

// Spacing options with visual examples
const spacingOptions = [
  { value: 'compact', name: 'Compact', spacing: 'p-2 gap-1' },
  { value: 'default', name: 'Default', spacing: 'p-4 gap-2' },
  { value: 'comfortable', name: 'Comfortable', spacing: 'p-6 gap-3' },
  { value: 'spacious', name: 'Spacious', spacing: 'p-8 gap-4' },
]

// Shadow intensity options
const shadowOptions = [
  { value: 'none', name: 'None', class: 'shadow-none' },
  { value: 'subtle', name: 'Subtle', class: 'shadow-sm' },
  { value: 'moderate', name: 'Moderate', class: 'shadow-md' },
  { value: 'strong', name: 'Strong', class: 'shadow-lg' },
]

// Animation level options
const animationOptions = [
  { value: 'none', name: 'None', description: 'No animations' },
  { value: 'minimal', name: 'Minimal', description: 'Basic transitions' },
  { value: 'moderate', name: 'Moderate', description: 'Smooth animations' },
  { value: 'high', name: 'High', description: 'Rich animations' },
]

// Card style options
const cardStyles = [
  { value: 'default', name: 'Default', class: 'border bg-card' },
  { value: 'glass', name: 'Glass', class: 'bg-white/10 backdrop-blur border border-white/20' },
  { value: 'solid', name: 'Solid', class: 'bg-gray-100 border-0' },
  { value: 'bordered', name: 'Bordered', class: 'border-2 bg-card' },
  { value: 'elevated', name: 'Elevated', class: 'shadow-lg bg-card border-0' },
]

// Logo type options
const logoTypes = [
  { value: 'sparkles', name: 'Sparkles', icon: Sparkles },
  { value: 'shield', name: 'Shield', icon: Shield },
  { value: 'image', name: 'Custom Image', icon: Image },
  { value: 'custom', name: 'Custom Text', icon: Type },
]

// Logo size options
const logoSizes = [
  { value: 'xs', name: 'XS', size: 'h-4 w-4' },
  { value: 'sm', name: 'SM', size: 'h-5 w-5' },
  { value: 'md', name: 'MD', size: 'h-6 w-6' },
  { value: 'lg', name: 'LG', size: 'h-8 w-8' },
  { value: 'xl', name: 'XL', size: 'h-10 w-10' },
]

return (
  <div className="container mx-auto p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your application experience</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleExportSettings}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" asChild>
          <label htmlFor="import-settings" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </label>
        </Button>
        <input
          id="import-settings"
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImportSettings}
        />
        <Button variant="destructive" onClick={handleResetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </div>
    </div>

    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="appearance">
          <Palette className="h-4 w-4 mr-2" />
          Appearance
        </TabsTrigger>
        <TabsTrigger value="logo">
          <Image className="h-4 w-4 mr-2" />
          Logo
        </TabsTrigger>
        <TabsTrigger value="layout">
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </TabsTrigger>
        <TabsTrigger value="components">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Components
        </TabsTrigger>
        <TabsTrigger value="visibility">
          <Eye className="h-4 w-4 mr-2" />
          Visibility
        </TabsTrigger>
        <TabsTrigger value="accessibility">
          <Globe className="h-4 w-4 mr-2" />
          Accessibility
        </TabsTrigger>
        <TabsTrigger value="advanced">
          <Zap className="h-4 w-4 mr-2" />
          Advanced
        </TabsTrigger>
      </TabsList>

      {/* Appearance Tab */}
      <TabsContent value="appearance" className="space-y-6">
        {/* Color Themes */}
        <Card>
          <CardHeader>
            <CardTitle>Color Theme</CardTitle>
            <CardDescription>Choose your preferred color scheme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
              {colorThemes.map((theme) => (
                <div
                  key={theme.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:scale-105",
                    settings.colorTheme === theme.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setColorTheme(theme.value as any)}
                >
                  <div className="space-y-2">
                    <div className={cn("h-8 w-full rounded", theme.color)}></div>
                    <div className={cn("h-2 w-full rounded", theme.accent)}></div>
                  </div>
                  <p className="mt-2 text-xs font-medium text-center">{theme.name}</p>
                  {settings.colorTheme === theme.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Font Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Font Size</CardTitle>
            <CardDescription>Adjust the base font size for better readability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontSizes.map((size) => (
                <div
                  key={size.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.fontSize === size.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setFontSize(size.value as any)}
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold">{size.name}</h4>
                    <p className={cn("text-muted-foreground", size.example)}>
                      Sample text in {size.name.toLowerCase()} size
                    </p>
                    <p className="text-xs text-muted-foreground">{size.description}</p>
                  </div>
                  {settings.fontSize === size.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <CardTitle>Border Radius</CardTitle>
            <CardDescription>Choose how rounded corners should appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {borderRadiusOptions.map((radius) => (
                <div
                  key={radius.value}
                  className={cn(
                    "relative cursor-pointer border-2 p-4 transition-all hover:scale-105",
                    radius.class,
                    settings.borderRadius === radius.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setBorderRadius(radius.value as any)}
                >
                  <div className={cn("h-8 bg-muted", radius.class)}></div>
                  <p className="mt-2 text-sm font-medium text-center">{radius.name}</p>
                  {settings.borderRadius === radius.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing</CardTitle>
            <CardDescription>Control the spacing between elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {spacingOptions.map((spacing) => (
                <div
                  key={spacing.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 transition-all hover:scale-105",
                    spacing.spacing,
                    settings.spacingSize === spacing.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setSpacingSize(spacing.value as any)}
                >
                  <div className="bg-muted rounded h-4"></div>
                  <div className="bg-muted rounded h-4"></div>
                  <p className="text-sm font-medium text-center">{spacing.name}</p>
                  {settings.spacingSize === spacing.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shadow Intensity */}
        <Card>
          <CardHeader>
            <CardTitle>Shadow Intensity</CardTitle>
            <CardDescription>Adjust the depth and intensity of shadows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {shadowOptions.map((shadow) => (
                <div
                  key={shadow.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.shadowIntensity === shadow.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setShadowIntensity(shadow.value as any)}
                >
                  <div className={cn("h-12 bg-card rounded-lg", shadow.class)}></div>
                  <p className="mt-2 text-sm font-medium text-center">{shadow.name}</p>
                  {settings.shadowIntensity === shadow.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Animation Level */}
        <Card>
          <CardHeader>
            <CardTitle>Animation Level</CardTitle>
            <CardDescription>Control the amount of animations and transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {animationOptions.map((animation) => (
                <div
                  key={animation.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.animationLevel === animation.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setAnimationLevel(animation.value as any)}
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold">{animation.name}</h4>
                    <p className="text-sm text-muted-foreground">{animation.description}</p>
                    <div className={cn(
                      "h-2 bg-primary rounded",
                      animation.value === 'high' && "animate-pulse",
                      animation.value === 'moderate' && "transition-all duration-300",
                    )}></div>
                  </div>
                  {settings.animationLevel === animation.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Logo Tab */}
      <TabsContent value="logo" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
            <CardDescription>See how your logo will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Logo />
                </div>
                <Badge variant="secondary">Live Preview</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Type */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Type</CardTitle>
            <CardDescription>Choose the type of logo to display</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {logoTypes.map((type) => (
                <div
                  key={type.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.logoType === type.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setLogoType(type.value as any)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <type.icon className="h-8 w-8" />
                    <p className="text-sm font-medium">{type.name}</p>
                  </div>
                  {settings.logoType === type.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo Size */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Size</CardTitle>
            <CardDescription>Adjust the size of your logo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {logoSizes.map((size) => (
                <div
                  key={size.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.logoSize === size.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setLogoSize(size.value as any)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Sparkles className={size.size} />
                    <p className="text-sm font-medium">{size.name}</p>
                  </div>
                  {settings.logoSize === size.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logo Text */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Text</CardTitle>
            <CardDescription>Customize the text that appears with your logo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo-text">Logo Text</Label>
                <Input
                  id="logo-text"
                  value={settings.logoText}
                  onChange={(e) => settings.setLogoText(e.target.value)}
                  placeholder="Enter your logo text"
                />
              </div>
              {settings.logoType === 'image' && (
                <div className="space-y-2">
                  <Label htmlFor="logo-image">Image Path</Label>
                  <Input
                    id="logo-image"
                    value={settings.logoImagePath}
                    onChange={(e) => settings.setLogoImagePath(e.target.value)}
                    placeholder="/path/to/your/logo.png"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Layout Tab */}
      <TabsContent value="layout" className="space-y-6">
        {/* Layout Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Layout Template</CardTitle>
            <CardDescription>Choose your preferred layout style</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layoutTemplates.map((template) => (
                <div
                  key={template.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.layoutTemplate === template.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setLayoutTemplate(template.value as any)}
                >
                  <div className="space-y-3">
                    {template.preview}
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  {settings.layoutTemplate === template.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card Styles */}
        <Card>
          <CardHeader>
            <CardTitle>Card Style</CardTitle>
            <CardDescription>Choose how cards should appear throughout the app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {cardStyles.map((style) => (
                <div
                  key={style.value}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:scale-105",
                    settings.cardStyle === style.value
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-muted-foreground/50"
                  )}
                  onClick={() => settings.setCardStyle(style.value as any)}
                >
                  <div className="space-y-3">
                    <div className={cn("h-12 rounded p-2", style.class)}>
                      <div className="h-2 bg-current opacity-20 rounded mb-1"></div>
                      <div className="h-2 bg-current opacity-20 rounded w-2/3"></div>
                    </div>
                    <p className="text-sm font-medium text-center">{style.name}</p>
                  </div>
                  {settings.cardStyle === style.value && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Layout Options */}
        <Card>
          <CardHeader>
            <CardTitle>Layout Options</CardTitle>
            <CardDescription>Additional layout configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebar-position">Sidebar Position</Label>
                    <p className="text-sm text-muted-foreground">Choose left or right sidebar</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={settings.sidebarPosition === 'left' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => settings.setSidebarPosition('left')}
                    >
                      Left
                    </Button>
                    <Button
                      variant={settings.sidebarPosition === 'right' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => settings.setSidebarPosition('right')}
                    >
                      Right
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="collapsible-sidebar"
                    checked={settings.collapsibleSidebar}
                    onCheckedChange={settings.setCollapsibleSidebar}
                  />
                  <Label htmlFor="collapsible-sidebar">Collapsible Sidebar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sticky-header"
                    checked={settings.stickyHeader}
                    onCheckedChange={settings.setStickyHeader}
                  />
                  <Label htmlFor="sticky-header">Sticky Header</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="compact-mode"
                    checked={settings.compactMode}
                    onCheckedChange={settings.setCompactMode}
                  />
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Components Tab */}
      <TabsContent value="components" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Styles</CardTitle>
            <CardDescription>Customize the appearance of individual components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header Style */}
            <div className="space-y-3">
              <Label>Header Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['default', 'compact', 'elevated', 'transparent'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.headerStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => settings.setHeaderStyle(style as any)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Button Style */}
            <div className="space-y-3">
              <Label>Button Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['default', 'rounded', 'sharp', 'modern'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.buttonStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => settings.setButtonStyle(style as any)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation Style */}
            <div className="space-y-3">
              <Label>Navigation Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['default', 'pills', 'underline', 'sidebar'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.navigationStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => settings.setNavigationStyle(style as any)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sidebar Style */}
            <div className="space-y-3">
              <Label>Sidebar Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['default', 'compact', 'floating', 'minimal'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.sidebarStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => settings.setSidebarStyle(style as any)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            {/* Icon Style */}
            <div className="space-y-3">
              <Label>Icon Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['outline', 'filled', 'duotone', 'minimal'].map((style) => (
                  <Button
                    key={style}
                    variant={settings.iconStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => settings.setIconStyle(style as any)}
                    className="capitalize"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Visibility Tab */}
      <TabsContent value="visibility" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Visibility</CardTitle>
            <CardDescription>Show or hide various UI components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-breadcrumbs"
                    checked={settings.showBreadcrumbs}
                    onCheckedChange={settings.setShowBreadcrumbs}
                  />
                  <Label htmlFor="show-breadcrumbs">Show Breadcrumbs</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-user-avatar"
                    checked={settings.showUserAvatar}
                    onCheckedChange={settings.setShowUserAvatar}
                  />
                  <Label htmlFor="show-user-avatar">Show User Avatar</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-notifications"
                    checked={settings.showNotifications}
                    onCheckedChange={settings.setShowNotifications}
                  />
                  <Label htmlFor="show-notifications">Show Notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-footer"
                    checked={settings.showFooter}
                    onCheckedChange={settings.setShowFooter}
                  />
                  <Label htmlFor="show-footer">Show Footer</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Accessibility Tab */}
      <TabsContent value="accessibility" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Accessibility & Motion</CardTitle>
            <CardDescription>Configure accessibility preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={settings.setHighContrast}
                />
                <Label htmlFor="high-contrast">High Contrast Mode</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={settings.setReducedMotion}
                />
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Advanced Tab */}
      <TabsContent value="advanced" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Advanced configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Background Themes */}
              <div className="space-y-4">
                <div>
                  <Label>Light Background Theme</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                    {['default', 'warm', 'cool', 'neutral', 'soft', 'cream', 'mint', 'lavender', 'rose'].map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.lightBackgroundTheme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => settings.setLightBackgroundTheme(theme as any)}
                        className="capitalize text-xs"
                      >
                        {theme}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Dark Background Theme</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                    {['default', 'darker', 'pitch', 'slate', 'warm-dark', 'forest', 'ocean', 'purple-dark', 'crimson'].map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.darkBackgroundTheme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => settings.setDarkBackgroundTheme(theme as any)}
                        className="capitalize text-xs"
                      >
                        {theme.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-save"
                  checked={settings.autoSave}
                  onCheckedChange={settings.setAutoSave}
                />
                <Label htmlFor="auto-save">Auto-save Settings</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
)
}
