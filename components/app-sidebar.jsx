"use client"

import { useEffect, useState } from "react"
import {
    Home,
    Folder,
    Users,
    Clock,
    Star,
    ShieldBan,
    Trash2,
    Settings,
    Link2,
    HelpCircle,
    FolderPlus,
    Upload,
    FolderUp,
    Plus,
} from "lucide-react"

import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sidebar menu items
const navLinks = [
    {
        key: "home",
        label: "Home",
        icon: <Home className="w-5 h-5 mr-2" />,
    },
    {
        key: "my-drive",
        label: "My Drive",
        icon: <Folder className="w-5 h-5 mr-2" />,
    },
    {
        key: "shared",
        label: "Shared with Me",
        icon: <Users className="w-5 h-5 mr-2" />,
    },
    {
        key: "recent",
        label: "Recent",
        icon: <Clock className="w-5 h-5 mr-2" />,
    },
    {
        key: "starred",
        label: "Starred",
        icon: <Star className="w-5 h-5 mr-2" />,
    },
    {
        key: "spam",
        label: "Spam",
        icon: <ShieldBan className="w-5 h-5 mr-2" />,
    },
    {
        key: "trash",
        label: "Trash",
        icon: <Trash2 className="w-5 h-5 mr-2" />,
    },
]

const extraLinks = [
    {
        key: "settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5 mr-2" />,
    },
    {
        key: "how-to-connect",
        label: "How to Connect",
        icon: <Link2 className="w-5 h-5 mr-2" />,
    },
    {
        key: "help-center",
        label: "Help Center",
        icon: <HelpCircle className="w-5 h-5 mr-2" />,
    },
]

// Google Drive-like "New" button styles
const googleDriveNewButton =
    "flex items-center justify-center w-full rounded-full bg-primary hover:bg-[#1765c1] text-white font-medium py-3 transition-colors shadow-md text-base gap-2 mb-4"

export function AppSidebar({ onMenuSelect, selectedMenu, ...props }) {
    const [drives, setDrives] = useState([])
    const [selectedDrive, setSelectedDrive] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDrives() {
            setLoading(true)
            try {
                const res = await fetch("/api/drives")
                if (res.ok) {
                    const data = await res.json()
                    setDrives(data)
                    setSelectedDrive(data[0] || null)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchDrives()
    }, [])

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={drives} />
            </SidebarHeader>
            <SidebarContent>
                {drives.length > 0 && selectedDrive ? (
                    <>
                        <div className="flex justify-center px-2 py-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        variant="ghost"
                                        className={googleDriveNewButton}
                                        style={{
                                            maxWidth: 180,
                                        }}
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>New</span>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("create-folder")}
                                        className="flex items-center gap-2">
                                        <FolderPlus className="w-4 h-4 mr-2" />
                                        Create Folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("upload-files")}
                                        className="flex items-center gap-2">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Files
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("upload-folder")}
                                        className="flex items-center gap-2">
                                        <FolderUp className="w-4 h-4 mr-2" />
                                        Upload Folder
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <SidebarMenu>
                            {navLinks.map(item => (
                                <SidebarMenuItem key={item.key}>
                                    <SidebarMenuButton isActive={selectedMenu === item.key} onClick={() => onMenuSelect && onMenuSelect(item.key)}>
                                        {item.icon}
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </>
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => onMenuSelect && onMenuSelect("add-drive")}>Add Drive</SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {extraLinks.map(item => (
                        <SidebarMenuItem key={item.key}>
                            <SidebarMenuButton onClick={() => onMenuSelect && onMenuSelect(item.key)}>
                                {item.icon}
                                {item.label}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
