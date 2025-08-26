import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { I18nProvider } from "@/providers/i18n-provider"
import { ServiceProvider } from "@/providers/service-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { RouteGuard } from "@/components/auth/route-guard";
import { EnhancedToaster } from "@/components/ui/enhanced-toaster";
import { NavigationProvider } from "@/providers/navigation-provider"

export const metadata: Metadata = {
  title: "لوحة التحكم الإدارية",
  description: "لوحة تحكم إدارية احترافية مع دعم متعدد اللغات",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <ServiceProvider>
            <SettingsProvider>
              <I18nProvider>
                <AuthProvider>
                  <NavigationProvider>
                    <RouteGuard>
                      {children}
                    </RouteGuard>
                  </NavigationProvider>
                </AuthProvider>
              </I18nProvider>
            </SettingsProvider>
          </ServiceProvider>
          <EnhancedToaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
