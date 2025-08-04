"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Calendar,
  Users,
  Car,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Briefcase
} from "lucide-react"

const menuItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    href: '#overview'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: Calendar,
    href: '#bookings'
  },
  {
    id: 'driver-assignments',
    label: 'Driver Assignments',
    icon: Briefcase,
    href: '#driver-assignments'
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '#users'
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: Truck,
    href: '#drivers'
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    icon: Car,
    href: '#vehicles'
  }
]

export function CustomSidebar({ activeTab, onTabChange }) {
  return (
    <SidebarRoot className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-xl">KnoVan</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Logout"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarRoot>
  )
} 