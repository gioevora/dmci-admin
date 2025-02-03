'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Inquiry } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
// import AddModal from './add-inquiry-modal';
import EditModal from './edit-inquiry-modal';
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Link } from "@heroui/react";
// import DeleteModal from './delete-inquiry-modal';

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
        {
            key: 'id',
            label: 'Action',
            render: (data) => (
                <div className="truncate">
                    <Button
                        className='bg-violet-500 text-white'
                        onClick={() => handleAction(data)}
                        size="sm"
                    >
                        Reply
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
        <section className="py-12 px-4 md:px-12">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-violet-800 uppercase text-center">Inquiries</h1>
                    <Breadcrumbs>
                        <BreadcrumbItem>
                            <Link href="/">Home</Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <Link href="/properties">Inquiry</Link>
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>
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
            {/* 
            {selectedInquiry && (
                <DeleteModal
                    inquiry={selectedInquiry}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )} */}
        </section>
    );
}

