"use client";
import { Button, Card, CardBody, Checkbox, CheckboxGroup, Divider, Select, SelectItem, } from "@heroui/react";
import React, { useState } from "react";
import { Field, Form, Formik, } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

import type { PropertyRecord } from '@/app/utils/types';
import { fetchWithToken, status, parking, type, furnished, amenities, } from "@/app/admin/property/utils/option";
import CustomInput from "@/components/input";


interface PropertyEditProps {
    property_id: string
}

const validationSchema = Yup.object({
    // Property Information
    name: Yup.string().required("Property name is required"),
    unit_type: Yup.string().required("Unit Type is required"),
    unit_status: Yup.string().required("Unit Status is required"),
    location: Yup.string().required("Location is required"),
    price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Property price is required"),
    area: Yup.number()
        .typeError("Square meter must be a number")
        .positive("Square meter must be positive")
        .required("Square meter is required"),
    unit_number: Yup.number()
        .typeError("Floor number must be a number")
        .positive("Floor number must be positive")
        .required("Floor number is required"),
    parking: Yup.boolean().required("Parking is required"),
    status: Yup.string().required("Property Status is required"),
});

const PropertyEdit: React.FC<PropertyEditProps> = ({ property_id }) => {
    const { data, error, isLoading, mutate } = useSWR<PropertyRecord>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${property_id}`, fetchWithToken,)
    const property = data?.record;
    const parseAmenities = JSON.parse(property?.amenities || "[]")
    const [selectedAmenities, setSelectedAmenities] = React.useState(parseAmenities);

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            console.log(values)
            const token = sessionStorage.getItem("token")
            await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            toast.success("Description updated successfully!")
            mutate()
        } catch (error) {
            console.error("Error updating description:", error)
            toast.error("Failed to update description.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full mt-8">
            <Toaster position="top-center" reverseOrder={false} />
            <Card className="w-full">
                <CardBody>
                    <h1 className="text-2xl  font-bold underline">
                        Property Information
                    </h1>
                    <Formik
                        initialValues={{
                            id: property_id,

                            // Property Information
                            name: property?.name || "",
                            location: property?.location || "",
                            price: property?.price || "",
                            area: property?.area || "",
                            parking: property?.parking || false,
                            description: property?.description || "N/A",

                            // Unit Details
                            unit_number: property?.unit_number || "",
                            unit_type: property?.unit_type || "",
                            unit_status: property?.unit_status || "",

                            // Additional Information
                            title: property?.title || "N/A",
                            payment: property?.payment || "N/A",
                            turnover: property?.turnover || "N/A",
                            terms: property?.terms || "N/A",

                            // Category & Badge Information
                            category: property?.category || "",
                            badge: property?.badge || "",
                            published: property?.published ? "1" : "0",

                            status: property?.status || "",
                            sale_type: property?.sale_type || "N/A",

                            amenities: selectedAmenities,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, setFieldValue }) => (
                            <Form className="space-y-4">
                                <CustomInput
                                    name="name"
                                    label="Property Name"
                                    type="text"
                                    error={touched.name ? errors.name : undefined}
                                />
                                <Field as={Select}
                                    label="Unit Type"
                                    name="unit_type"
                                    variant="underlined"
                                    defaultSelectedKeys={property?.unit_type ? [String(property.unit_type)] : []}
                                >
                                    {type.map((type) => (
                                        <SelectItem key={type.key}>{type.label}</SelectItem>
                                    ))}
                                </Field>
                                <Field as={Select}
                                    label="Unit Status"
                                    name="unit_status"
                                    variant="underlined"
                                    defaultSelectedKeys={property?.unit_status ? [String(property.unit_status)] : []}

                                >
                                    {furnished.map((furnished) => (
                                        <SelectItem key={furnished.key}>
                                            {furnished.label}
                                        </SelectItem>
                                    ))}
                                </Field>
                                <CustomInput
                                    name="location"
                                    label="Location"
                                    type="text"
                                    error={touched.location ? errors.location : undefined}
                                />
                                <CustomInput
                                    name="price"
                                    label="Property Price"
                                    type="text"
                                    error={touched.price ? errors.price : undefined}
                                />
                                <CustomInput
                                    name="area"
                                    label="Square Meter"
                                    type="text"
                                    error={touched.area ? errors.area : undefined}
                                />
                                <CustomInput
                                    name="unit_number"
                                    label="Floor Number"
                                    type="text"
                                    error={touched.unit_number ? errors.unit_number : undefined}
                                />
                                <Field as={Select}
                                    label="Parking"
                                    name="parking"
                                    variant="underlined"
                                    defaultSelectedKeys={property?.parking ? [String(property.parking)] : []}
                                >
                                    {parking.map((parking) => (
                                        <SelectItem key={parking.key}>{parking.label}</SelectItem>
                                    ))}
                                </Field>
                                <Field as={Select}
                                    label="Property Status"
                                    name="status"
                                    variant="underlined"
                                    defaultSelectedKeys={property?.status ? [String(property.status)] : []}
                                >
                                    {status.map((statusItem) => (
                                        <SelectItem key={statusItem.key} value={statusItem.key}>
                                            {statusItem.label}
                                        </SelectItem>
                                    ))}
                                </Field>
                                <Divider />
                                Features and Amenties
                                <CheckboxGroup
                                    color="primary"
                                    orientation="horizontal"
                                    value={selectedAmenities}
                                    onValueChange={(values) => {
                                        setSelectedAmenities(values);
                                        setFieldValue("amenities", values);
                                    }}
                                >
                                    {amenities.map((amenitiesItem) => (
                                        <Checkbox key={amenitiesItem.key} value={amenitiesItem.key}>
                                            {amenitiesItem.label}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                                <p className="text-default-500 text-small">Selected: {selectedAmenities.join(", ")}</p>

                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </div >
    );
};

export default PropertyEdit;