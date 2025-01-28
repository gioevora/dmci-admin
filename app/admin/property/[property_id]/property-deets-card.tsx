"use client"

import useSWR from "swr"
import type React from "react"
import { useState } from "react"
import { Button, Card, CardBody, CardHeader, Chip, Divider, Image, Textarea } from "@nextui-org/react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { ChevronLeft, Pen } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"

import LoadingDot from "@/components/loading-dot"
import FormikCustomError from "@/components/formik-custom-error"

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
            mutate() // Refresh the data
        } catch (error) {
            console.error("Error updating description:", error)
            toast.error("Failed to update description.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="p-4">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="flex justify-between items-center">
                    <Link color="primary" href="/admin/property" className="flex items-center"><ChevronLeft size={20} /> Back</Link>
                    <h1 className="text-2xl font-bold">{property.name}</h1>
                    <Chip color={property.status === "For Rent" ? "primary" : "success"}>{property.status}</Chip>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Image
                                src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/properties/images/${images[0]}`}
                                alt={property.name}
                                className="w-full h-64 object-cover rounded-lg"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-xl font-semibold">{formatPrice(property.price)} / month</p>
                            <p>{property.location}</p>
                            <p>
                                {property.area} sqm | {property.unit_type} | Unit {property.unit_number}
                            </p>
                            <p>Status: {property.unit_status}</p>
                            <p>Terms: {property.terms}</p>
                        </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Description</h2>
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

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {amenities.map((amenity: string, index: number) => (
                                <Chip key={index} variant="flat">
                                    {amenity}
                                </Chip>
                            ))}
                        </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Owner Details</h2>
                        <p>
                            {property.owner.first_name} {property.owner.last_name}
                        </p>
                        <p>Email: {property.owner.email}</p>
                        <p>Phone: {property.owner.phone}</p>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default PropertyDetails