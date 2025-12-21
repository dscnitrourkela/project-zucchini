"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { publicRoutes } from "@/config";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.some((route) => pathname?.startsWith(route));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
    setMounted(true);

    const handleToggle = (e: CustomEvent<{ collapsed: boolean }>) => {
      setIsCollapsed(e.detail.collapsed);
    };

    window.addEventListener("sidebar-toggle" as any, handleToggle);
    return () => window.removeEventListener("sidebar-toggle" as any, handleToggle);
  }, []);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          mounted ? (isCollapsed ? "ml-16" : "ml-64") : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
