import { useState, useRef, useCallback } from 'react';
import { api } from '@/lib/api';

export const useJobLogs = () => {
    const [logs, setLogs] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stopStreaming = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsStreaming(false);
    }, []);

    const fetchLogs = useCallback(async (id: string) => {
        stopStreaming();
        setLogs('');
        setError(null);
        try {
            const data = await api.jobs.logs(id) as string;
            setLogs(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch logs');
        }
    }, [stopStreaming]);

    const startStreaming = useCallback(async (id: string) => {
        stopStreaming();

        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsStreaming(true);
        setLogs('');
        setError(null);

        try {
            const response = await api.jobs.logs(id, true, controller.signal) as Response;
            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                setLogs(prev => prev + chunk);
            }
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'Streaming stopped unexpectedly');
            }
        } finally {
            setIsStreaming(false);
        }
    }, [stopStreaming]);

    return {
        logs,
        isStreaming,
        error,
        fetchLogs,
        startStreaming,
        stopStreaming
    };
};
