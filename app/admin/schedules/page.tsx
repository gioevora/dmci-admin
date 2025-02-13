'use client';

import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column, Schedule } from '@/app/utils/types';
import { Button, Card, CardBody } from "@heroui/react";
import toast from 'react-hot-toast';
import axios from 'axios';
import LoadingDot from '@/components/loading-dot';
import SeeMoreText from '@/components/see-more-text';

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
        label: "Info",
        render: (data) => (
            <div className="truncate">
                <span>
                    <span className="font-semibold">{data.first_name} {data.last_name} </span> <br />
                    {data.email} <br />
                    {data.phone}
                </span>
            </div>
        ),
    },
    // { key: "phone", label: "Phone" },
    // { key: "email", label: "Email" },
    {
        key: "date",
        label: "Date & Time",
        render: (data) => {
            if (!data.date || !data.time) return "No date & time";

            const dateTimeString = `${data.date} ${data.time}`;
            const dateObj = new Date(dateTimeString);

            return dateObj.toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }
    },
    { key: "type", label: "Type" },
    { key: "properties", label: "Properties" },
    { key: "message", label: "Message", render: (data) => <div><SeeMoreText text={data.message || "No message"} /></div> },
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
        return <LoadingDot />;
    }

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-violet-800 mb-4 uppercase">Schedule Table</h1>
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Schedule> data={users} columns={columns} itemsPerPage={5} />
                    </CardBody>
                </Card>
            </div>


        </section>
    );
}
