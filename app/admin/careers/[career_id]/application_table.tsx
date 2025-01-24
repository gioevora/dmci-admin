'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column, Application } from '@/app/utils/types';
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react';

interface ApplicationTableProps {
    career_id: string;
}

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

const columns: Column<Application>[] = [
    { key: 'id', label: 'ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    {
        key: 'resume',
        label: 'Resume',
        render: (application) => (
            <a
                href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/applications/${application.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
            >
                View Resume
            </a>
        ),
    },
];

const ApplicationTable: React.FC<ApplicationTableProps> = ({ career_id }) => {
    const { data, error, mutate } = useSWR<{
        code: number;
        message: string;
        record: {
            id: string;
            position: string;
            slots: number;
            image: string;
            applications: Application[];
        };
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/careers/${career_id}`, fetchWithToken);

    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        if (data && data.record && data.record.applications) {
            setApplications(data.record.applications);
        }
    }, [data]);

    return (
        <main className="container mx-auto p-4">
            <div className="flex-col justify-start items-center mb-4">
                <Link color="primary" href="/admin/careers" className="text-primary flex items-center"><ChevronLeft size={20} /> Back</Link>
                <h1 className="text-2xl font-bold">Applications Table</h1>
            </div>
            <DataTable<Application>
                data={applications}
                columns={columns}
                itemsPerPage={5}
            />
        </main>
    );
};

export default ApplicationTable;
