"use client";
import {
    Button,
    Card,
    CardBody,
    Divider,
    Input,
    Select,
    SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaArrowRightLong, } from "react-icons/fa6";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";


export const agents = [
    { key: "Owner", label: "Owner" },
    { key: "Agent", label: "Agent" },
    { key: "Broker", label: "Broker" },
];

const agreementMessages: Record<string, string> = {
    Owner:
        "I agree to provide 1 month full commission when renting out and another 1 month for renewal.",
    Agent: "I agree to a 50/50 commission sharing on the transaction.",
    Broker: "I agree to a 60/40 commission sharing on the transaction.",
};

export const status = [
    { key: "For Rent", label: "For Rent" },
    { key: "For Sale", label: "For Sale" },
];

export const parking = [
    { key: "0", label: "With Parking" },
    { key: "1", label: "No Parking" },
];

export const type = [
    { key: "Studio Type", label: "Studio Type" },
    { key: "1BR", label: "1BR" },
    { key: "2BR", label: "2BR" },
    { key: "3BR", label: "3BR" },
    { key: "Loft", label: "Loft" },
    { key: "Penthouse", label: "Penthouse" },
];

export const furnished = [
    { key: "Bare", label: "Bare" },
    { key: "Semi-Furnished", label: "Semi-Furnished" },
    { key: "Fully-Furnished", label: "Fully-Furnished" },
    { key: "Interiored", label: "Interiored" },
];

export const rent = [
    { key: "6 Months", label: "6 Months" },
    { key: "1 Year", label: "1 Year" },
    { key: "2 Year", label: "2 Years" },
];

export const sale = [
    { key: "RFO", label: "RFO" },
    { key: "Pre-Selling", label: "Pre-Selling" },
];

export const payment = [
    { key: "Cash", label: "Cash" },
    { key: "Bank Financing", label: "Bank Financing" },
];

export const amenities = [
    { key: "Pool Area", label: "Pool Area" },
    { key: "Balcony/Terrace", label: "Balcony/Terrace" },
    { key: "Elevator", label: "Elevator" },
    { key: "Guest Suite", label: "Guest Suite" },
    { key: "Club House", label: "Club House" },
    { key: "Concerierge Services", label: "Concerierge Services" },
    { key: "Underground Parking", label: "Underground Parking" },
    { key: "Gym/Fitnes Center", label: "Gym/Fitnes Center" },
    { key: "Security", label: "Security" },
    { key: "Pet-Friendly Facilities", label: "Pet-Friendly Facilities" },
];

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
        .of(Yup.string())
        .min(1, "At least one amenity is required")
        .required("Amenities are required"),
    images: Yup.mixed().required('Image is required'),
});

