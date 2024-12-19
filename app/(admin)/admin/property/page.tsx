'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import type { Property } from '@/app/utils/types';
import AddPropertyModal from './add-property-modal';

const fetchWithToken = async (url: string) => {
    const token = sessionStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Only add Authorization header if token exists
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

const columns: Column<Property>[] = [
    { key: 'name', label: 'Name' },
    { key: 'logo', label: 'Logo', render: (property) => <img src={property.logo} alt={property.name} className="h-12 w-12 object-contain" /> },
    { key: 'slogan', label: 'Slogan' },
    { key: 'description', label: 'Description' },
    { key: 'location', label: 'Location' },
    { key: 'min_price', label: 'Min Price', render: (property) => `₱${parseFloat(property.min_price).toFixed(2)}` },
    { key: 'max_price', label: 'Max Price', render: (property) => `₱${parseFloat(property.max_price).toFixed(2)}` },
    { key: 'status', label: 'Status' },
    { key: 'percent', label: 'Percent' },
];


export default function Property() {
    const { data, error } = useSWR<{ code: number; message: string; records: Property[] }>(
        'https://abicmanpowerservicecorp.com/api/properties',
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
        return <div>Loading...</div>;
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Property Table</h1>
                <AddPropertyModal />
            </div>
            <DataTable<Property>
                data={properties}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
        </main>
    );
}
