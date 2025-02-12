'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import "lightbox2/dist/css/lightbox.min.css";

import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Partner } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import AddPartnerModal from './add-partner-modal';
import EditPartnerModal from './edit-partner-modal';
import DeletePartnerModal from './delete-partner-modal';
import { Card, CardBody } from '@heroui/react';
import fetchWithToken from '@/app/utils/fetch-with-token';

const columns: Column<Partner>[] = [
    { key: 'name', label: 'Name' },
    {
        key: 'image',
        label: 'Logo',
        render: (partner) => (
            <a
                data-lightbox="gallery"
                data-title={partner.name}
                href={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/partners/${partner.image}`}
            >
                <img
                    alt={partner.name}
                    className="h-24 w-24 object-cover"
                    src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/partners/${partner.image}`}
                />
            </a>
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
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);


    useEffect(() => {
        if (typeof window !== "undefined") {
            require("lightbox2");
        }
    }, []);

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
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between">
                <h1 className="text-2xl font-semibold text-violet-800 mb-4 uppercase">Partner</h1>
                <AddPartnerModal mutate={mutate} />
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Partner>
                            data={partners}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            onDelete={handleDelete} // Pass the handleDelete function
                        />
                    </CardBody>
                </Card>
            </div>


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
                    isOpen={isDeleteModalOpen} // Control delete modal visibility
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}
