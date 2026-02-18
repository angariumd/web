import { Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JobFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterStatus: 'ALL' | 'ACTIVE' | 'DONE';
    setFilterStatus: (status: 'ALL' | 'ACTIVE' | 'DONE') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
}

export const JobFilters = ({
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortOrder,
    setSortOrder
}: JobFiltersProps) => {
    return (
        <div className="flex flex-row items-center justify-between space-y-0 bg-muted/10 border-b shrink-0 p-6">
            <div className="flex items-center gap-4">
                <div className="bg-background/80 border rounded-lg flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        placeholder="Query handles or commands..."
                        className="bg-transparent text-xs ml-2 outline-none w-48 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="h-4 w-[1px] bg-muted-foreground/20" />
                <div className="flex gap-1">
                    {(['ALL', 'ACTIVE', 'DONE'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={cn(
                                "px-3 py-1 rounded-md text-[13px] font-bold uppercase tracking-tight transition-colors",
                                f === filterStatus ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className={cn("text-xs font-semibold hover:bg-accent transition-colors", sortOrder === 'asc' && "text-primary opacity-100 bg-primary/10")}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            >
                <ArrowUpDown className="mr-2 h-3 w-3" />
                Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </Button>
        </div>
    );
};
