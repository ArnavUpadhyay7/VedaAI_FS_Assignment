import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  showBack?: boolean;
  backHref?: string;
  hideHeader?: boolean;
}

export function DashboardLayout({
  children,
  headerTitle,
  showBack,
  backHref,
  hideHeader = false,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#ECEFF3]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-4 p-3 pb-20 lg:p-5 lg:pb-5">
        <Sidebar />

        <main className="flex min-h-[calc(100vh-2.5rem)] flex-1 flex-col overflow-hidden rounded-2xl bg-[#F3F4F6] lg:bg-transparent">
          {!hideHeader && (
            <Header
              title={headerTitle}
              showBack={showBack}
              backHref={backHref}
            />
          )}
          <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-0 lg:py-2">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
