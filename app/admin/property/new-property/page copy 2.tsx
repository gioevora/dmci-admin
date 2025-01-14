'use client';

import { Card, Input, Button } from '@nextui-org/react';
import { Formik, Field, Form, ErrorMessage, } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';


const PropertyForm = () => {
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        parking: Yup.boolean()
            .oneOf([true], 'You must select a parking option')
            .required('Parking option is required'),
    });


    const userId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');
    console.log("User ID:", userId);
    console.log("Token", token);

    const handleSubmit = async (values: any) => {
        try {
            console.log("Form values before submit:", values);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log("Form submitted successfully:", response.data);
            } else {
                console.error("Form submission failed:", response.statusText);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-center text-2xl font-bold mb-6">Submit Property</h2>
            <Card aria-labelledby="submit-property-form" className="mx-auto p-6">
                <Formik
                    initialValues={{
                        user_id: userId,
                        name: '',
                        email: '',
                        phone: '',
                        parking: false,

                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form id="modalForm" className="space-y-6">
                            {/* Personal Information */}
                            <h4 className="mb-3">Personal Information:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="name"
                                        as={Input}
                                        label="Full Name"
                                        variant="underlined"
                                        placeholder="Enter full name"
                                    />
                                    <ErrorMessage name="name" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="email"
                                        as={Input}
                                        label="Email"
                                        variant="underlined"
                                        placeholder="Enter your email"
                                    />
                                    <ErrorMessage name="email" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="phone"
                                        as={Input}
                                        label="Phone Number"
                                        variant="underlined"
                                        placeholder="Enter phone number"
                                    />
                                    <ErrorMessage name="phone" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center space-x-2 col-span-1">
                                    <Field
                                        type="checkbox"
                                        name="parking"
                                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    // onChange={(e) => {
                                    //     console.log(e.target.value)
                                    // }}
                                    />
                                    <span>With Parking</span>
                                </label>
                                <ErrorMessage name="parking" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center">
                                <Button type="submit">Submit</Button>
                            </div>
                        </Form>

                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default PropertyForm;