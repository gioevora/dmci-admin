'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Inquiry } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import EditModal from './edit-inquiry-modal';
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Link } from "@heroui/react";
import DeleteModal from './delete-inquiry-modal';
import fetchWithToken from '@/app/utils/fetch-with-token';

export default function Property() {
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Inquiry[] }>(
        'https://abicmanpowerservicecorp.com/api/inquiries',
        fetchWithToken
    );

    const columns: Column<Inquiry>[] = [
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
        { key: 'status', label: 'Status' },
        {
            key: 'id',
            label: 'Action',
            render: (data) => (
                <div className="flex gap-2">
                    <Button
                        className='bg-violet-500 text-white'
                        onClick={() => handleAction(data)}
                        size="sm"
                    >
                        Reply
                    </Button>
                    <Button
                        className='bg-red-500 text-white'
                        onClick={() => handleDelete(data)}
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const [inquiries, setArticles] = useState<Inquiry[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setArticles(data.records);
        }
    }, [data]);

    const handleAction = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setEditModalOpen(true);
    };

    const handleDelete = (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedInquiry(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedInquiry(null);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-violet-800 uppercase">Inquiries</h1>
            </div>


            <div className='py-6'>
                <Card>
                    <CardBody>

                        <DataTable<Inquiry>
                            data={inquiries}
                            columns={columns}
                            itemsPerPage={5}
                        // onAction={handleAction}
                        // onDelete={handleDelete}
                        />
                    </CardBody>
                </Card>
            </div>

            {selectedInquiry && (
                <EditModal
                    inquiry={selectedInquiry}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}

            {selectedInquiry && (
                <DeleteModal
                    inquiry={selectedInquiry}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}

