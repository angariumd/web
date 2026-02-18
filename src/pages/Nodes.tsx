import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useNodes } from '@/hooks/useNodes';
import { NodeCard } from '@/components/nodes/NodeCard';

export const Nodes = () => {
    const { nodes, loading, fetchNodes } = useNodes();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Nodes</h1>
                    <p className="text-sm text-muted-foreground mt-1">Status and GPU resource distribution across the cluster.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={fetchNodes} className="bg-card">
                    <RotateCcw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                    Sync Cluster
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {loading && nodes.length === 0 ? (
                    <div className="col-span-full h-48 flex items-center justify-center italic text-muted-foreground opacity-50">
                        Discovering available resources...
                    </div>
                ) : nodes.length === 0 ? (
                    <div className="col-span-full h-48 flex flex-col items-center justify-center gap-4 text-muted-foreground border-2 border-dashed rounded-2xl">
                        <AlertTriangle className="h-10 w-10 opacity-20" />
                        <p>No compute nodes registered in this control plane.</p>
                    </div>
                ) : (
                    nodes.map((node) => (
                        <NodeCard key={node.id} node={node} />
                    ))
                )}
            </div>
        </div>
    );
};
