'use client';

import useSWR, { mutate } from 'swr';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Property } from '@/app/utils/types';
import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import LoadingDot from '@/components/loading-dot';
import { Button, Card, CardBody, Link, Spinner } from "@heroui/react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { BsHouseAddFill } from "react-icons/bs";

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
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { data, error } = useSWR<{ code: number; message: string; records: Property[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
        fetchWithToken
    );

    const [properties, setProperties] = useState<Property[]>([]);

    useEffect(() => {
        if (data && data.records) {
            setProperties(data.records);
        }
    }, [data]);

    const handleAction = (property: Property) => {
        console.log('Action clicked for property:', property);
    };

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
            mutate(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`);
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoadingId(null);
        }
    };

    const handlePublishProperty = (id: string) => updatePropertyStatus(id, '1');
    const handleUnpublishProperty = (id: string) => updatePropertyStatus(id, '0');

    const columns: Column<Property>[] = [
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' },
        {
            key: 'price', label: 'Min Price', render: (property) => `₱${parseFloat(property.price).toFixed(2)}`
        },
        {
            key: 'action',
            label: 'Action',
            render: (data) => (
                <div className="flex gap-2">
                    <Link href={`/admin/property/${data.id}`} className="w-full">
                        <Button size="sm" className="w-full">
                            Details
                        </Button>
                    </Link>
                    {data.published === 0 ? (
                        <Button
                            color="primary"
                            onPress={() => handlePublishProperty(data.id)}
                            size="sm"
                            className="min-w-24 w-full"
                            isDisabled={loadingId === data.id}
                        >
                            {loadingId === data.id ? <Spinner color="current" size="sm" /> : "Publish"}
                        </Button>
                    ) : (
                        <Button
                            color="warning"
                            onPress={() => handleUnpublishProperty(data.id)}
                            size="sm"
                            className="min-w-24 w-full"
                            isDisabled={loadingId === data.id}
                        >
                            {loadingId === data.id ? <Spinner color="current" size="sm" /> : "Unpublish"}
                        </Button>
                    )}
                </div>
            ),
        }
    ];

    return (
        <section className="pt-24 px-4 md:px-12">
            <div className="flex flex-col justify-center md:flex-row md:justify-between">
                <h1 className="text-2xl font-semibold text-violet-800 mb-4 uppercase text-center">Property list</h1>
                <Button startContent={<BsHouseAddFill size={16} />} color="primary" onClick={() => router.push('/admin/property/new-property')}>
                    Add new property
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

        </section>
    );
}
