import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types';

export const useDashboardStats = () => {
    const [stats, setStats] = useState<DashboardStats>({
        runningJobs: 0,
        queuedJobs: 0,
        activeNodes: 0,
        gpuUtilization: 0,
        systemRamUsage: 0,
        systemRamTotal: 0,
        recentJobs: [],
        offlineNodes: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsPromise = api.jobs.list().catch(err => {
                    console.error('Failed to fetch jobs:', err);
                    return [];
                });
                const nodesPromise = api.nodes.list().catch(err => {
                    console.error('Failed to fetch nodes:', err);
                    return [];
                });

                const [rawJobs, rawNodes] = await Promise.all([jobsPromise, nodesPromise]);

                const jobs = rawJobs || [];
                const nodes = rawNodes || [];

                const running = jobs.filter((j: any) => j.state === 'RUNNING').length;
                const queued = jobs.filter((j: any) => j.state === 'QUEUED').length;

                const recent = [...jobs]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5);

                const activeNodesList = nodes.filter((n: any) => n.status === 'READY' || n.status === 'UP');
                const offline = nodes.filter((n: any) => n.status === 'OFFLINE' || n.status === 'DOWN').length;
                const active = activeNodesList.length;

                const totalUtil = nodes.reduce((acc: number, n: any) => acc + (n.gpu_utilization || 0), 0);
                const avgUtil = nodes.length > 0 ? totalUtil / nodes.length : 0;

                const totalRamUsed = nodes.reduce((acc: number, n: any) => acc + (n.memory_used_mb || 0), 0);
                const totalRamMax = nodes.reduce((acc: number, n: any) => acc + (n.memory_total_mb || 0), 0);

                setStats({
                    runningJobs: running,
                    queuedJobs: queued,
                    activeNodes: active,
                    gpuUtilization: Math.round(avgUtil),
                    systemRamUsage: totalRamUsed,
                    systemRamTotal: totalRamMax,
                    recentJobs: recent,
                    offlineNodes: offline,
                });
            } catch (error) {
                console.error('Failed to process dashboard statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return { stats, loading };
};
