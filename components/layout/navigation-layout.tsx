"use client";

import { NavigationSidebar } from "@/components/layout/navigation-sidebar";
import { NavigationHeader } from "@/components/layout/navigation-header";

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Main Sidebar */}
      <NavigationSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <NavigationHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-slate-900/50">
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
