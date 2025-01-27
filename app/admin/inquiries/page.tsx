'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Inquirie } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
// import AddModal from './add-inquirie-modal';
// import EditModal from './edit-inquirie-modal';
// import DeleteModal from './delete-inquirie-modal';

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

const columns: Column<Inquirie>[] = [
    {
        key: 'user',
        label: 'Agent',
        render: (data) => (
            <div className="truncate">
                <span>{data.user?.name || 'N/A'}</span>
            </div>
        ),
    },
    {
        key: 'first_name',
        label: 'Full Name',
        render: (data) => (
            <div className="truncate">
                <span>
                    {data.first_name} {data.last_name}
                </span>
            </div>
        ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type' },
    { key: 'message', label: 'Message' },

];

export default function Property() {
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Inquirie[] }>(
        'https://abicmanpowerservicecorp.com/api/inquiries',
        fetchWithToken
    );

    const [inquiries, setArticles] = useState<Inquirie[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Inquirie | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setArticles(data.records);
        }
    }, [data]);

    const handleAction = (inquirie: Inquirie) => {
        setSelectedArticle(inquirie);
        setEditModalOpen(true);
    };

    const handleDelete = (inquirie: Inquirie) => {
        setSelectedArticle(inquirie);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedArticle(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedArticle(null);
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
                <h1 className="text-2xl font-bold mb-4">Inquiries Table</h1>
                {/* <AddModal mutate={mutate} /> */}
            </div>
            <DataTable<Inquirie>
                data={inquiries}
                columns={columns}
                itemsPerPage={5}
            // onAction={handleAction}
            // onDelete={handleDelete}
            />
            {/* {selectedArticle && (
                <EditModal
                    inquirie={selectedArticle}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedArticle && (
                <DeleteModal
                    inquirie={selectedArticle}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )} */}
        </main>
    );
}
