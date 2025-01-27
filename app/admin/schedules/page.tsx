'use client';

import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column, Schedule } from '@/app/utils/types';
import HamsterWheel from '@/components/loading-hamster-wheel';
import { Button } from '@nextui-org/react';
import toast from 'react-hot-toast';
import axios from 'axios';

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
    {
        key: "user",
        label: "Agent",
        render: (data) => (
            <div className="truncate">
                <span>{data.user?.name || "N/A"}</span>
            </div>
        ),
    },
    {
        key: "first_name",
        label: "Full Name",
        render: (data) => (
            <div className="truncate">
                <span>
                    {data.first_name} {data.last_name}
                </span>
            </div>
        ),
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "type", label: "Type" },
    { key: "properties", label: "Properties" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status" },
    {
        key: "id",
        label: "Action",
        render: (data) => (
            <div className="flex gap-2">
                {data.status === "Pending" ? (
                    <>
                        <Button
                            color="primary"
                            onClick={() => handleAcceptSchedule(data.id)}
                            size="sm"
                        >
                            Accept
                        </Button>
                        <Button
                            color="danger"
                            onClick={() => handleDeclineSchedule(data.id)}
                            size="sm"
                        >
                            Decline
                        </Button>
                    </>
                ) : (
                    <span className="text-gray-500 font-semibold">
                        {data.status}
                    </span>
                )}
            </div>
        ),
    }
];


const handleAcceptSchedule = async (id: string) => {
    try {
        const token = sessionStorage.getItem('token');
        await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/set-status`,
            { id, status: 'Accepted' },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        toast.success('Schedule updated successfully!');
        mutate(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules`);
    } catch {
        toast.error('Failed to update schedule.');
    }
};

const handleDeclineSchedule = async (id: string) => {
    try {
        const token = sessionStorage.getItem('token');
        await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/set-status`,
            { id, status: 'Declined' },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        toast.success('Schedule declined successfully!');
        mutate(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules`);
    } catch {
        toast.error('Failed to decline schedule.');
    }
};

export default function Home() {
    const { data, error } = useSWR<{
        code: number;
        message: string;
        records: Schedule[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules`, fetchWithToken);

    const [users, setUsers] = useState<Schedule[]>([]);

    useEffect(() => {
        if (data?.records) {
            setUsers(data.records);
        }
    }, [data]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <HamsterWheel />;
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Schedule Table</h1>
            </div>
            <DataTable<Schedule> data={users} columns={columns} itemsPerPage={5} />
        </main>
    );
}
