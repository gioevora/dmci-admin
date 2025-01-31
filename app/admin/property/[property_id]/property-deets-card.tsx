"use client"

import useSWR from "swr"
import type React from "react"
import { useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Divider, Textarea } from "@heroui/react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { ChevronLeft, Pen } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"

import LoadingDot from "@/components/loading-dot"
import FormikCustomError from "@/components/formik-custom-error"
import PropertyImageSlider from "./property-image-slider"
import { GoLocation } from "react-icons/go";
import { BsHouseCheckFill } from "react-icons/bs";
import { MdPayments } from "react-icons/md";
import { TbRulerMeasure2 } from "react-icons/tb";
import { LuBuilding2 } from "react-icons/lu";
import { FaCalendarCheck } from "react-icons/fa";
import { FaCar } from "react-icons/fa6";

const validationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
})

interface PropertyDetailsProps {
    property_id: string
}

const fetchWithToken = async (url: string) => {
    const token = sessionStorage.getItem("token")

    const headers: HeadersInit = {
        "Content-Type": "application/json",
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    })

    if (!response.ok) {
        throw new Error("Failed to fetch data")
    }

    return response.json()
}


function getOrdinalSuffix(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) return "th";
    switch (n % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property_id }) => {
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${property_id}`,
        fetchWithToken,
    )
    const [isEditing, setIsEditing] = useState(false)

    if (isLoading) {
        return <LoadingDot />
    }

    if (error) {
        return <LoadingDot />
    }

    if (!data || !data.record) {
        return <p>No property found.</p>
    }

    const property = data.record
    console.log(data)
    const amenities = JSON.parse(property.amenities || "[]")
    const images = JSON.parse(property.images || "[]")

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(Number(price))
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const token = sessionStorage.getItem("token")
            await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            toast.success("Description updated successfully!")
            setIsEditing(false)
            mutate()
        } catch (error) {
            toast.error("Failed to update description.")
        } finally {
            setSubmitting(false)
        }
    }



    return (
        <div className="pt-4">
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <Link color="primary" href="/admin/property" className="flex items-center"><ChevronLeft size={20} /> Back</Link>
                </CardHeader>

                <CardBody className="px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="order-2 md:order-1">
                            <h1 className="text-base md:text-3xl font-bold text-violet-900">{property.unit_type} | {property.name}</h1>
                            <div className="flex items-center gap-1">
                                <GoLocation className="text-violet-900" />
                                <p className="text-default-500 text-sm ">{property.location}</p>
                            </div>



                            <h1 className="text-sm font-semibold text-violet-700 uppercase dark:text-white mt-6">Property Details</h1>
                            <div className="flex flex-wrap py-2 gap-2">

                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                        <LuBuilding2 />
                                    </div>
                                    <p className="text-base text-violet-600">
                                        {property.unit_status}
                                    </p>
                                </div>

                                {property.status === "For Sale" ? (
                                    <>
                                        <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                            <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-full">
                                                <BsHouseCheckFill />
                                            </div>
                                            <p className="text-base text-violet-600">
                                                {property.status}
                                            </p>
                                        </div>


                                        {property.sale_type === "RFO" ? (
                                            <>

                                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                        <BsHouseCheckFill />
                                                    </div>
                                                    <p className="text-base text-violet-600">
                                                        {property.sale_type}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                        <MdPayments />
                                                    </div>
                                                    <p className="text-base text-violet-600">
                                                        {property.payment}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                        <BsHouseCheckFill />
                                                    </div>
                                                    <p className="text-base text-violet-600">
                                                        {property.title}
                                                    </p>
                                                </div>

                                            </>
                                        ) : property.sale_type === "Pre-Selling" ? (
                                            <>

                                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                        <BsHouseCheckFill />
                                                    </div>
                                                    <p className="text-base text-violet-600">
                                                        {property.sale_type}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                        <FaCalendarCheck />
                                                    </div>
                                                    <p className="text-base text-violet-600">
                                                        {new Date(property.turnover).toLocaleDateString("en-US", {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </>
                                        ) : null}

                                    </>
                                ) : property.status === "For Rent" ? (
                                    <>
                                        <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                            <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-full">
                                                <BsHouseCheckFill />
                                            </div>
                                            <p className="text-base text-violet-600">
                                                {property.status}
                                            </p>
                                        </div>

                                        <div className="text-base text-violet-600">
                                            <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                                <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                                    <MdPayments />
                                                </div>
                                                <p className="text-base text-violet-600">
                                                    {property.terms}
                                                </p>
                                            </div>
                                        </div>
                                    </>

                                ) : null}

                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                        <TbRulerMeasure2 />
                                    </div>
                                    <p className="text-base text-violet-600">
                                        {property.area} sqm
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                        <LuBuilding2 />
                                    </div>
                                    <p className="text-base text-violet-600">
                                        {property.unit_number}
                                        {getOrdinalSuffix(property.unit_number)} Floor
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 bg-default-200 px-2 py-2 rounded-lg">
                                    <div className="bg-violet-200 text-violet-800 px-2 py-2 rounded-lg">
                                        <FaCar />
                                    </div>

                                    <p className="text-base text-violet-600">
                                        {property.parking === 0 ? (
                                            "Without Parking"
                                        ) : property.parking === 1 ? (
                                            "With Parking"
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                            <Divider className="my-4" />

                            <div>
                                <h1 className="text-sm font-semibold text-violet-700 uppercase dark:text-white">General Features</h1>
                                <div className="inline-flex flex-wrap gap-2 mt-4">
                                    {amenities.map((amenity: string, index: number) => (
                                        <div key={index} className="bg-gray-100 px-2 py-2 rounded-md text-sm hover:bg-gray-200 dark:bg-gray-900">
                                            {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Divider className="my-4" />

                            {/* Property Price */}
                            <div className="py-4">
                                <p className="text-2xl font-bold text-violet-800">{formatPrice(property.price)}</p>
                            </div>
                            <Divider className="my-4" />

                        </div>

                        <div className="order-1 md:order-2">
                            <PropertyImageSlider images={images} />
                        </div>

                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-semibold text-violet-700 uppercase dark:text-white">Description</h2>
                            <Button size="sm" variant="light" startContent={<Pen size={16} />} onPress={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancel" : "Edit"}
                            </Button>
                        </div>
                        {!isEditing ? (
                            <p>{property.description !== "N/A" ? property.description : "No description available."}</p>
                        ) : (
                            <Formik
                                initialValues={{
                                    id: property?.id,
                                    description: property?.description,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form className="space-y-4">
                                        <Field
                                            as={Textarea}
                                            variant="underlined"
                                            name="description"
                                            type="textarea"
                                            error={
                                                touched.description && typeof errors.description === "string" ? errors.description : undefined
                                            }
                                        />
                                        <ErrorMessage
                                            name="type"
                                            render={(msg) => <FormikCustomError children={msg} />}
                                        />
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
                        )}
                    </div>

                    <Divider className="my-4" />

                    <div>
                        <div className="py-4">
                            <h2 className="text-sm font-semibold text-violet-700 uppercase dark:text-white">Owner Details</h2>
                            <p>
                                {property.owner.first_name} {property.owner.last_name}
                            </p>
                            <p>Email: {property.owner.email}</p>
                            <p>Phone: {property.owner.phone}</p>
                        </div>

                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default PropertyDetails