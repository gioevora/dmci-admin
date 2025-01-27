import React from "react";
import PropertyDetails from "./property-deets-card";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ property_id: string }>;
}) {
    const { property_id } = await params;

    return <PropertyDetails property_id={property_id} />;
}
