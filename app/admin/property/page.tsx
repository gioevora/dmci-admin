'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BsHouseAddFill } from "react-icons/bs";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Link, Spinner } from "@heroui/react";

import { fetchWithToken } from './utils/option';
import type { Property } from '@/app/utils/types';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import DeleteModal from './delete-property-modal';

export default function Property() {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { data, error, mutate } = useSWR<{ code: number; message: string; records: Property[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
        fetchWithToken
    );

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setProperties(data.records);
        }
    }, [data]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <LoadingDot />;
    }

    const updatePropertyStatus = async (id: string, published: '0' | '1') => {
        setLoadingId(id);
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/set-status`,
                { id, published },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            toast.success('Operation Success!');
            mutate();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoadingId(null);
        }
    };

    const handlePublishProperty = (id: string) => updatePropertyStatus(id, '1');
    const handleUnpublishProperty = (id: string) => updatePropertyStatus(id, '0');

    const columns: Column<Property>[] = [
        { key: 'name', label: 'NAME' },
        { key: 'location', label: 'LOCATION' },
        { key: 'status', label: 'STATUS' },
        {
            key: 'price',
            label: 'PRICE',
            render: (property) => `₱${parseFloat(property.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        },
        {
            key: 'action',
            label: 'ACTION',
            render: (data) => (
                <div className="flex gap-2">
                    <Link href={`/admin/property/${data.id}`} className="w-full">
                        <Button size="sm" className="w-full uppercase font-semibold bg-yellow-300 text-yellow-800">
                            Details
                        </Button>
                    </Link>
                    {data.published === 0 ? (
                        <Button
                            onPress={() => handlePublishProperty(data.id)}
                            size="sm"
                            className="min-w-24 w-full bg-violet-200 text-violet-900 font-semibold uppercase"
                            isDisabled={loadingId === data.id}
                        >
                            {loadingId === data.id ? <Spinner color="current" size="sm" /> : "Publish"}
                        </Button>
                    ) : (
                        <Button
                            onPress={() => handleUnpublishProperty(data.id)}
                            size="sm"
                            className="min-w-24 w-full bg-violet-400 text-violet-900 font-semibold uppercase"
                            isDisabled={loadingId === data.id}
                        >
                            {loadingId === data.id ? <Spinner color="current" size="sm" /> : "Unpublish"}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="w-full uppercase font-semibold bg-red-300 text-red-800"
                        onPress={() => handleDelete(data)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        }
    ];

    const handleDelete = (property: Property) => {
        setSelectedProperty(property);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedProperty(null);
    };

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold text-violet-800 uppercase">Properties</h1>
                <Button className='bg-violet-500 text-white capitalize' startContent={<BsHouseAddFill size={16} />} onClick={() => router.push('/admin/property/new-property')}>
                    Add property
                </Button>
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Property>
                            data={properties}
                            columns={columns}
                            itemsPerPage={5}
                        />
                    </CardBody>
                </Card>
            </div>
            {selectedProperty && (
                <DeleteModal
                    property={selectedProperty}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}