export type JobState = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' | 'LOST' | 'STARTING';

export interface Job {
    id: string;
    command: string;
    state: JobState;
    gpu_count: number;
    created_at: string;
    queued_at?: string;
    started_at?: string;
    finished_at?: string;
    owner_id?: string;
    priority: number;
    cwd: string;
    max_runtime_minutes: number;
    retry_count: number;
    exit_code?: number;
}

export type NodeStatus = 'READY' | 'UP' | 'BUSY' | 'OFFLINE' | 'DOWN';

export interface Node {
    id: string;
    status: NodeStatus;
    addr: string;
    agent_version: string;
    gpu_count: number;
    gpu_free: number;
    gpu_utilization?: number;
    memory_total_mb?: number;
    memory_used_mb?: number;
    last_heartbeat: string;
}

export interface DashboardStats {
    runningJobs: number;
    queuedJobs: number;
    activeNodes: number;
    gpuUtilization: number;
    systemRamUsage: number;
    systemRamTotal: number;
    recentJobs: Job[];
    offlineNodes: number;
}

export interface NewJobParams {
    gpu_count: number;
    command: string;
    cwd: string;
    priority: number;
    max_runtime_minutes: number;
}
