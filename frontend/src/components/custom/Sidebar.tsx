"use client";

import { Home, Users, Folder, ChevronsUpDown, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { capitalizeFirstLetter } from "@/lib/helpers/capitalize";

// Navigation links data
const navLinks = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Users", url: "/users", icon: Users },
  { title: "Files", url: "/files", icon: Folder },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" className="h-screen">
      <SidebarHeader className="px-4 py-3 text-lg font-bold">
        MyApp
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.title}>
                <SidebarMenuButton asChild tooltip={link.title}>
                  <Link to={link.url}>
                    <link.icon />
                    <span>{link.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with profile (name only) */}
      <SidebarFooter className="px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            {user && (
              <SidebarMenuButton size="lg" tooltip={user.name}>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={undefined} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-2 text-sm font-medium truncate">
                  {capitalizeFirstLetter(user.name)}
                </div>
                <LogOut
                  onClick={logout}
                  className="ml-auto size-4 cursor-pointer hover:text-red-700"
                />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Sidebar rail for collapsed state */}
      <SidebarRail />
    </Sidebar>
  );
}
