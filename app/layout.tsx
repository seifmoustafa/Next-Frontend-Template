import type React from "react"
import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/providers/i18n-provider"
import { ServiceProvider } from "@/providers/service-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { SettingsProvider } from "@/providers/settings-provider"
import { ar } from "@/locales/ar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: ar["app.title"],
  description: ar["app.description"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} antialiased font-arabic`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <SettingsProvider>
            <I18nProvider>
              <ServiceProvider>
                <AuthProvider>{children}</AuthProvider>
              </ServiceProvider>
            </I18nProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
