'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import AddUserModal from './add-user-modal';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import HamsterWheel from '@/components/loading-hamster-wheel';
import EditUserModal from './edit-user-modal';

type User = {
    id: number;
    name: string;
    email: string;
};

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

const columns: Column<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

export default function Home() {
    const { data, error } = useSWR<{ code: number; message: string; records: User[] }>(
        'https://abicmanpowerservicecorp.com/api/users',
        fetchWithToken
    );

    const [users, setUser] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (data && data.records) {
            setUser(data.records);
        }
    }, [data]);

    const handleAction = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <HamsterWheel />;
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">User Table</h1>
                <AddUserModal />
            </div>
            <DataTable<User>
                data={users}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </main>
    );
}
