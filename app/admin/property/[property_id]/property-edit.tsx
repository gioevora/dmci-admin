"use client";
import { Button, Card, CardBody, Checkbox, CheckboxGroup, Divider, Input, Select, SelectItem, } from "@heroui/react";
import React from "react";
import { ErrorMessage, Field, Form, Formik, } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import useSWR from "swr";


import type { PropertyRecord } from '@/app/utils/types';
import { fetchWithToken, status, type, furnished, amenities, agents, sale, payment, parking, rent } from "@/app/admin/property/utils/option";
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
    sale_type: Yup.string().required("Property Sale Type is required"),
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
                    values.amenities.forEach((amenity: string) => formData.append("amenities[]", amenity));
                } else {
                    formData.append(key, key === "parking" ? String(values[key] ? 1 : 0) : values[key]);
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
            toast.error("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <Card className="w-full md:px-6 py-6">
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
                            parking: Boolean(property?.parking),
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
                        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                            <Form className="space-y-4">
                                <h1 className="text-xl font-bold text-violet-800">
                                    Personal Information
                                </h1>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        variant="flat"
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
                                </div>

                                <hr />


                                <h1 className="text-xl font-bold text-violet-800">
                                    Property Information
                                </h1>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <CustomInput
                                        name="name"
                                        label="Property Name"
                                        type="text"
                                        error={touched.name ? errors.name : undefined}
                                    />
                                    <Field as={Select}
                                        label="Unit Type"
                                        name="unit_type"
                                        variant="flat"
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
                                        variant="flat"
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
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                        variant="flat"
                                        defaultSelectedKeys={property?.parking ? ["1"] : ["0"]}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const val = e.target.value === "1";
                                            setFieldValue("parking", val);
                                        }}
                                    >
                                        {parking.map((statusItem) => (
                                            <SelectItem key={statusItem.key} value={statusItem.key}>
                                                {statusItem.label}
                                            </SelectItem>
                                        ))}
                                    </Field>

                                    <ErrorMessage
                                        name="parking"
                                        render={(msg) => <FormikCustomError>{msg}</FormikCustomError>}
                                    />

                                </div>

                                <CustomInput
                                    name="location"
                                    label="Location"
                                    type="text"
                                    error={touched.location ? errors.location : undefined}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Field as={Select}
                                        label="Property Status"
                                        name="status"
                                        variant="flat"
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

                                    {values.status === "For Sale" && (
                                        <>
                                            <Field as={Select}
                                                label="Sale Type"
                                                name="sale_type"
                                                variant="flat"
                                                defaultSelectedKeys={property?.sale_type ? [String(property.sale_type)] : []}
                                            >
                                                {sale.map((statusItem) => (
                                                    <SelectItem key={statusItem.key} value={statusItem.key}>
                                                        {statusItem.label}
                                                    </SelectItem>
                                                ))}
                                            </Field>
                                            <ErrorMessage
                                                name="status"
                                                render={(msg) => <FormikCustomError children={msg} />}
                                            />

                                            {values.sale_type == "RFO" && (
                                                <>
                                                    <Field as={Select}
                                                        label="Payment Type"
                                                        name="payment"
                                                        variant="flat"
                                                        defaultSelectedKeys={property?.payment ? [String(property.payment)] : []}
                                                    >
                                                        {payment.map((statusItem) => (
                                                            <SelectItem key={statusItem.key} value={statusItem.key}>
                                                                {statusItem.label}
                                                            </SelectItem>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage
                                                        name="payment"
                                                        render={(msg) => <FormikCustomError children={msg} />}
                                                    />

                                                    <CustomInput
                                                        name="title"
                                                        label="Title"
                                                        type="text"
                                                        error={touched.title ? errors.title : undefined}
                                                    />
                                                </>
                                            )}

                                            {values.sale_type === "Pre-Selling" && (
                                                <>
                                                    <CustomInput
                                                        name="turnover"
                                                        label="Turnover Date"
                                                        type="date"
                                                        error={touched.turnover ? errors.turnover : undefined}
                                                    />
                                                </>
                                            )}
                                        </>
                                    )}

                                    {values.status === "For Rent" && (
                                        <>
                                            <Field as={Select}
                                                label="Payment Terms"
                                                name="terms"
                                                variant="flat"
                                                defaultSelectedKeys={property?.terms ? [String(property.terms)] : []}
                                            >
                                                {rent.map((statusItem) => (
                                                    <SelectItem key={statusItem.key} value={statusItem.key}>
                                                        {statusItem.label}
                                                    </SelectItem>
                                                ))}
                                            </Field>
                                        </>
                                    )}
                                </div>

                                <Divider />
                                <div className="text-violet-700 font-semibold">
                                    Features and Amenties
                                </div>
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
                                            size="lg"
                                            multiple
                                            accept="image/*"
                                            onChange={(event) => {
                                                const files = event.currentTarget.files;
                                                if (files) {
                                                    form.setFieldValue("images", Array.from(files));
                                                }
                                            }}
                                            variant="flat"
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
                                    Save Changes
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