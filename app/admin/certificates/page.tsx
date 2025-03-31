'use client';

import "lightbox2/dist/css/lightbox.min.css";
import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column, Certificate } from '@/app/utils/types';
import AddTestimonialModal from './add-certificate-modal';
import DeleteCertificateModal from './delete-certificate-modal';
import EditCertificateModal from './edit-certificate-modal';
import LoadingDot from '@/components/loading-dot';
import { Card, CardBody } from '@heroui/react';
import fetchWithToken from "@/app/utils/fetch-with-token";

const columns: Column<Certificate>[] = [
    // { key: 'id', label: 'ID' },
    // { key: 'user_id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date' },
    {
        key: 'image',
        label: 'Image',
        render: (certificate) => (
            <a
                data-lightbox="gallery"
                data-title={certificate.name}
                href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/certificates/${certificate.image}`}
            >
                <img
                    alt={certificate.name}
                    className="h-24 w-24 object-cover"
                    src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/certificates/${certificate.image}`}
                />
            </a>
        ),
    },
];

export default function CertificatesPage() {
    const { data, error, mutate } = useSWR<{
        code: number;
        message: string;
        records: Certificate[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certificates`, fetchWithToken);

    const [certificates, setTestimonials] = useState<Certificate[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCertificate, setSelectedTestimonial] = useState<Certificate | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            require("lightbox2");
        }
    }, []);

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
        <section className="pt-16 px-4 md:px-12">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Certificates</h1>
                <AddTestimonialModal mutate={mutate} />
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

            {selectedCertificate && (
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
            )}
        </section>
    );
}
