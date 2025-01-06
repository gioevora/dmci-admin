'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

// import AddUserModal from './add-user-modal';
import { DataTable } from '@/components/data-table';
import { Column, Item } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import HamsterWheel from '@/components/loading-hamster-wheel';
// import EditUserModal from './edit-user-modal';

const fetchWithToken = async (url: string) => {
    const token = "20|EjfVtOkhFpVoUWpjpLmHHWPRUs07z3SMdbka9kDw5f2e99bf"
    // const token = sessionStorage.getItem('token');

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

    console.log(response);
    return response.json();
};

const columns: Column<Item>[] = [
    { key: 'id', label: 'id' },
    { key: 'name', label: 'user_id' },
    { key: 'image', label: 'name' },
    { key: 'width', label: 'date' },
    { key: 'height', label: 'created_at' },
    { key: 'category', label: 'updated_at' },
    { key: 'created_at', label: 'created_at' },
    { key: 'updated_at', label: 'updated_at' },
];

export default function Home() {
    const { data, error } = useSWR<{ code: number; message: string; records: Item[] }>(
        'https://abicmanpowerservicecorp.com/api/items',
        fetchWithToken
    );

    const [users, setUser] = useState<Item[]>([]);
    const [selectedUser, setSelectedUser] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (data && data.records) {
            setUser(data.records);
        }
    }, [data]);

    const handleAction = (user: Item) => {
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
                <h1 className="text-2xl font-bold mb-4">Item Table</h1>
                {/* <AddUserModal /> */}
            </div>
            <DataTable<Item>
                data={users}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
            {/* {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )} */}
        </main>
    );
}
