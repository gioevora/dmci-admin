'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Schedule } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';

const fetchWithToken = async (url: string) => {
    const token = sessionStorage.getItem('token');
    
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return response.json();
};

const columns: Column<Schedule>[] = [
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'message', label: 'Message' },
];

export default function Property() {
    const [id, setId] = useState<string | null>(null);

    console.log(id)
    useEffect(() => {
      const storedId = sessionStorage.getItem('userId');
      if (storedId) {
        setId(storedId);
      }
    }, []);

    const { data, error } = useSWR<{ code: number; message: string; records: Schedule[] }>(
        `https://abicmanpowerservicecorp.com/api/schedules/${id}`,
        fetchWithToken
    );

    const [schedules, setSchedules] = useState<Schedule[]>([]);

    useEffect(() => {
        if (data && data.records) {
            setSchedules(data.records);
        }
    }, [data]);

    const handleAction = (schedule: Schedule) => {
        console.log('Action clicked for schedule:', schedule);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Schedule Table</h1>
            </div>
            <DataTable<Schedule>
                data={schedules}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
        </main>
    );
}
