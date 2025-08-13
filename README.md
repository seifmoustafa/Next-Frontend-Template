# Next.js Admin Dashboard Template

A production-ready admin dashboard built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**. The template follows an MVVM (Model–View–ViewModel) architecture, includes a service layer for API access, and ships with a multi-language system (Arabic/English) plus full dark/light theming.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Core Concepts](#core-concepts)
5. [Available Scripts](#available-scripts)
6. [Environment Variables](#environment-variables)
7. [Customization](#customization)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

## Features

### Application

- **Multi-language support** (English and Arabic) with RTL/LTR layouts
- **MVVM architecture** for clear separation of concerns
- **Service layer** with dependency injection and centralized API handling
- **Fully responsive** design with dark/light themes
- **Professional UI/UX** with modern component library (Radix UI, shadcn style)

### Technical

- Next.js 14 App Router with Server Components
- TypeScript with strict type checking
- Tailwind CSS with custom design tokens
- Radix UI primitives and shadcn/ui components
- React Hook Form, Zod, and i18next integrations

## Getting Started

### Prerequisites

- **Node.js 18+**
- **npm**, **pnpm**, or **yarn** package manager

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

## Project Structure

```
app/              # Next.js app router pages and layouts
  ├─ login/       # Auth pages
  ├─ dashboard/   # Dashboard area
  └─ ...          # Additional routes
components/
  ├─ forms/       # Form elements built on React Hook Form
  ├─ layout/      # Navigation, sidebar, header, etc.
  ├─ ui/          # Generic UI primitives (buttons, dialogs, etc.)
  └─ app_views/   # View-specific composite components
config/           # App-wide configuration files
docs/             # Additional documentation and design notes
hooks/            # Custom React hooks
lib/              # Utilities and helpers
locales/          # Translation files (EN/AR)
providers/        # Context and i18n providers
public/           # Static assets (fonts, images)
services/         # Business logic and API services
styles/           # Global style sheets
views/            # Page-level view components following MVVM
```

## Core Concepts

### MVVM

Views render UI, ViewModels manage state/business logic, and Services handle data access. Components interact only with their ViewModels, keeping UI decoupled from backend details.

### Service Layer

The `services/` directory defines classes that wrap API calls and encapsulate side effects (e.g., notifications). An `ApiService` instance is injected into services to provide HTTP access.

### Internationalization

Translations live in `locales/`. `providers/i18n-provider.tsx` configures i18next and exposes hooks for switching languages. RTL/LTR layout is handled automatically.

### Theming

`next-themes` powers dark/light mode with system preference detection. Theme tokens are defined in `app/globals.css` and extended via Tailwind configuration.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint (requires local configuration) |

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Add any additional variables prefixed with `NEXT_PUBLIC_` for client-side access.

## Customization

- **Theme**: adjust CSS variables in `app/globals.css` and modify `tailwind.config.js`
- **Components**: components in `components/` are generic and can be extended or themed easily
- **Language**: add new translation files under `locales/` and update the i18n provider

## Deployment

1. Set environment variables for production (e.g., `NEXT_PUBLIC_API_URL`)
2. Run `npm run build`
3. Start the server with `npm start`

The output in `.next/` can also be deployed to platforms like Vercel or Docker containers.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with clear description of your changes.

## License

This template is provided as-is for educational and commercial use.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

