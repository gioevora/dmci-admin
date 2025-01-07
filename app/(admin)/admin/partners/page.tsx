'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Partner } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import AddPartnerModal from './add-partner-modal';
import EditPartnerModal from './edit-partner-modal';
import DeletePartnerModal from './delete-partner-modal';

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

const columns: Column<Partner>[] = [
    { key: 'name', label: 'Name' },
    {
        key: 'image',
        label: 'Logo',
        render: (partner) => (
            <img
                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/partners/${partner.image}`}
                alt={partner.image}
                className="h-12 w-12 object-contain"
            />
        ),
    },
];

export default function Property() {
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Partner[] }>(
        'https://abicmanpowerservicecorp.com/api/partners',
        fetchWithToken
    );

    const [partners, setPartners] = useState<Partner[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setPartners(data.records);
        }
    }, [data]);

    const handleAction = (partner: Partner) => {
        setSelectedPartner(partner);
        setEditModalOpen(true);
    };

    const handleDelete = (partner: Partner) => {
        setSelectedPartner(partner);
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
                <h1 className="text-2xl font-bold mb-4">Partner Table</h1>
                <AddPartnerModal  mutate={mutate} />
            </div>
            <DataTable<Partner>
                data={partners}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                onDelete={handleDelete} 
            />
            {selectedPartner && (
                <EditPartnerModal
                    partner={selectedPartner}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedPartner && (
                <DeletePartnerModal
                    partner={selectedPartner}
                    isOpen={isDeleteModalOpen} 
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </main>
    );
}
