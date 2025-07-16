import { Menu, X } from "lucide-react";

export default function HeaderBar({ desktopSidebarOpen, setDesktopSidebarOpen }) {
  return (
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
  );
} 