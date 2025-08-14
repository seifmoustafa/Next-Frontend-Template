# Professional Admin Dashboard Template

A production-ready Next.js 14 starter for building data-rich admin panels.
The template ships with full TypeScript support, MVVM architecture, a service
layer with dependency injection, dark/light theming and complete RTL support.
It includes a large collection of generic and application-specific components so
you can focus on business features rather than boilerplate.

## Table of Contents
1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Scripts](#-scripts)
5. [Architecture](#-architecture)
6. [Project Structure](#-project-structure)
7. [Configuration](#-configuration)
8. [Internationalization](#-internationalization)
9. [Theming](#-theming)
10. [Services & Data Flow](#-services--data-flow)
11. [Custom Hooks](#-custom-hooks)
12. [Security](#-security)
13. [Responsive & RTL Design](#-responsive--rtl-design)
14. [Deployment](#-deployment)
15. [Contributing](#-contributing)
16. [License](#-license)

## 🚀 Features

### Core
- **Multi-language support** with automatic direction (LTR/RTL) switching
- **MVVM architecture** that cleanly separates views, view models and services
- **Dependency injection** for replacing services during testing or scaling
- **Responsive design** with a mobile-first layout and adaptive navigation
- **Dark/Light theme** with system preference detection and persistence
- **Professional UI/UX** using shadcn/ui and custom Tailwind utilities

### Technical
- **Next.js 14 App Router** with server and client components
- **TypeScript** for end-to-end type safety
- **Tailwind CSS** design system with CSS variables
- **Generic components** (tables, forms, dialogs, charts, etc.)
- **Service layer** that centralizes API access and error handling
- **Custom hooks** to manage common stateful logic

## 🧰 Tech Stack

| Category | Tool |
|----------|------|
| Framework | [Next.js 14](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/) |
| Forms & Validation | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Internationalization | [i18next](https://www.i18next.com/) |

## 🛠️ Getting Started

### Prerequisites
- Node.js **18+**
- `npm`, `pnpm`, or `yarn` (examples use `npm`)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/Next-Frontend-Template.git
   cd Next-Frontend-Template
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create environment file**
   ```bash
   cp .env.example .env.local   # if provided
   # otherwise create .env.local manually:
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```
5. **Open the dashboard**
   Visit `http://localhost:3000` in your browser.

## 📜 Scripts
- `npm run dev` – start development server
- `npm run build` – create production build
- `npm start` – run production server
- `npm run lint` – run ESLint checks

## 🏗️ Architecture

### MVVM Pattern
The template embraces the Model-View-ViewModel pattern. Views (React components)
remain dumb and delegate data fetching and business logic to ViewModels which in
turn rely on Services.

```
┌────────────┐    ┌──────────────┐    ┌──────────────┐
│   View     │↔── │  ViewModel   │↔── │   Service     │
│(React UI)  │    │(Business     │    │(API / Models)│
└────────────┘    └──────────────┘    └──────────────┘
```

### Service Layer
Services abstract HTTP calls, authentication and notifications. Swapping or
mocking services is straightforward due to the dependency-injection pattern.

```
Components → ViewModels → Services → ApiService → Backend
```

Context providers (auth, settings, i18n, theme and service) live in
`/providers` and wrap the app in `app/layout.tsx`.

## 📁 Project Structure

```
├── app/               # Next.js App Router routes and root layout
├── components/        # Reusable UI, form and layout components
│   ├── ui/            # Generic shadcn/ui components
│   ├── forms/         # Form elements and validations
│   ├── layout/        # App shell pieces (navbar, sidebar, ...)
│   └── app_views/     # View components used by pages
├── config/            # Centralised configuration (API, navigation, logos)
├── hooks/             # Reusable React hooks (CRUD, toast, mobile, ...)
├── lib/               # Utility functions
├── locales/           # i18next translation files
├── providers/         # Context providers (auth, i18n, theme, settings)
├── services/          # Business logic & API interaction
├── views/             # High-level view components
├── public/            # Static assets
├── styles/            # Global CSS files
└── docs/              # Additional documentation
```

## ⚙️ Configuration
- **Environment variables**: stored in `.env.local`.
- **API endpoints**: `config/api-endpoints.ts`.
- **Navigation menus**: `config/navigation.ts`.
- **Logo and branding**: `config/logo.ts` with light/dark variants.
- **Shadcn UI**: settings in `components.json`.

## 🌍 Internationalization
Translations live in `locales/en.ts` and `locales/ar.ts`.
`i18n-provider.tsx` detects the preferred language and exposes a translation
function. To add a new language:
1. Create `locales/<code>.ts` with translations.
2. Register it in `providers/i18n-provider.tsx`.
3. Add it to the language switcher component.

## 🎨 Theming
`theme-provider.tsx` handles light/dark modes and persists the choice. Design
tokens are defined as CSS variables in `app/globals.css`; override them to
adjust the color palette. Extend Tailwind utilities in `tailwind.config.js`.

### Component Customization
All generic components accept props for complete control. Example of the
`GenericTable` component:

```tsx
<GenericTable
  data={users}
  columns=[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: value => <StatusBadge status={value} />
    }
  ]
  actions=[
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: handleDelete, variant: 'destructive' }
  ]
/>
```

## 🔌 Services & Data Flow
`ApiService` wraps `fetch` and handles base URL and errors. Domain services
(e.g., `UserService`, `SiteService`) depend on it. ViewModels consume those
services and expose React hooks for components.

```ts
// services/user.service.ts
export class UserService {
  constructor(private api: IApiService) {}
  getUsers() {
    return this.api.get<User[]>('/users');
  }
}
```

```ts
// hooks/use-crud-view-model.ts
export function useUsers() {
  const vm = new UsersViewModel(userService);
  return vm.useState();
}
```

## 🪝 Custom Hooks
Reusable hooks live in `/hooks` and encapsulate common logic:
- `use-crud-view-model` – generic CRUD operations for entities
- `use-login-viewmodel` – authentication flow
- `use-enhanced-toast` & `use-toast` – notification system
- `use-enhanced-delete` – confirmation dialogs for destructive actions
- `use-tree-view-model` – tree and hierarchical data handling
- `use-mobile` – responsive helpers for mobile detection

## 🔒 Security
- Token-based authentication scaffolding
- Role based access guards in services and components
- Form validation via Zod and React Hook Form
- Centralized error handling and toast notifications

## 📱 Responsive & RTL Design
The layout adapts to any screen size. The sidebar collapses to a drawer on
mobile and tables provide horizontal scrolling. Right-to-left languages such as
Arabic automatically mirror the layout, swap fonts and adjust spacing.

## 🚀 Deployment
```bash
npm run build
npm start
```
Set environment variables for production:
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com
NODE_ENV=production
```

## 🤝 Contributing
This template is designed to be:
- **Maintainable** – clean code structure with TypeScript
- **Scalable** – service-based architecture
- **Extensible** – easy to add new features and pages
- **Reusable** – generic components for rapid development

## 📄 License
This template is provided as-is for educational and commercial use.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
