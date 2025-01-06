'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

// import AddUserModal from './add-user-modal';
import { DataTable } from '@/components/data-table';
import { Column, Submission } from '@/app/utils/types';
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

const columns: Column<Submission>[] = [
    { key: 'id', label: 'ID' },
    { key: 'user_id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'property', label: 'Property' },
    // { key: 'type', label: 'Type' },
    // { key: 'location', label: 'Location' },
    // { key: 'price', label: 'Price' },
    // { key: 'area', label: 'Area (sq.ft)' },
    // { key: 'parking', label: 'Parking' },
    // { key: 'vacant', label: 'Vacant' },
    // { key: 'nearby', label: 'Nearby' },
    // { key: 'description', label: 'Description' },
    // { key: 'sale', label: 'Sale Status' },
    // { key: 'badge', label: 'Badge' },
    // { key: 'status', label: 'Status' },
    // { key: 'submit_status', label: 'Submit Status' },
    // { key: 'unit_number', label: 'Unit Number' },
    // { key: 'unit_type', label: 'Unit Type' },
    // { key: 'unit_furnish', label: 'Unit Furnish' },
    // { key: 'unit_floor', label: 'Unit Floor' },
    // { key: 'submitted_by', label: 'Submitted By' },
    // { key: 'commission', label: 'Commission' },
    // { key: 'terms', label: 'Terms' },
    // { key: 'title', label: 'Title' },
    // { key: 'turnover', label: 'Turnover Date' },
    // { key: 'lease', label: 'Lease Term' },
    // { key: 'acknowledgment', label: 'Acknowledgment' },
    // { key: 'amenities', label: 'Amenities' },
    // { key: 'images', label: 'Images' },
    // { key: 'created_at', label: 'Created At' },
    // { key: 'updated_at', label: 'Updated At' },
];



export default function Home() {
    const { data, error } = useSWR<{ code: number; message: string; records: Submission[] }>(
        'https://abicmanpowerservicecorp.com/api/schedules',
        fetchWithToken
    );

    const [users, setUser] = useState<Submission[]>([]);
    const [selectedUser, setSelectedUser] = useState<Submission | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (data && data.records) {
            setUser(data.records);
        }
    }, [data]);

    const handleAction = (user: Submission) => {
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
                <h1 className="text-2xl font-bold mb-4">Submission Table</h1>
                {/* <AddUserModal /> */}
            </div>
            <DataTable<Submission>
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
