"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const handleToggleSidebar = (): void => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Tutup sidebar otomatis saat pindah halaman / route
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen bg-background">
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
        <main className="flex-1 overflow-x-auto px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

