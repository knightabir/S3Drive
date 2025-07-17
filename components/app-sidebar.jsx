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
                        <div className="flex items-center justify-between px-2 py-1">
                            <span className="font-semibold">Options</span>
                            <SidebarMenuButton size="sm" variant="outline">
                                +
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <span className="sr-only">Open actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("create-folder")}>Create Folder</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("upload-files")}>Upload Files</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onMenuSelect && onMenuSelect("upload-folder")}>Upload Folder</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuButton>
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
