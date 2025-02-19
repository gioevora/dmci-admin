'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column, Certificate } from '@/app/utils/types';

import LoadingDot from '@/components/loading-dot';
import { Card, CardBody } from '@heroui/react';
import AddPhotoModal from './add-photos-modal';

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

const columns: Column<Certificate>[] = [
    // { key: 'id', label: 'ID' },
    // { key: 'user_id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    {
        key: 'image',
        label: 'Logo',
        render: (certificate) => (
            <img
                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/certificates/${certificate.image}`}
                alt={certificate.image}
                className="h-12 w-12 object-contain"
            />
        ),
    },
];

export default function CertificatesPage() {
    const { data, error, mutate } = useSWR<{
        code: number;
        message: string;
        records: Certificate[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`, fetchWithToken);

    const [certificates, setTestimonials] = useState<Certificate[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCertificate, setSelectedTestimonial] = useState<Certificate | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setTestimonials(data.records);
        }
    }, [data]);

    const handleAction = (certificate: Certificate) => {
        setSelectedTestimonial(certificate);
        setEditModalOpen(true);
    };

    const handleDelete = (certificate: Certificate) => {
        setSelectedTestimonial(certificate);
        setDeleteModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedTestimonial(null);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedTestimonial(null);
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
                <h1 className="text-2xl font-bold">Photos Table</h1>
                <AddPhotoModal mutate={mutate} />
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Certificate>
                            data={certificates}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            onDelete={handleDelete}
                        />
                    </CardBody>
                </Card>
            </div>

            {/* {selectedCertificate && (
                <EditCertificateModal
                    certificate={selectedCertificate}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}

            {selectedCertificate && (
                <DeleteCertificateModal
                    certificate={selectedCertificate}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )} */}
        </section>
    );
}
