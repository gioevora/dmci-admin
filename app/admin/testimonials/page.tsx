'use client';

import useSWR from 'swr';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table';
import { Column, Testimonial } from '@/app/utils/types';
import AddTestimonialModal from './add-testimonial-modal';
import DeleteTestimonial from './delete-testimonial-modal';
import EditTestimonialModal from './edit-testimonial-modal';
import LoadingDot from '@/components/loading-dot';
import { Card, CardBody } from '@heroui/react';
import SeeMoreText from '@/components/see-more-text';

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

const columns: Column<Testimonial>[] = [
    // { key: 'id', label: 'ID' },
    // { key: 'user_id', label: 'User ID' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'message', label: 'Message', render: (data) => <div className="w-[500px] lg:w-[800px]"><SeeMoreText text={data.message || "No message"} /></div> },
];

export default function TestimonialsPage() {
    const { data, error, mutate } = useSWR<{
        code: number;
        message: string;
        records: Testimonial[];
    }>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`, fetchWithToken);

    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

    useEffect(() => {
        if (data && data.records) {
            setTestimonials(data.records);
        }
    }, [data]);

    const handleAction = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setEditModalOpen(true);
    };

    const handleDelete = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
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
                <h1 className="text-2xl font-semibold text-violet-800 uppercase">Testimonial</h1>
                <AddTestimonialModal mutate={mutate} />
            </div>

            <div className='py-6'>
                <Card>
                    <CardBody>
                        <DataTable<Testimonial>
                            data={testimonials}
                            columns={columns}
                            itemsPerPage={5}
                            onAction={handleAction}
                            onDelete={handleDelete}
                        />
                    </CardBody>
                </Card>
            </div>


            {selectedTestimonial && (
                <EditTestimonialModal
                    testimonial={selectedTestimonial}
                    isOpen={isEditModalOpen}
                    mutate={mutate}
                    onClose={handleCloseEditModal}
                />
            )}
            {selectedTestimonial && (
                <DeleteTestimonial
                    testimonial={selectedTestimonial}
                    isOpen={isDeleteModalOpen}
                    mutate={mutate}
                    onClose={handleCloseDeleteModal}
                />
            )}
        </section>
    );
}
