import React from "react";
import PropertyDetailsTabs from "./property-tabs";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ property_id: string }>;
}) {
    const { property_id } = await params;

    return (
        <div className="pt-8 px-4 md:px-12">
            <PropertyDetailsTabs property_id={property_id} />
        </div>
    );
}
