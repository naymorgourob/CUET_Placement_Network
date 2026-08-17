import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar, TabletSidebar, MobileSidebarDrawer } from '@/layouts/Sidebar';
import { DashboardNavbar } from '@/layouts/DashboardNavbar';
import { ContentContainer } from '@/components/ContentContainer';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

export function DashboardLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen bg-background">
      <DesktopSidebar collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      <TabletSidebar />
      <MobileSidebarDrawer open={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar onOpenSidebar={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1">
          <ContentContainer>
            <Outlet />
          </ContentContainer>
        </main>
      </div>
    </div>
  );
}
