"use client";
import { Button, Card, CardBody, Checkbox, CheckboxGroup, Divider, Input, Select, SelectItem, } from "@heroui/react";
import React from "react";
import { ErrorMessage, Field, Form, Formik, } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";


import type { PropertyRecord } from '@/app/utils/types';
import { fetchWithToken, status, parking, type, furnished, amenities, agents, } from "@/app/admin/property/utils/option";
import CustomInput from "@/components/input";
import FormikCustomError from "@/components/formik-custom-error";

interface PropertyEditProps {
    property_id: string
}

const validationSchema = Yup.object({
    // Personal Information
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phone: Yup.string()
        .matches(/^[0-9]+$/, "Phone number must be numeric")
        .required("Phone number is required"),
    type: Yup.string().required("Type is required"),

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
    amenities: Yup.array()
        .min(1, "At least one amenity is required")
        .required("Amenities are required"),
});

const PropertyEdit: React.FC<PropertyEditProps> = ({ property_id }) => {
    const { data, mutate } = useSWR<PropertyRecord>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${property_id}`, fetchWithToken,)
    const property = data?.record;
    console.log(property)
    const parseAmenities = JSON.parse(property?.amenities || "[]")
    const [selectedAmenities, setSelectedAmenities] = React.useState(parseAmenities);

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach((key) => {
                if (key === "images") {
                    values.images.forEach((file: File) => formData.append("images[]", file));
                } else if (key === "amenities") {
                    values.amenities.forEach((amenity: string) => formData.append("amenities[]", amenity)); // Fix here
                } else {
                    formData.append(key, values[key]);
                }
            });

            const token = sessionStorage.getItem("token");
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Operation Success!");
            mutate();
        } catch (error) {
            toast.error("Failed to update description.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="w-full mt-8">
            <Card className="w-full">
                <CardBody>
                    <Formik
                        initialValues={{
                            _method: "PUT",
                            id: property_id,

                            // Property Information
                            first_name: property?.owner.first_name || "",
                            last_name: property?.owner.last_name || "",
                            email: property?.owner.email || "",
                            phone: property?.owner.phone || "",
                            type: property?.owner.type || "",

                            // Property Information
                            name: property?.name || "",
                            location: property?.location || "",
                            price: property?.price || "",
                            area: property?.area || "",
                            parking: property?.parking || "",
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
                            // images: property?.images || "N/A",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting, setFieldValue }) => (
                            <Form className="space-y-4">
                                <h1 className="text-2xl  font-bold underline">
                                    Personal Information
                                </h1>
                                <CustomInput
                                    name="first_name"
                                    label="First Name"
                                    type="text"
                                    error={touched.first_name ? errors.first_name : undefined}
                                />
                                <CustomInput
                                    name="last_name"
                                    label="Last Name"
                                    type="text"
                                    error={touched.last_name ? errors.last_name : undefined}
                                />
                                <CustomInput
                                    name="email"
                                    label="Email"
                                    type="email"
                                    error={touched.email ? errors.email : undefined}
                                />
                                <CustomInput
                                    name="phone"
                                    label="Phone"
                                    type="number"
                                    error={touched.phone ? errors.phone : undefined}
                                />
                                <Field as={Select}
                                    label="Type"
                                    name="type"
                                    variant="underlined"
                                    defaultSelectedKeys={property?.owner.type ? [String(property.owner.type)] : []}
                                >
                                    {agents.map((agent) => (
                                        <SelectItem key={agent.key} value={agent.key}>
                                            {agent.label}
                                        </SelectItem>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="type"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
                                <h1 className="text-2xl  font-bold underline">
                                    Property Information
                                </h1>
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
                                <ErrorMessage
                                    name="unit_type"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
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
                                <ErrorMessage
                                    name="unit_status"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
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
                                    {parking.map((item) => (
                                        <SelectItem key={item.key} value={String(item.key)}>{item.label}</SelectItem>
                                    ))}
                                </Field>

                                <ErrorMessage
                                    name="parking"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
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
                                <ErrorMessage
                                    name="status"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
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
                                <ErrorMessage
                                    name="amenities"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
                                <p className="text-default-500 text-small">Selected: {selectedAmenities.join(", ")}</p>
                                <Field name="images">
                                    {({ form }: { form: any }) => (
                                        <Input
                                            id="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(event) => {
                                                const files = event.currentTarget.files;
                                                if (files) {
                                                    form.setFieldValue("images", Array.from(files));
                                                }
                                            }}
                                            variant="underlined"
                                        />
                                    )}
                                </Field>
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting}
                                >
                                    Save
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