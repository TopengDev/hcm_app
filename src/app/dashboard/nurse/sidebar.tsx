import { Calendar, BookCheckIcon, Bed } from 'lucide-react';

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

// Menu items.
const items = [
   {
      title: 'Kunjungan',
      url: '/dashboard/nurse/visits',
      icon: BookCheckIcon,
   },
   {
      title: 'Pasien',
      url: '/dashboard/nurse/patient',
      icon: Bed,
   },
   {
      title: 'Jadwal',
      url: '/dashboard/nurse/schedules',
      icon: Calendar,
   },
];

export function DashboardSidebar() {
   return (
      <Sidebar>
         <SidebarHeader className="w-full flex items-center justify-center py-24">
            <h1 className="font-bold text-4xl">LOGO</h1>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel className="px-4 text-base">
                  Menu
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="px-4">
                           <SidebarMenuButton asChild>
                              <Link href={item.url}>
                                 <item.icon />
                                 <span className="text-base">{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
