'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column, Application } from '@/app/utils/types';
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react';
import fetchWithToken from '@/app/utils/fetch-with-token';

interface ApplicationTableProps {
    career_id: string;
}

const columns: Column<Application>[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    {
        key: 'resume',
        label: 'Resume',
        render: (application) => (
            <>
                <div className="flex gap-4 justify-center">
                    <a
                        href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/applications/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                    >
                        View / Download
                    </a>
                    {/* <a
                        href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/applications/${application.resume}`}
                        download
                        className="text-blue-500"
                    >
                        Download
                    </a> */}
                </div>
            </>
        ),
    },
];

const ApplicationTable: React.FC<ApplicationTableProps> = ({ career_id }) => {
    const handleDownload = (url: string, filename: string) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

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
