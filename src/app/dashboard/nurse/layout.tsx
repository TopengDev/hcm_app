import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './sidebar';
import { Breadcrumbs } from '@/components/custom/breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <SidebarProvider>
         <DashboardSidebar />
         <main className="w-full">
            <div className="w-full p-8 flex items-center justify-between">
               <Breadcrumbs />
               <div className="text-slate-500">
                  {new Date().toLocaleDateString('id', {
                     weekday: 'long',
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric',
                     timeZone: 'UTC', // optional, depending on your context
                  })}
               </div>
            </div>
            <SidebarTrigger className="hover:cursor-pointer" />
            {children}
         </main>
      </SidebarProvider>
   );
}
