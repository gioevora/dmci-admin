import React from 'react';
import ApplicationTable from './application_table';

export default async function ProductPage({
    params,
}: {
    params: Promise<{ career_id: string }>;
}) {
    const { career_id } = await params;

    return <ApplicationTable career_id={career_id} />;
}