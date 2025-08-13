# Next.js Admin Dashboard Template

A production-ready dashboard built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. The template implements the MVVM (Model–View–ViewModel) pattern, ships with a pluggable service layer, and includes a complete set of components with multi-language (Arabic/English) support, dynamic themes, and many layout options.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Directory Reference](#directory-reference)
5. [Architecture](#architecture)
6. [Environment & Configuration](#environment--configuration)
7. [Adding New Pages](#adding-new-pages)
8. [Scripts](#scripts)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

## Features

- **MVVM** separation: pages render views, hooks act as view models, and services handle data access
- **Dependency-injected service layer** with centralized API client and notification system
- **Rich component library** built on Radix UI & shadcn style, including generic table, tree view, charts, dialogs, toasts, forms, and more
- **Settings provider** for runtime customization of colors, layouts, typography, spacing, and UI polish
- **Dark/light themes** with system preference detection
- **Full i18n** for Arabic (RTL) and English (LTR) with automatic direction switching
- **Example modules**: categories, civilians, sites, profile, settings, login, etc.

## Tech Stack

- **Next.js 14** App Router & React Server Components
- **TypeScript** with strict mode
- **Tailwind CSS** with custom design tokens
- **Radix UI** primitives & shadcn/ui design system
- **React Hook Form** + **Zod** validation
- **i18next** for translations
- **Recharts**, **sonner**, and other modern utilities

## Getting Started

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn

### Installation
```bash
git clone <repo-url>
cd Next-Frontend-Template
npm install
```

### Development
```bash
npm run dev
# open http://localhost:3000
```

### Production build
```bash
npm run build
npm start
```

## Directory Reference

```text
app/                    Route segments and shared layout (App Router)
  login/                Authentication pages
  categories/           Example CRUD module
  civilians/            Example CRUD module
  sites/                Example CRUD module
  profile/              User profile
  settings/             UI settings playground
components/             Reusable view pieces
  app_views/            Page-specific composite views (home, login, profile, settings)
  layout/               Headers, sidebars, and multiple layout templates (classic, modern, floating, elegant, navigation, ...)
  ui/                   Base UI primitives (buttons, inputs, dialogs, tables, charts, toasts, tree views, breadcrumbs, ...)
  forms/                Generic form wrapper around React Hook Form
  examples/             Example components such as products-example
config/                 Global configuration (navigation, API endpoints, logo)
docs/                   Additional documentation (logo system, enhanced delete toast)
hooks/                  Custom hooks / view models
  use-login-viewmodel   Handles login state and form logic
  use-crud-view-model   Reusable CRUD state management
  use-generic-crud-viewmodel  Higher level CRUD hook for tables/forms
  use-enhanced-delete   Confirmation + toast helper
  use-enhanced-toast    Styled toast helper
  use-tree-view-model   Tree view state management
  use-toast             Toast helper used by UI components
  use-mobile            Media query helper for responsive design
lib/                    Utility helpers (pagination, dropdown positioning, classnames)
locales/                Translation dictionaries for `en` and `ar`
providers/              React context providers
  auth-provider         Authentication state and route guards
  service-provider      Dependency injection for services
  i18n-provider         Translation + direction context
  theme-provider        Dark/light theme switching
  settings-provider     Runtime UI customization (colors, layouts, spacing, logo, etc.)
public/                 Static assets (fonts, images)
services/               Business logic and API calls
  api.service           HTTP client (uses `NEXT_PUBLIC_API_URL`)
  auth.service          Login/refresh/logout helpers
  site.service          Site CRUD operations
  category.service      Category CRUD operations
  civilian.service      Civilian CRUD operations
  notification.service  Toast/sonner integration for feedback
styles/                 Global style sheets
tailwind.config.js      Tailwind theme configuration
views/                  MVVM view components consumed by routes
```

## Architecture

### MVVM
- **Views** (`views/`) render UI and receive data via props
- **ViewModels** (`hooks/`) encapsulate state and business rules and call services
- **Services** (`services/`) interact with APIs and trigger notifications

### Service Layer & Dependency Injection
- `ApiService` centralizes HTTP requests and reads the base URL from `NEXT_PUBLIC_API_URL`
- `ServiceProvider` instantiates services once and exposes them via React context
- Domain services (site, category, civilian, auth) use the shared `ApiService`

### Providers
- `ThemeProvider` integrates `next-themes` for dark/light modes
- `I18nProvider` manages translations, direction (RTL/LTR), and language persistence
- `SettingsProvider` exposes dozens of UI settings (color theme, layout template, spacing, icons, toast style, etc.) allowing live customization
- `AuthProvider` supplies authentication state and guards protected routes
- `ServiceProvider` injects service instances throughout the component tree

### Components
- `components/ui` includes dozens of primitives (buttons, inputs, dialogs, sheets, modals, breadcrumbs, pagination, generic table/tree view, chart wrappers, toast utilities, etc.) built from Radix UI + Tailwind
- `components/layout` provides ready-made layout shells (classic, modern, compact, floating, elegant, navigation) composed of headers, sidebars, navigation panels, and footers
- `components/forms/generic-form` streamlines building forms with React Hook Form and Zod
- `components/app_views` groups larger presentation blocks used in routes

## Environment & Configuration

Create a `.env.local` file in the project root:
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
Other variables exposed to the client must be prefixed with `NEXT_PUBLIC_`.

Useful configuration files:
- `config/navigation.ts` – defines sidebar and navigation items
- `config/api-endpoints.ts` – centralizes API endpoint strings
- `config/logo.ts` – controls dynamic logo rendering
- `components.json` – shadcn/ui component configuration

## Adding New Pages
1. Create a view component under `views/` (e.g., `reports-view.tsx`)
2. Create a route in `app/reports/page.tsx` that renders the view inside `DashboardLayout`
3. Implement a hook in `hooks/` for the view model and any domain services under `services/`
4. Add navigation entry in `config/navigation.ts` and translations in `locales/`

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint (requires local configuration) |

## Deployment
1. Set environment variables for production (e.g., `NEXT_PUBLIC_API_URL`)
2. Run `npm run build`
3. Start the server with `npm start` or deploy the `.next/` output to platforms like Vercel or Docker

## Contributing
Contributions are welcome! Fork the repository and submit a pull request describing your changes.

## License
This template is provided as-is for educational and commercial use.

---
**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
