import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Server, Sun, Moon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';
import angariumLogo from '@/assets/angarium-logo.svg';
import angariumLogoDark from '@/assets/angarium-logo-dark.svg';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ListTodo, label: 'Jobs', href: '/jobs' },
    { icon: Server, label: 'Nodes', href: '/nodes' },
];

export const Sidebar = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('angarium-theme');
            if (saved) return saved as 'light' | 'dark';
            return 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('angarium-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const logo = theme === 'dark' ? angariumLogoDark : angariumLogo;

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex flex-col items-center justify-center border-b py-8 px-6 space-y-3">
                <img src={logo} alt="Angarium Logo" className="h-16 w-16 object-contain" />
                <span className="text-2xl font-black tracking-tighter text-primary">Angarium</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="border-t p-4">
                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                    <div className="flex items-center">
                        {theme === 'light' ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </div>
                    <div className={cn(
                        "h-4 w-8 rounded-full bg-muted-foreground/20 relative transition-colors p-[2px]",
                        theme === 'dark' && "bg-primary/50"
                    )}>
                        <div className={cn(
                            "h-3 w-3 rounded-full bg-background shadow-sm transition-transform duration-200",
                            theme === 'dark' ? "translate-x-4" : "translate-x-0"
                        )} />
                    </div>
                </button>
            </div>
        </div>
    );
};