const NewPropertyPage = () => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedtPayment, setSelectedPayment] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [propertyStatus, setPropertyStatus] = useState("");

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            type: "",

            name: "",
            location: "",
            price: "",
            area: "",
            parking: "",
            description: "N/A",

            unit_number: "",
            unit_type: "",
            unit_status: "",

            title: "N/A",
            payment: "N/A",
            turnover: "N/A",
            terms: "N/A",


            category: "",
            badge: "",
            published: "1",

            status: "",
            sale_type: "N/A",
            amenities: [] as string[],
            images: "",
        },
        validationSchema,

        onSubmit: async (values, { resetForm }) => {
            setLoading(true);

            try {
                const formData = new FormData();
                const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`;
                const token = sessionStorage.getItem('token');

                Object.entries(values).forEach(([key, value]: [string, unknown]) => {
                    if (key === "images" && value instanceof FileList) {

                        Array.from(value).forEach((file) => {
                            formData.append("images[]", file);
                        });
                    } else if (key === "amenities" && Array.isArray(value)) {
                        value.forEach((amenity) => {
                            formData.append("amenities[]", amenity);
                        });
                    } else if (typeof value === "string" || typeof value === "number") {
                        // Append other fields
                        formData.append(key, value.toString());
                    }
                });

                const response = await axios.post(endpoint, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                toast.success("Inquiry submitted successfully!");
                resetForm();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        toast.error(
                            error.response.data.message ||
                            "Failed to submit inquiry. Please try again later."
                        );
                    } else if (error.request) {
                        toast.error("No response from server. Please try again later.");
                    }
                } else {
                    toast.error("Unexpected error occurred. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        }

    });

    const handleStatusChange = (value: string): void => {
        setSelectedStatus(value);
    };

    const handlePaymentChange = (value: string): void => {

        setSelectedPayment(value);
    };


    return (
        <div className="w-full mt-8">
            <Toaster position="top-center" reverseOrder={false} />
            <form onSubmit={formik.handleSubmit}>
                <Card className="w-full">
                    <CardBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 md:px-6">
                            <div className="col-span-2 py-6">
                                <h1 className="text-2xl  font-bold underline">
                                    Personal Information
                                </h1>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    label="First Name"
                                    name="first_name"
                                    placeholder="eg. Juan"
                                    type="text"
                                    value={formik.values.first_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.first_name && formik.errors.first_name && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    label="Last Name"
                                    name="last_name"
                                    placeholder="eg. Dela Cruz"
                                    type="text"
                                    value={formik.values.last_name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.last_name && formik.errors.last_name && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.last_name}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    label="Email"
                                    name="email"
                                    placeholder="eg. juandelacruz@gmail.com"
                                    type="email"
                                    value={formik.values.email}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    placeholder="eg. 09924401097"
                                    type="number"
                                    value={formik.values.phone}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.phone && formik.errors.phone && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Select
                                    label="Type"
                                    name="type"
                                    placeholder="Select Type"
                                    value={formik.values.type}
                                    onChange={(e) =>
                                        formik.setFieldValue("type", e.target.value)
                                    }
                                >
                                    {agents.map((agent) => (
                                        <SelectItem key={agent.key} value={agent.key}>
                                            {agent.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formik.touched.type && formik.errors.type && (
                                    <p className="text-red-500 text-sm">
                                        {formik.errors.type}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                {formik.values.type && (
                                    <>
                                        <div className="col-span-2 md:col-span-1">
                                            <p className="text-gray-700 text-sm">
                                                {agreementMessages[formik.values.type]}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 md:px-6">
                            <div className="col-span-3 py-6">
                                <h1 className="text-2xl  font-bold underline">
                                    Property Information
                                </h1>
                            </div>
                            <div className="col-span-3 md:col-span-1">
                                <Input
                                    label="Property Name"
                                    name="name"
                                    placeholder="eg. Prisma Residences"
                                    type="text"
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.name &&
                                    formik.errors.name && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.name}
                                        </p>
                                    )}
                            </div>
                            <div className="col-span-3 md:col-span-1">
                                <Select
                                    label="Unit Type"
                                    name="unit_type"
                                    placeholder="eg. 1 BR"
                                    onChange={(e) =>
                                        formik.setFieldValue("unit_type", e.target.value)
                                    }
                                >
                                    {type.map((type) => (
                                        <SelectItem key={type.key}>{type.label}</SelectItem>
                                    ))}
                                </Select>

                                {formik.touched.unit_type &&
                                    formik.errors.unit_type && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.unit_type}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Select
                                    label="Unit Status"
                                    name="unit_status"
                                    placeholder="Fully Furnished"
                                    onChange={(e) =>
                                        formik.setFieldValue("unit_status", e.target.value)
                                    }
                                >
                                    {furnished.map((furnished) => (
                                        <SelectItem key={furnished.key}>
                                            {furnished.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formik.touched.unit_status &&
                                    formik.errors.unit_status && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.unit_status}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3">
                                <Input
                                    label="Location"
                                    name="location"
                                    placeholder="eg. Makati City"
                                    type="text"
                                    value={formik.values.location}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.location &&
                                    formik.errors.location && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.location}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Input
                                    label="Property Price"
                                    name="price"
                                    placeholder="eg. 0.00"
                                    type="text"
                                    value={formik.values.price}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.price &&
                                    formik.errors.price && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.price}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Input
                                    label="Square Meter"
                                    name="area"
                                    placeholder="eg. 0.00"
                                    type="text"
                                    value={formik.values.area}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.area &&
                                    formik.errors.area && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.area}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Input
                                    label="Floor Number"
                                    name="unit_number"
                                    placeholder="eg. 0.00"
                                    type="text"
                                    value={formik.values.unit_number}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.unit_number &&
                                    formik.errors.unit_number && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.unit_number}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Select
                                    label="Parking"
                                    name="parking"
                                    placeholder="Select Parking"
                                    onChange={(e) =>
                                        formik.setFieldValue("parking", e.target.value)
                                    }
                                >
                                    {parking.map((parking) => (
                                        <SelectItem key={parking.key}>{parking.label}</SelectItem>
                                    ))}
                                </Select>
                                {formik.touched.parking &&
                                    formik.errors.parking && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.parking}
                                        </p>
                                    )}
                            </div>

                            <div className="col-span-3 md:col-span-1">
                                <Select
                                    label="Property Status"
                                    name="status"
                                    placeholder="Property Status"
                                    value={formik.values.status}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        formik.setFieldValue(
                                            "status",
                                            e.target.value,
                                        )
                                    }}
                                >
                                    {status.map((statusItem) => (
                                        <SelectItem key={statusItem.key} value={statusItem.key}>
                                            {statusItem.label}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {formik.touched.status &&
                                    formik.errors.status && (
                                        <p className="text-red-500 text-sm">
                                            {formik.errors.status}
                                        </p>
                                    )}
                            </div>

                            {formik.values.status === "For Rent" && (
                                <div className="col-span-3 md:col-span-1">
                                    <Select
                                        label="Minimum Lease Term"
                                        name="terms"
                                        placeholder="Lease Term"
                                        value={formik.values.terms}
                                        onChange={(e) =>
                                            formik.setFieldValue(
                                                "terms",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        {rent.map((rentItem) => (
                                            <SelectItem key={rentItem.key} value={rentItem.key}>
                                                {rentItem.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {formik.values.status === "For Sale" && (
                                <>
                                    <div className="col-span-2 md:col-span-1">
                                        <Select
                                            label="Sale Type"
                                            name="sale_type"
                                            placeholder="Select Sale Type"
                                            value={formik.values.sale_type}
                                            onChange={(e) =>
                                                formik.setFieldValue(
                                                    "sale_type",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            {sale.map((saleItem) => (
                                                <SelectItem key={saleItem.key} value={saleItem.key}>
                                                    {saleItem.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>

                                    {formik.values.sale_type === "RFO" && (
                                        <>
                                            <div className="col-span-2 md:col-span-1">
                                                <Select
                                                    label="Payment Type"
                                                    name="payment"
                                                    placeholder="Select Payment Type"
                                                    value={formik.values.payment}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(
                                                            "payment",
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    {payment.map((paymentItem) => (
                                                        <SelectItem
                                                            key={paymentItem.key}
                                                            value={paymentItem.key}
                                                        >
                                                            {paymentItem.label}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>

                                            <div className="col-span-2 md:col-span-1">
                                                <Input
                                                    label="Title Status"
                                                    name="title"
                                                    placeholder="Enter Title Status"
                                                    type="text"
                                                    value={formik.values.title}
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                />
                                                {formik.touched.title &&
                                                    formik.errors.title && (
                                                        <p className="text-red-500 text-sm">
                                                            {formik.errors.title}
                                                        </p>
                                                    )}
                                            </div>
                                        </>
                                    )}

                                    {formik.values.sale_type === "Pre-Selling" && (
                                        <div className="col-span-2 md:col-span-1">
                                            <Input
                                                label="Turnover Date"
                                                name="turnover"
                                                placeholder="Enter Turnover Date"
                                                type="date"
                                                value={formik.values.turnover}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {formik.touched.turnover &&
                                                formik.errors.turnover && (
                                                    <p className="text-red-500 text-sm">
                                                        {formik.errors.turnover}
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <Divider className="my-4" />

                        <div className="md:px-6">
                            <h1 className="font-bold ">
                                Features and Amenties
                            </h1>

                            <div className="py-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    {amenities.map((amenitiesItem) => (
                                        <div key={amenitiesItem.key} className="flex items-center">
                                            <input
                                                checked={formik.values.amenities.includes(amenitiesItem.key)}
                                                className="w-4 h-4"
                                                id={amenitiesItem.key}
                                                type="checkbox"
                                                value={amenitiesItem.key}
                                                name="amenities"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        formik.setFieldValue("amenities", [
                                                            ...formik.values.amenities,
                                                            amenitiesItem.key,
                                                        ]);
                                                    } else {
                                                        formik.setFieldValue(
                                                            "amenities",
                                                            formik.values.amenities.filter(
                                                                (key) => key !== amenitiesItem.key
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <label
                                                className="ms-2 text-md font-medium text-default-500"
                                                htmlFor={amenitiesItem.key}
                                            >
                                                {amenitiesItem.label}
                                            </label>
                                        </div>
                                    ))}

                                    {formik.errors.amenities && formik.touched.amenities && (
                                        <div className="text-red-500 text-sm">{formik.errors.amenities}</div>
                                    )}
                                </div>
                            </div>


                            <h1 className="font-bold ">Property Image</h1>
                            <div className="col-span-3 md:col-span-1 py-8">
                                <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                    Upload Image
                                </label>
                                <Input
                                    id="images"
                                    name="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="w-full col-span-1 mt-1 block"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        const files = event.currentTarget.files;

                                        if (files) {
                                            formik.setFieldValue("images", files);
                                        }
                                    }}
                                />
                                {formik.errors.images && formik.touched.images && (
                                    <div className="text-red-500 text-sm">{formik.errors.images}</div>
                                )}
                            </div>

                            <Button
                                className=" text-white font-bold uppercase mb-4"
                                endContent={<FaArrowRightLong />}
                                size="lg"
                                type="submit"
                                isLoading={loading}
                            >
                                {loading ? "Sending Property..." : "Submit Property"}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </form>
        </div>
    );
};

export default NewPropertyPage;
