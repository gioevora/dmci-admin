'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Submissions } from '@/app/utils/types';
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

const columns: Column<Submissions>[] = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'property', label: 'Property' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'price', label: 'Price'}, // Display price as it is
    { key: 'area', label: 'Area'}, // Display area as it is
    { key: 'parking', label: 'Parking' },
    { key: 'vacant', label: 'Vacant'},
    { key: 'status', label: 'Status' },
    { key: 'submit_status', label: 'Submit Status' },
    { key: 'unit_number', label: 'Unit Number' },
    { key: 'unit_type', label: 'Unit Type' },
    { key: 'unit_furnish', label: 'Unit Furnish' },
    { key: 'unit_floor', label: 'Unit Floor' },
    { key: 'submitted_by', label: 'Submitted By' },
    { key: 'commission', label: 'Commission', render: (value) => (value ? 'Yes' : 'No') },
    { key: 'terms', label: 'Terms' },
    { key: 'title', label: 'Title' },
    { key: 'turnover', label: 'Turnover' },
    { key: 'lease', label: 'Lease' },
    { key: 'acknowledgment', label: 'Acknowledgment', render: (value) => (value ? 'Yes' : 'No') },
   
];




export default function SubmittedProperties() {
    const [id, setId] = useState<string | null>(null);

    console.log(id)
    useEffect(() => {
        const storedId = sessionStorage.getItem('userId');
        if (storedId) {
            setId(storedId);
        }
    }, []);

    const { data, error } = useSWR<{ code: number; message: string; records: Submissions[] }>(
        `https://abicmanpowerservicecorp.com/api/submissions/${id}`,
        fetchWithToken
    );

    const [submissions, setSubmissions] = useState<Submissions[]>([]);

    useEffect(() => {
        if (data && data.records) {
            setSubmissions(data.records);
        }
    }, [data]);

    const handleAction = (submission: Submissions) => {
        console.log('Action clicked for submission:', submission);
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
                <h1 className="text-2xl font-bold mb-4">Submissions Table</h1>
            </div>
            <DataTable<Submissions>
                data={submissions}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
        </main>
    );
}
