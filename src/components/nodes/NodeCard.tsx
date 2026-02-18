import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, CloudOff, Activity, HardDrive, Cpu } from 'lucide-react';
import type { Node, NodeStatus } from '@/types';

interface NodeCardProps {
    node: Node;
}

export const NodeCard = ({ node }: NodeCardProps) => {
    const memoryTotal = node.memory_total_mb || 1;
    const memoryUsed = node.memory_used_mb || 0;
    const ramPercent = Math.min(100, (memoryUsed / memoryTotal) * 100);

    const getStatusColor = (status: NodeStatus) => {
        switch (status) {
            case 'READY':
            case 'UP': return 'bg-green-500/10 text-green-600 border-green-500/20';
            case 'BUSY': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'OFFLINE':
            case 'DOWN': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: NodeStatus) => {
        switch (status) {
            case 'READY':
            case 'UP': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'OFFLINE':
            case 'DOWN': return <CloudOff className="h-4 w-4 text-red-500" />;
            default: return <Activity className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Card className="border-primary/10 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3 bg-muted/10 border-b">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xs font-bold font-mono tracking-tighter text-primary">{node.id}</CardTitle>
                </div>
                {getStatusIcon(node.status)}
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Health State</span>
                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded border uppercase", getStatusColor(node.status))}>
                            {node.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Net Address</span>
                        <span className="text-xs font-mono font-bold opacity-80">{node.addr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Agent Ver</span>
                        <span className="text-xs font-semibold">{node.agent_version}</span>
                    </div>

                    <div className="border-t pt-5 mt-2 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                    <HardDrive className="h-4 w-4 text-primary" />
                                    GPU CAPACITY
                                </div>
                                <span className="text-xs font-black">{node.gpu_count} Units</span>
                            </div>

                            <div className="flex gap-1.5 h-3">
                                {Array.from({ length: node.gpu_count }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "flex-1 rounded-sm shadow-inner transition-all duration-500",
                                            i < node.gpu_free
                                                ? "bg-green-500/40 border border-green-500/20 group-hover:bg-green-500/60"
                                                : "bg-blue-500/80 border border-blue-400 group-hover:bg-blue-500"
                                        )}
                                        title={i < node.gpu_free ? 'Available' : 'Reserved/Allocated'}
                                    />
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Available</span>
                                    <span className="text-sm font-black text-green-500">{node.gpu_free}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Reserved</span>
                                    <span className="text-sm font-black text-blue-500">{node.gpu_count - node.gpu_free}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                    <Cpu className="h-4 w-4 text-orange-500" />
                                    SYSTEM MEMORY
                                </div>
                                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">RAM</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black tracking-tightest">
                                        {(memoryUsed / 1024).toFixed(1)} <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">GB USED</span>
                                    </span>
                                    <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                                        OF {(memoryTotal / 1024).toFixed(1)} GB
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-orange-500/10 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-1000"
                                        style={{ width: `${ramPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
