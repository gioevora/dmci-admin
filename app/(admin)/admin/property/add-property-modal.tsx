import React from 'react'
import { Button } from '@nextui-org/react';
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Modal } from '@/components/add-modal';
import CustomInput from "@/components/input";

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    logo: Yup.mixed().required('Logo is required'),
    description: Yup.string().required('Description is required'),
    location: Yup.string().required('Location is required'),
    min_price: Yup.number().required('Minimum Price is required').min(1000, 'Price cannot be less than 1000'),
    max_price: Yup.number().required('Maximum Price is required').min(1000, 'Price cannot be less than 1000'),
    status: Yup.string().required('Status is required'),
    percent: Yup.number().required('Percent is required').min(0, 'Percent cannot be less than 0').max(100, 'Percent cannot be greater than 100'),
});


const AddPropertyModal = () => {
    return (
        <Modal title="Add new property" buttonLabel="Add new property">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        name: "",
                        logo: "",
                        description: "",
                        location: "",
                        min_price: 1000,
                        max_price: 100000,
                        status: "",
                        percent: 0,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            <CustomInput
                                name="name"
                                label="Name"
                                type="text"
                                error={touched.name ? errors.name : undefined}

                            />
                            <div className="pt-4">
                                <CustomInput
                                    name="logo"
                                    label="Logo"
                                    type="file"
                                    error={touched.logo ? errors.logo : undefined}
                                />
                            </div>
                            <CustomInput
                                name="description"
                                label="Description"
                                type="text"
                                error={touched.description ? errors.description : undefined}
                            />
                            <CustomInput
                                name="location"
                                label="Location"
                                type="text"
                                error={touched.location ? errors.location : undefined}
                            />
                            <CustomInput
                                name="min_price"
                                label="Minimum Price"
                                type="number"
                                error={touched.min_price ? errors.min_price : undefined}
                            />
                            <CustomInput
                                name="max_price"
                                label="Maximum Price"
                                type="number"
                                error={touched.max_price ? errors.max_price : undefined}
                            />
                            <CustomInput
                                name="status"
                                label="Status"
                                type="text"
                                error={touched.status ? errors.status : undefined}
                            />
                            <CustomInput
                                name="percent"
                                label="Percent"
                                type="number"
                                error={touched.percent ? errors.percent : undefined}
                            />
                            <Button
                                type="submit"
                                color="primary"
                                className="w-full"
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
}

export default AddPropertyModal