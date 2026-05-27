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
    <div className="flex h-screen w-full gap-3 bg-[#E8EAED] p-3">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col gap-3 bg-[#E8EAED] p-3 lg:p-4">
        {!hideHeader && (
          <Header
            title={headerTitle}
            showBack={showBack}
            backHref={backHref}
          />
        )}
        <main className="min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
