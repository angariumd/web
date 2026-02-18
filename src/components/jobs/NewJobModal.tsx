import { useState } from 'react';



import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { NewJobParams } from '@/types';

interface NewJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (job: NewJobParams) => Promise<boolean>;
}

export const NewJobModal = ({ isOpen, onClose, onSubmit }: NewJobModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newJob, setNewJob] = useState<NewJobParams>({
        gpu_count: 1,
        command: 'nvidia-smi',
        cwd: '/tmp',
        priority: 1,
        max_runtime_minutes: 60
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(newJob);
            onClose();
        } catch (error) {
            // Error handling is done in useJobs or parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in zoom-in-95 duration-200">
            <Card className="w-full max-w-lg shadow-2xl border-primary/10">
                <CardHeader>
                    <h2 className="text-xl font-bold tracking-tight">Submit Compute Job</h2>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Resource Requirements</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[13px] font-bold uppercase text-muted-foreground">Entrypoint Command</label>
                            <input
                                className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="e.g. python train.py"
                                value={newJob.command}
                                onChange={(e) => setNewJob({ ...newJob, command: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold uppercase text-muted-foreground">GPUs</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={newJob.gpu_count}
                                    onChange={(e) => setNewJob({ ...newJob, gpu_count: parseInt(e.target.value) })}
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[13px] font-bold uppercase text-muted-foreground">Priority (1-10)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={newJob.priority}
                                    onChange={(e) => setNewJob({ ...newJob, priority: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[13px] font-bold uppercase text-muted-foreground">CWD</label>
                            <input
                                className="w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={newJob.cwd}
                                onChange={(e) => setNewJob({ ...newJob, cwd: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-6">
                            <Button type="button" variant="ghost" className="text-xs" onClick={onClose}>Discard</Button>
                            <Button type="submit" disabled={isSubmitting} className="px-8 shadow-lg shadow-primary/20">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Launch'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
