"use client";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, LayoutDashboard, Folder, Users, Menu, X } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import "@/app/globals.css";

const sidebarLinks = [
  { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
  { label: "Files", icon: <Folder className="w-5 h-5" />, href: "/dashboard/files" },
  { label: "Team", icon: <Users className="w-5 h-5" />, href: "/dashboard/team" },
];

export default function DashboardLayout({ children }) {
  const [active, setActive] = useState("/dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  // Close sidebar on navigation (for mobile)
  const handleNavClick = (href) => {
    setActive(href);
    setSidebarOpen(false);
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex bg-background relative">
          {/* Mobile Sidebar Toggle Button */}
          {/* Only visible on mobile (md:hidden) */}
          {!sidebarOpen && (
            <button
              className="md:hidden fixed top-4 left-4 z-30 bg-background text-primary rounded-lg p-2 shadow border border-border"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Desktop Sidebar */}
          <aside
            className={`
              hidden md:flex flex-col justify-between
              bg-secondary text-primary border-r border-border
              fixed inset-y-0 left-0 z-20
              transition-all duration-200 overflow-hidden
              ${desktopSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
            `}
          >
            <div>
              <div className={`flex items-center gap-3 px-6 py-6 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                <Avatar className="w-10 h-10 bg-muted">
                  <AvatarFallback className="text-lg">SD</AvatarFallback>
                </Avatar>
                <span className="text-xl font-bold tracking-tight whitespace-nowrap">S3Drive</span>
              </div>
              <nav className={`mt-4 flex flex-col gap-1 px-2 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-muted hover:text-primary-foreground whitespace-nowrap ${active === link.href ? "bg-muted text-primary-foreground" : ""}`}
                    onClick={() => setActive(link.href)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className={`flex flex-col gap-2 px-4 pb-6 transition-opacity duration-200 ${desktopSidebarOpen ? "opacity-100" : "opacity-0"}`}>
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

          {/* Mobile Sidebar Overlay */}
          {/* Only visible on mobile when sidebar is open */}
          <div
            className={`
              fixed inset-0 z-40 bg-black/40 transition-opacity duration-200
              ${sidebarOpen ? "block md:hidden" : "hidden"}
            `}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-primary border-r border-border
              flex flex-col justify-between transition-transform duration-200
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:hidden
            `}
            aria-label="Sidebar"
          >
            <div>
              <div className="flex items-center gap-3 px-6 py-6">
                <Avatar className="w-10 h-10 bg-muted">
                  <AvatarFallback className="text-lg">SD</AvatarFallback>
                </Avatar>
                <span className="text-xl font-bold tracking-tight">S3Drive</span>
                {/* Close button only visible on mobile sidebar */}
                <button
                  className="ml-auto p-1 rounded-lg hover:bg-muted transition-colors md:hidden"
                  aria-label="Close sidebar"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="mt-4 flex flex-col gap-1 px-2">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-muted hover:text-primary-foreground ${active === link.href ? "bg-muted text-primary-foreground" : ""}`}
                    onClick={() => handleNavClick(link.href)}
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
          <main
            className={`
              flex-1 min-h-screen bg-background
              transition-all duration-200
              ${desktopSidebarOpen ? "md:ml-64" : "md:ml-0"}
            `}
          >
            {/* Top Bar */}
            <div className="h-14 bg-primary flex items-center px-4 sm:px-6 md:px-8 m-0">
              {/* Desktop Sidebar Toggle Button */}
              <button
                className="hidden md:block mr-4 p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors text-primary-foreground"
                aria-label={desktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
                onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              >
                {desktopSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex-1" />
            </div>
            {/* Page Content */}
            <div className="p-2">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}