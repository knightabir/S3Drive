"use client";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, LayoutDashboard, Folder, Users } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const sidebarLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
  { label: "Files", icon: <Folder className="w-5 h-5" />, href: "/dashboard/files" },
  { label: "Team", icon: <Users className="w-5 h-5" />, href: "/dashboard/team" },
];

export default function DashboardLayout({ children }) {
  const [active, setActive] = useState("/dashboard");
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-primary flex flex-col justify-between border-r border-border fixed inset-y-0 left-0 z-20">
        <div>
          <div className="flex items-center gap-3 px-6 py-6">
            <Avatar className="w-10 h-10 bg-muted">
              <AvatarFallback className="text-lg">SD</AvatarFallback>
            </Avatar>
            <span className="text-xl font-bold tracking-tight">S3Drive</span>
          </div>
          <nav className="mt-4 flex flex-col gap-1 px-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-muted hover:text-primary-foreground ${active === link.href ? "bg-muted text-primary-foreground" : ""}`}
                onClick={() => setActive(link.href)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-6">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 mt-4 w-full rounded-lg hover:bg-muted transition-colors p-2">
                <Avatar className="w-8 h-8 bg-muted">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="font-semibold leading-tight">Jane Doe</div>
                  <div className="text-xs text-muted-foreground">jane@example.com</div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 mb-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </Button>
              </Link>
              <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen bg-background">
        {children}
      </main>
    </div>
  );
}
