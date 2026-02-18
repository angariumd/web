import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Job, NewJobParams } from '@/types';

export const useJobs = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchJobs = useCallback(async () => {
        try {
            const data = await api.jobs.list();
            setJobs(data);
        } catch (error: any) {
            console.error('Failed to fetch jobs:', error);
            // TODO: Move to global error context if needed
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(() => {
            api.jobs.list().then(setJobs).catch(err => console.error('Silent refresh failed:', err));
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchJobs]);

    const submitJob = async (jobParams: NewJobParams) => {
        setIsSubmitting(true);
        try {
            await api.jobs.submit(jobParams);
            fetchJobs();
            return true;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to submit job');
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelJob = async (jobId: string) => {
        try {
            await api.jobs.cancel(jobId);
            fetchJobs();
            return true;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to cancel job');
        }
    };

    return {
        jobs,
        loading,
        fetchJobs,
        submitJob,
        cancelJob,
        isSubmitting
    };
};
