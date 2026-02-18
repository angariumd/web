import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw, Plus } from 'lucide-react';

import { useJobs } from '@/hooks/useJobs';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobsTable } from '@/components/jobs/JobsTable';
import { NewJobModal } from '@/components/jobs/NewJobModal';
import { LogsModal } from '@/components/jobs/LogsModal';


export const Jobs = () => {
    const { jobs, loading, fetchJobs, submitJob, cancelJob } = useJobs();


    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'DONE'>('ALL');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);


    const [showNewJobModal, setShowNewJobModal] = useState(false);
    const [selectedJobIdForLogs, setSelectedJobIdForLogs] = useState<string | null>(null);

    const [pageSize, setPageSize] = useState(10);


    const processedJobs = useMemo(() => {
        let result = jobs ? [...jobs] : [];

        result = result.filter(job => {
            const matchesSearch = job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.owner_id?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'ALL' ||
                (filterStatus === 'ACTIVE' && ['QUEUED', 'RUNNING', 'STARTING'].includes(job.state)) ||
                (filterStatus === 'DONE' && ['SUCCEEDED', 'FAILED', 'CANCELED', 'LOST'].includes(job.state));

            return matchesSearch && matchesStatus;
        });


        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [jobs, searchQuery, filterStatus, sortOrder]);

    const totalPages = Math.ceil(processedJobs.length / pageSize);
    const paginatedJobs = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return processedJobs.slice(start, start + pageSize);
    }, [processedJobs, currentPage, pageSize]);

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Jobs</h1>
                    <p className="text-sm text-muted-foreground mt-1">Real-time status of your GPU computing workloads.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" size="sm" onClick={fetchJobs} className="bg-card">
                        <RotateCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                        Sync
                    </Button>
                    <Button size="sm" onClick={() => setShowNewJobModal(true)} className="shadow-lg shadow-primary/20 px-6">
                        <Plus className="mr-2 h-4 w-4" />
                        New Job
                    </Button>
                </div>
            </div>

            <Card className="border-primary/10 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                <JobFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
                <CardContent className="p-0 flex-1 flex flex-col">
                    <JobsTable
                        jobs={paginatedJobs}
                        loading={loading}
                        onViewLogs={setSelectedJobIdForLogs}
                        onCancelJob={cancelJob}
                        page={currentPage}
                        totalPages={totalPages}
                        setPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={(size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                        totalCount={processedJobs.length}
                    />
                </CardContent>
            </Card>

            <NewJobModal
                isOpen={showNewJobModal}
                onClose={() => setShowNewJobModal(false)}
                onSubmit={submitJob}
            />

            <LogsModal
                jobId={selectedJobIdForLogs || ''}
                isOpen={!!selectedJobIdForLogs}
                onClose={() => setSelectedJobIdForLogs(null)}
            />
        </div>
    );
};
