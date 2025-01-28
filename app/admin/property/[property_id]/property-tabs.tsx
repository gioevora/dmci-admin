"use client";

import { Tabs, Tab, Card, CardBody } from "@nextui-org/react"
import PropertyDetails from "./property-deets-card";
import PropertyEdit from "./property-edit";

interface PropertyDetailsTabsProps {
    property_id: string
}

const PropertyDetailsTabs: React.FC<PropertyDetailsTabsProps> = ({ property_id }) => {
    return (
        <main className="container mx-auto p-4">
            <Tabs aria-label="Options">
                <Tab key="details" title="Details">
                    <PropertyDetails property_id={property_id} />
                </Tab>
                <Tab key="update" title="Update">
                    <PropertyEdit property_id={property_id} />
                </Tab>
            </Tabs>
        </main>
    );
}

export default PropertyDetailsTabs