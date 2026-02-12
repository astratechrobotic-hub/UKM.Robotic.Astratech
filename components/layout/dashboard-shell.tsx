"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  userProfile: {
    name: string;
    email?: string;
  };
}

export function DashboardShell({ children, userProfile }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex min-h-screen">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        className={cn(
          "-translate-x-full md:translate-x-0",
          isSidebarOpen && "translate-x-0",
        )}
        onNavigate={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          userProfile={userProfile}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

