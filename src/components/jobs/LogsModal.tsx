import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, XCircle, Square, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJobLogs } from '@/hooks/useJobLogs';

interface LogsModalProps {
    jobId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const LogsModal = ({ jobId, isOpen, onClose }: LogsModalProps) => {
    const { logs, isStreaming, startStreaming, stopStreaming, fetchLogs } = useJobLogs();
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && jobId) {

            fetchLogs(jobId);
        } else {
            stopStreaming();
        }
    }, [isOpen, jobId, fetchLogs, stopStreaming]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    if (!isOpen) return null;

    const toggleStreaming = () => {
        if (isStreaming) {
            stopStreaming();
        } else {
            startStreaming(jobId);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in slide-in-from-bottom-8 duration-300">
            <Card className="w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border-primary/20 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-card border-b py-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-2 w-2 rounded-full", isStreaming ? "bg-green-500 animate-pulse" : "bg-muted")} />
                            <h2 className="text-sm font-bold tracking-tight">System Logs: <span className="font-mono text-xs opacity-60 underline underline-offset-4 decoration-primary/30">{jobId}</span></h2>
                        </div>
                        <div className="h-4 w-[1px] bg-muted-foreground/20" />
                        <Button
                            variant={isStreaming ? "secondary" : "outline"}
                            size="sm"
                            className="h-7 px-3 text-[13px] font-bold uppercase tracking-wider gap-2"
                            onClick={toggleStreaming}
                        >
                            {isStreaming ? (
                                <>
                                    <Square className="h-3 w-3 fill-current" />
                                    Stop Streaming
                                </>
                            ) : (
                                <>
                                    <Play className="h-3 w-3 fill-current" />
                                    Keep Following
                                </>
                            )}
                        </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
                        <XCircle className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto bg-[#0a0a0a] text-[#d4d4d4] p-6 font-mono text-[14px] leading-snug whitespace-pre-wrap selection:bg-primary/30 scrollbar-thin scrollbar-thumb-primary/20">
                    {logs ? (
                        <div className="animate-in fade-in duration-500">
                            {logs.split('\n').map((line, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <span className="shrink-0 w-8 text-right opacity-20 select-none group-hover:opacity-40 transition-opacity">{i + 1}</span>
                                    <span className="flex-1">{line}</span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 italic gap-2">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            {isStreaming ? 'Waiting for stream...' : 'Loading logs...'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
