'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Item } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import AddPartnerModal from './add-item-modal';
import EditPartnerModal from './edit-item-modal';
import DeletePartnerModal from './delete-item-modal';

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

const columns: Column<Item>[] = [
    { key: 'id', label: 'id' },
    { key: 'name', label: 'Name' },
    {
        key: 'image',
        label: 'Image',
        render: (item) => (
            <img
                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/items/${item.image}`}
                alt={item.image}
                className="h-12 w-12 object-contain"
            />
        ),
    },
    { key: 'width', label: 'Width' },
    { key: 'height', label: 'Height' },
    { key: 'type', label: 'Type' },
];

export default function Property() {
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Item[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/items`,
        fetchWithToken
    );

    const [items, setItems] = useState<Item[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [selectedItem, setSelectedPartner] = useState<Item | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setItems(data.records);
        }
    }, [data]);

    const handleAction = (item: Item) => {
        setSelectedPartner(item);
        setEditModalOpen(true);
    };

    const handleDelete = (item: Item) => {
        setSelectedPartner(item);
        setDeleteModalOpen(true); // Open delete modal
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedPartner(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false); // Close delete modal
        setSelectedPartner(null);
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
                <h1 className="text-2xl font-bold mb-4">Item Table</h1>
                <AddPartnerModal mutate={mutate} />
            </div>
            <DataTable<Item>
                data={items}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                onDelete={handleDelete} // Pass the handleDelete function
            />
            {selectedItem && (
                <EditPartnerModal
                    item={selectedItem}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedItem && (
                <DeletePartnerModal
                    item={selectedItem}
                    isOpen={isDeleteModalOpen} // Control delete modal visibility
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </main>
    );
}
