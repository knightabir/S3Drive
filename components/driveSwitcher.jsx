"use client"
import React, { useEffect } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuShortcut } from './ui/dropdown-menu';
import { ChevronsUpDown, Plus } from "lucide-react";

const DriveSwitcher = ({ drives, selectedDrive, onAddDrive, onChangeDrive }) => {
    const { isMobile } = useSidebar();

    useEffect(() => {
        // If selectedDrive is not in drives, select the first one
        if (drives && drives.length > 0 && (!selectedDrive || !drives.find((d) => d.name === selectedDrive.name))) {
            if (onChangeDrive) {
                onChangeDrive(drives[0]);
            }
        }
    }, [drives, selectedDrive, onChangeDrive]);

    if (!selectedDrive) {
        return null;
    }

    const handleAddDrive = () => {
        if (onAddDrive) {
            onAddDrive();
        } else {
            // Default action - you can customize this
            console.log("Add drive clicked");
        }
    };

    const handleDriveSelect = (drive) => {
        if (onChangeDrive) {
            onChangeDrive(drive);
        }
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                {selectedDrive.logo && <selectedDrive.logo className="size-4" />}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{selectedDrive.name}</span>
                                <span className="truncate text-xs">{selectedDrive.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Drives
                        </DropdownMenuLabel>
                        {drives && drives.map((drive, index) => (
                            <DropdownMenuItem
                                key={drive.name}
                                onClick={() => handleDriveSelect(drive)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    {drive.logo && <drive.logo className="size-3.5 shrink-0" />}
                                </div>
                                {drive.name}
                                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 p-2 cursor-pointer"
                            onClick={handleAddDrive}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">Add drive</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default DriveSwitcher