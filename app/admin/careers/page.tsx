'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import Link from 'next/link'

import { DataTable } from '@/components/data-table';
import { Column, Career } from '@/app/utils/types';
import AddCareerModal from './add-career-modal';
import EditCertificateModal from './edit-career-modal';
import DeleteModal from './delete-career-modal';
import { Button, Card, CardBody } from "@heroui/react";
import LoadingDot from '@/components/loading-dot';

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

const columns: Column<Career>[] = [
    // { key: 'id', label: 'ID' },
    { key: 'position', label: 'Position' },
    { key: 'slots', label: 'Slots' },
    {
        key: 'applications_count', label: 'Applicants', render: (career) => (
            <Link href={`/admin/careers/${career.id}`}>
                <Button size="sm" className="w-full">
                    {career.applications_count}
                </Button >
            </Link>
        ),
    },
    {
        key: 'image',
        label: 'Image',
        render: (career) => (
            <img
                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/careers/images/${career.image}`}
                alt={career.image}
                className="h-12 w-12 object-contain"
            />
        ),
    },
];

export default function CertificatesPage() {
    const { data, error, mutate } = useSWR<{
        code: number;
        message: string;
        records: Career[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/careers`, fetchWithToken);

    const [careers, setCareers] = useState<Career[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setCareers(data.records);
        }
    }, [data]);

    const handleAction = (career: Career) => {
        setSelectedCareer(career);
        setEditModalOpen(true);
    };

    const handleDelete = (career: Career) => {
        setSelectedCareer(career);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedCareer(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedCareer(null);
    };

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-violet-800 uppercase">Careers</h1>
                <AddCareerModal mutate={mutate} />
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Career>
                            data={careers}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            onDelete={handleDelete}
                        />
                    </CardBody>
                </Card>
            </div>

            {selectedCareer && (
                <EditCertificateModal
                    career={selectedCareer}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedCareer && (
                <DeleteModal
                    career={selectedCareer}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}
