import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { I18nProvider } from "@/providers/i18n-provider"
import { ServiceProvider } from "@/providers/service-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import { NavigationProvider } from "@/providers/navigation-provider";
import { RouteGuard } from "@/components/auth/route-guard";
import { EnhancedToaster } from "@/components/ui/enhanced-toaster";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Contract Management System",
  description: "Professional contract management system with multi-language support",
  keywords: ["contract management", "government", "administration", "system"],
  authors: [{ name: "Contract Management Team" }],
  creator: "Contract Management System",
  publisher: "Government Administration",
  icons: {
    icon: [
      { url: "/app-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/app-logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/app-logo.png",
    apple: "/app-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Contract Management System",
    description: "Professional contract management system with multi-language support",
    url: "https://contract-management.gov",
    siteName: "Contract Management System",
    images: [
      {
        url: "/app-logo.png",
        width: 512,
        height: 512,
        alt: "Contract Management System Logo",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contract Management System",
    description: "Professional contract management system with multi-language support",
    images: ["/app-logo.png"],
  },
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
