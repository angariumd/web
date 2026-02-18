import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        api.whoami().then(setUser).catch(console.error);
    }, []);

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden relative">
                <header className="flex h-16 items-center justify-between border-b bg-card px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Cluster Control</h2>
                        <span className="text-muted-foreground/20">|</span>
                        <h2 className="text-sm font-semibold tracking-tight">Active Overview</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 rounded-full px-4"
                        >
                            <User className="h-4 w-4" />
                            <span className="text-xs font-medium">{user?.name || 'Guest'}</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
                    <div className="mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
