import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CircleCheck, Clock, Server, Cpu, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Badge } from '@/components/ui/badge';

export const Dashboard = () => {
    const { stats, loading } = useDashboardStats();

    const ramUsedGB = (stats.systemRamUsage / 1024).toFixed(1);
    const ramTotalGB = (stats.systemRamTotal / 1024).toFixed(1);

    const statCards = [
        { label: 'Running Jobs', value: stats.runningJobs, icon: Activity, color: 'text-blue-500' },
        { label: 'Queued Jobs', value: stats.queuedJobs, icon: Clock, color: 'text-yellow-500' },
        { label: 'Active Nodes', value: stats.activeNodes, icon: Server, color: 'text-green-500' },
        { label: 'GPU Utilization', value: `${stats.gpuUtilization}%`, icon: Activity, color: 'text-purple-500' },
        { label: 'System RAM Usage', value: `${ramUsedGB} GB / ${ramTotalGB} GB`, icon: Cpu, color: 'text-orange-500' },
    ];

    const getStatusColor = (state: string) => {
        switch (state) {
            case 'RUNNING': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'SUCCEEDED': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'FAILED': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'QUEUED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'STARTING': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {statCards.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className={cn("h-4 w-4", stat.color)} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.label === 'System RAM Usage' && stats.systemRamTotal === 0 && !loading
                                    ? <span className="text-sm animate-pulse text-muted-foreground whitespace-nowrap">Syncing Resources...</span>
                                    : stat.value
                                }
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Jobs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentJobs.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic">No recent activity details available.</p>
                            ) : (
                                <div className="divide-y divide-border">
                                    {stats.recentJobs.map((job) => (
                                        <div key={job.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-mono font-bold text-primary">{job.id}</span>
                                                <span className="text-sm font-medium line-clamp-1 opacity-70">{job.command}</span>
                                            </div>
                                            <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0", getStatusColor(job.state))}>
                                                {job.state}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cluster Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.offlineNodes > 0 ? (
                            <div className="flex items-center gap-2 text-sm text-red-500 font-bold">
                                <AlertCircle className="h-4 w-4" />
                                <span>{stats.offlineNodes} {stats.offlineNodes === 1 ? 'node' : 'nodes'} offline</span>
                            </div>
                        ) : stats.activeNodes === 0 && !loading ? (
                            <div className="flex items-center gap-2 text-sm text-yellow-500 font-bold">
                                <Clock className="h-4 w-4 animate-pulse" />
                                <span>Awaiting node registration...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-500">
                                <CircleCheck className="h-4 w-4" />
                                <span>Cluster fully healthy</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
