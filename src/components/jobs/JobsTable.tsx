import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Job, JobState } from '@/types';
import {
    ChevronDown, FileText, XCircle, User, Hash, Terminal, Timer, RotateCcw, Activity, Clock, ChevronLeft, ChevronRight
} from 'lucide-react';

interface JobsTableProps {
    jobs: Job[];
    loading: boolean;
    onViewLogs: (jobId: string) => void;
    onCancelJob: (jobId: string) => void;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    pageSize: number;
    setPageSize: (size: number) => void;
    totalCount: number;
}

export const JobsTable = ({
    jobs,
    loading,
    onViewLogs,
    onCancelJob,
    page,
    totalPages,
    setPage,
    pageSize,
    setPageSize,
    totalCount
}: JobsTableProps) => {
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    const getStatusColor = (state: JobState) => {
        switch (state) {
            case 'QUEUED': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
            case 'RUNNING': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'SUCCEEDED': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
            case 'FAILED': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
            case 'CANCELED': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
            case 'LOST': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const formatTimestamp = (ts?: string) => {
        if (!ts || ts.startsWith('0001')) return '--:--';
        return new Date(ts).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 10;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            const sideBuffer = Math.floor((maxVisible - 5) / 2);

            pages.push(1);
            if (page > sideBuffer + 2) pages.push('...');

            const start = Math.max(2, page - sideBuffer);
            const end = Math.min(totalPages - 1, page + sideBuffer);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - (sideBuffer + 1)) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="relative w-full overflow-auto flex-1 h-full min-h-[400px]">
                <table className="w-full caption-bottom text-sm border-collapse">
                    <thead className="bg-muted/5 font-bold uppercase tracking-widest text-[13px] sticky top-0 z-10 backdrop-blur-md">
                        <tr className="border-b">
                            <th className="h-10 px-6 text-left align-middle text-muted-foreground/70 w-24">Handle</th>
                            <th className="h-10 px-6 text-left align-middle text-muted-foreground/70">Instruction Execution</th>
                            <th className="h-10 px-6 text-left align-middle text-muted-foreground/70 w-32">Telemetry</th>
                            <th className="h-10 px-6 text-center align-middle text-muted-foreground/70 w-20">Unit(s)</th>
                            <th className="h-10 px-6 text-left align-middle text-muted-foreground/70 w-40">Inception</th>
                            <th className="h-10 px-6 text-right align-middle text-muted-foreground/70 w-32 pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="font-mono text-[15px] leading-none">
                        {!jobs.length ? (
                            <tr>
                                <td colSpan={6} className="h-32 text-center font-sans text-xs text-muted-foreground/50 italic">
                                    {loading ? 'Initializing telemetry stream...' : 'No handles detected with current telemetry filters.'}
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <Fragment key={job.id}>
                                    <tr
                                        className={cn(
                                            "border-b transition-colors cursor-pointer",
                                            expandedJob === job.id ? "bg-primary/[0.03]" : "hover:bg-muted/30"
                                        )}
                                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                    >
                                        <td className="px-6 py-4 align-middle font-bold text-primary flex items-center gap-1">
                                            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", expandedJob === job.id ? "rotate-180" : "rotate-0")} />
                                            {job.id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 align-middle truncate max-w-[600px] opacity-80">{job.command}</td>
                                        <td className="px-6 py-4 align-middle">
                                            <span className={cn("inline-flex items-center rounded px-2 py-0.5 border text-[12px] font-extrabold tracking-tighter", getStatusColor(job.state))}>
                                                {job.state}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-center font-bold">{job.gpu_count}</td>
                                        <td className="px-6 py-4 align-middle text-muted-foreground/60 font-sans text-[13px]">
                                            {new Date(job.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right pr-8">
                                            <div className="flex justify-end items-center gap-1" onClick={e => e.stopPropagation()}>
                                                {job.state !== 'QUEUED' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Stream Logs"
                                                        className="h-10 w-10 rounded-md group-hover:text-primary transition-all"
                                                        onClick={() => onViewLogs(job.id)}
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                                {['QUEUED', 'RUNNING', 'STARTING'].includes(job.state) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 w-10 rounded-md text-destructive/40 hover:text-white hover:bg-destructive transition-all"
                                                        onClick={() => onCancelJob(job.id)}
                                                        title="Terminate Job"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedJob === job.id && (
                                        <tr className="bg-primary/[0.02] animate-in fade-in slide-in-from-top-1 duration-200 border-b">
                                            <td colSpan={6} className="px-12 py-6">
                                                <div className="grid grid-cols-4 gap-8">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><User className="h-3 w-3" /> Assigned Owner</p>
                                                            <p className="font-mono text-sm mt-2">{job.owner_id || 'System'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><Hash className="h-3 w-3" /> Priority Level</p>
                                                            <p className="font-mono text-sm mt-2">{job.priority}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><Terminal className="h-3 w-3" /> Working Directory</p>
                                                            <p className="font-mono text-sm mt-2 break-all opacity-80">{job.cwd}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><Timer className="h-3 w-3" /> Runtime Constraints</p>
                                                            <p className="font-mono text-sm mt-2">{job.max_runtime_minutes > 0 ? `${job.max_runtime_minutes} Minutes` : 'Infinite Runtime'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><RotateCcw className="h-3 w-3" /> Retry Policy</p>
                                                            <p className="font-mono text-sm mt-2">{job.retry_count} / 3 Attempts</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><Activity className="h-3 w-3" /> Terminal Exit Code</p>
                                                            <p className={cn("font-mono text-sm", job.exit_code !== 0 ? "text-red-500 font-bold" : "text-green-500 font-bold")}>
                                                                {job.state === 'SUCCEEDED' || job.state === 'FAILED' ? job.exit_code : '---'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-2 bg-background/50 rounded-xl border p-4 space-y-4 shadow-inner">
                                                        <p className="text-[13px] font-bold uppercase text-muted-foreground flex items-center gap-2 tracking-widest"><Clock className="h-3 w-3" /> Sequential Timeline</p>
                                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 relative">
                                                            <div className="absolute left-[39px] top-6 bottom-4 w-[2px] bg-muted/40" />

                                                            <div className="flex items-center gap-4 pl-8 relative">
                                                                <div className="absolute left-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-bold uppercase opacity-40">Created</p>
                                                                    <p className="font-mono text-sm">{formatTimestamp(job.created_at)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 pl-8 relative">
                                                                <div className="absolute left-0 h-2 w-2 rounded-full border-2 border-primary/40 bg-background" />
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-bold uppercase opacity-40">Scheduled</p>
                                                                    <p className="font-mono text-sm">{formatTimestamp(job.queued_at)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 pl-8 relative">
                                                                <div className="absolute left-0 h-2 w-2 rounded-full border-2 border-green-500 bg-background" />
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-bold uppercase text-green-500/60">Execution</p>
                                                                    <p className="font-mono text-sm">{formatTimestamp(job.started_at)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4 pl-8 relative">
                                                                <div className="absolute left-0 h-2 w-2 rounded-full border-2 border-rose-400 bg-background" />
                                                                <div className="space-y-0.5">
                                                                    <p className="text-sm font-bold uppercase text-rose-400">Termination</p>
                                                                    <p className="font-mono text-sm">{formatTimestamp(job.finished_at)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t bg-muted/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                    <div className="text-[11px] uppercase font-bold text-muted-foreground tracking-widest leading-tight">
                        Showing <br />
                        <span className="text-foreground text-[13px]">{totalCount > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, totalCount)}</span> <br />
                        of {totalCount} records
                    </div>

                    <div className="h-8 w-[1px] bg-muted-foreground/20" />

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Per Page</span>
                        <select
                            className="bg-transparent text-xs font-bold border rounded px-2 py-1 outline-none hover:bg-muted/50 transition-colors cursor-pointer"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                            {[10, 20, 30, 50, 100].map(size => (
                                <option key={size} value={size} className="bg-card text-foreground">{size}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            {getPageNumbers().map((p, i) => (
                                typeof p === 'number' ? (
                                    <Button
                                        key={i}
                                        variant={page === p ? "primary" : "ghost"}
                                        size="sm"
                                        className={cn(
                                            "h-8 w-8 p-0 text-[13px] font-bold transition-all",
                                            page === p ? "shadow-md shadow-primary/20" : "text-muted-foreground"
                                        )}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </Button>
                                ) : (
                                    <span key={i} className="px-2 text-muted-foreground/50 font-bold select-none cursor-default">...</span>
                                )
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

