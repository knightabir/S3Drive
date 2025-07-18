"use client"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SettingsPage from "./SettingsPage"
import HowToConnectPage from "./HowToConnectPage"
import HelpCenterPage from "./HelpCenterPage"


const menuContent = {
  home: <div>Home Content</div>,
  "my-drive": <div>My Drive Content</div>,
  shared: <div>Shared with Me Content</div>,
  recent: <div>Recent Content</div>,
  starred: <div>Starred Content</div>,
  spam: <div>Spam Content</div>,
  trash: <div>Trash Content</div>,

  settings: <SettingsPage />,
  "how-to-connect": <HowToConnectPage />,
  "help-center": <HelpCenterPage />,
}

export default function Page() {
  const [selectedMenu, setSelectedMenu] = useState("home")

  return (
    <SidebarProvider>
      <AppSidebar onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1).replace(/-/g, " ")}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedMenu.charAt(0).toUpperCase() + selectedMenu.slice(1).replace(/-/g, " ")}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Main Content */}
          <div>
            {menuContent[selectedMenu] || <div>Select a menu item</div>}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
