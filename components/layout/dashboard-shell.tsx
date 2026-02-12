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
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        className={cn(
          "-translate-x-full",
          isSidebarOpen && "translate-x-0",
        )}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          userProfile={userProfile}
          onToggleSidebar={handleToggleSidebar}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

