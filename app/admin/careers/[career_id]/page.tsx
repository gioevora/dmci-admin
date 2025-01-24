import React from 'react';
import ApplicationTable from './application_table';

export default async function ProductPage({
    params,
}: {
    params: { career_id: string };
}) {
    const { career_id } = await Promise.resolve(params);

    return <ApplicationTable career_id={career_id} />;
}