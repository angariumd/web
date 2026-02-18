import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Node } from '@/types';

export const useNodes = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNodes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.nodes.list();
            setNodes(data);
        } catch (error) {
            console.error('Failed to fetch nodes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNodes();
        const interval = setInterval(() => {
            api.nodes.list().then(setNodes).catch(console.error);
        }, 5000);
        return () => clearInterval(interval);
    }, [fetchNodes]);


    const sortedNodes = [...nodes].sort((a, b) => {
        if (a.status === 'UP' && b.status !== 'UP') return -1;
        if (a.status !== 'UP' && b.status === 'UP') return 1;
        return 0;
    });

    return {
        nodes: sortedNodes,
        loading,
        fetchNodes
    };
};
