"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Users, Building2, ClipboardList, Newspaper, Calendar, Trophy, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/language/i18n";

interface SidebarProps {
  className?: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  requiresAdmin?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    labelKey: "nav.dashboard",
  },
  {
    name: "Members",
    href: "/dashboard/members",
    icon: Users,
    labelKey: "nav.members",
  },
  {
    name: "Divisions",
    href: "/dashboard/divisions",
    icon: Building2,
    labelKey: "nav.divisions",
  },
  {
    name: "Tasks",
    href: "/dashboard/jobdesk",
    icon: ClipboardList,
    labelKey: "nav.tasks",
  },
  {
    name: "News",
    href: "/dashboard/news",
    icon: Newspaper,
    labelKey: "nav.news",
  },
  {
    name: "Events",
    href: "/dashboard/events",
    icon: Calendar,
    labelKey: "nav.events",
  },
  {
    name: "Competitions",
    href: "/dashboard/competitions",
    icon: Trophy,
    labelKey: "nav.competitions",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    labelKey: "nav.profile",
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Settings,
    labelKey: "nav.admin",
    requiresAdmin: true,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsAdmin(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    void checkRole();
  }, []);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 bg-primary-900 border-r border-primary-800 transform transition-transform duration-200 ease-in-out",
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 items-center border-b border-primary-800 px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/LOGO_ROBOTIC.jpeg"
              alt="Robotic Astratech"
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded object-cover"
            />
            <span className="text-lg font-bold text-white">
              ROBOTIC ASTRATECH
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation
            .filter((item) => !item.requiresAdmin || isAdmin)
            .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-800 text-white"
                    : "text-primary-200 hover:bg-primary-800/50 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

