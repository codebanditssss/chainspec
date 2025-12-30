import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 md:ml-64">
                <header className="h-14 border-b flex items-center px-4 md:px-6 sticky top-0 z-10 bg-background/50 backdrop-blur-lg">
                    <MobileSidebar />
                    <div className="ml-auto flex items-center gap-4">
                        {/* Topbar actions */}
                    </div>
                </header>
                <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
