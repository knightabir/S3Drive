"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import { LayoutDashboard, Folder, Users, GalleryVerticalEnd, AudioWaveform, Command } from "lucide-react";
import "@/app/globals.css";

const sidebarLinks = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { label: "Files", icon: <Folder className="w-5 h-5" />, href: "/dashboard/files" },
    { label: "Team", icon: <Users className="w-5 h-5" />, href: "/dashboard/team" },
];

const drives = [
    {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
    },
    {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
    },
];

export default function DashboardLayout({ children }) {
    const [active, setActive] = useState("/dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
    const [selectedDrive, setSelectedDrive] = useState(drives && drives.length > 0 ? drives[0] : null);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated" && typeof window !== "undefined" && window.__openLoginModal) {
            window.__openLoginModal();
        }
    }, [status]);

    if (status === "loading") return null;
    if (status === "unauthenticated") return null;

    // Close sidebar on navigation (for mobile)
    const handleNavClick = (href) => {
        setActive(href);
        setSidebarOpen(false);
    };

    // Handle add drive action
    const handleAddDrive = () => {
        console.log("Add drive clicked - implement your logic here");
        router.push('/dashboard/add-drive');
    };

    // Handle drive change and update selectedDrive
    const handleDriveChange = (drive) => {
        setSelectedDrive(drive);
        console.log('Drive changed:', drive);
    };

    // Get user details from session
    const user = session?.user;
    const userName = user?.name || "User";
    const userEmail = user?.email || "";
    const userImage = user?.image || "";
    const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen flex bg-background relative">
            {/* Mobile Sidebar Toggle Button */}
            {/* Only visible on mobile (md:hidden) */}
            {!sidebarOpen && (
                <button
                    className="md:hidden fixed top-4 left-4 z-30 bg-background text-primary rounded-lg p-2 shadow border border-border"
                    aria-label="Open sidebar"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            )}
            <Sidebar
                drives={drives}
                selectedDrive={selectedDrive}
                sidebarLinks={sidebarLinks}
                active={active}
                setActive={setActive}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                desktopSidebarOpen={desktopSidebarOpen}
                user={user}
                userName={userName}
                userEmail={userEmail}
                userImage={userImage}
                userInitials={userInitials}
                status={status}
                handleNavClick={handleNavClick}
                signOut={signOut}
                onAddDrive={handleAddDrive}
                onChangeDrive={handleDriveChange}
            />
            <main
                className={`
                    flex-1 min-h-screen bg-background
                    transition-all duration-200
                    ${desktopSidebarOpen ? "md:ml-64" : "md:ml-0"}
                `}
            >
                <HeaderBar
                    desktopSidebarOpen={desktopSidebarOpen}
                    setDesktopSidebarOpen={setDesktopSidebarOpen}
                />
                <div className="p-2">
                    {children}
                </div>
            </main>
        </div>
    );
}