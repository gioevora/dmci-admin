"use client";

import { Tabs, Tab, Card, CardBody } from "@heroui/react"
import PropertyDetails from "./property-deets-card";
import PropertyEdit from "./property-edit";

interface PropertyDetailsTabsProps {
    property_id: string
}

const PropertyDetailsTabs: React.FC<PropertyDetailsTabsProps> = ({ property_id }) => {
    return (
        <section className="py-12 px-4 md:px-12">
            <Tabs aria-label="Options">
                <Tab key="details" title="Property Details">
                    <PropertyDetails property_id={property_id} />
                </Tab>
                <Tab key="update" title="Update Property">
                    <PropertyEdit property_id={property_id} />
                </Tab>
            </Tabs>
        </section>
    );
}

export default PropertyDetailsTabs