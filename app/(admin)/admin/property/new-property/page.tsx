'use client';

import { Card, Input, Button, Select, SelectItem, } from '@nextui-org/react';
import { Formik, Field, Form, ErrorMessage, } from 'formik';
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import * as Yup from 'yup';

const PropertyForm = () => {
    const validationSchema = Yup.object({
        last_name: Yup.string().required('Enter your last name'),
        first_name: Yup.string().required('Enter your first name'),
        email: Yup.string().email('Enter a valid email').required('Email is required'),
        phone: Yup.string().required('Enter valid phone number'),
        owner_or_agent: Yup.string().required('You must select owner or agent'),
        property_name: Yup.string().required('Property name is required'),
        location: Yup.string().required('Location is required'),
        property_type: Yup.string().required('Property type is required'),
        unit_type: Yup.string().required('Unit type is required'),
        selling_price: Yup.number().required('Price is required'),
        square_meter: Yup.number().required('Square Meter is required'),
        floor_no: Yup.number().required('Floor number is required'),
        parking_type: Yup.string().required('Parking type is required'),
        features: Yup.array().min(1, 'Select at least one feature'),
        description: Yup.string().required('Description is required'),
        images: Yup.array().min(1, 'At least one image is required'),
        fortunepogi: Yup.array().min(1, 'You must acknowledge the statement'),

    });

    const handleSubmit = (values: any) => {
        // Submit logic here
        console.log(values);
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-center text-2xl font-bold mb-6">Submit Property</h2>
            <Card aria-labelledby="submit-property-form" className="mx-auto p-6">
                <Formik
                    initialValues={{
                        last_name: '',
                        first_name: '',
                        email: '',
                        phone: '',
                        owner_or_agent: '',
                        property_name: '',
                        location: '',
                        property_type: '',
                        unit_type: '',
                        selling_price: '',
                        square_meter: '',
                        floor_no: '',
                        parking_type: '',
                        features: [],
                        description: '',
                        images: [],
                        fortunepogi: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, errors, touched, }) => (
                        <Form id="modalForm" className="space-y-6">
                            {/* Personal Information */}
                            <h4 className="mb-3">Personal Information:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="first_name"
                                        as={Input}
                                        label="First Name"
                                        variant="underlined"
                                        placeholder="Enter first name"
                                    />
                                    <ErrorMessage name="first_name" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1 mb-2">
                                    <Field
                                        name="last_name"
                                        as={Input}
                                        label="Last Name"
                                        variant="underlined"
                                        placeholder="Enter last name"
                                    />
                                    <ErrorMessage name="last_name" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
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
                                <div className="col-span-1">
                                    <Field
                                        name="phone"
                                        as={Input}
                                        label="Phone Number"
                                        variant="underlined"
                                        placeholder="Enter phone number"
                                    />
                                    <ErrorMessage name="phone" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-2">
                                    <Field as={Select} name="owner_or_agent" label="Are you the owner or an agent?" variant="underlined" placeholder="Select">
                                        <SelectItem value="owner">Owner</SelectItem >
                                        <SelectItem value="agent">Agent</SelectItem >
                                    </Field>
                                    <ErrorMessage name="owner_or_agent" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                            </div>

                            {/* Property Details */}
                            <h4 className="mb-3 pt-4">Property Details:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="col-span-1">
                                    <Field
                                        name="property_name"
                                        as={Input}
                                        label="Property Name"
                                        variant="underlined"
                                        placeholder="Enter property name"
                                    />
                                    <ErrorMessage name="property_name" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="location"
                                        as={Input}
                                        label="Location"
                                        variant="underlined"
                                        placeholder="Enter location"
                                    />
                                    <ErrorMessage name="location" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="property_type"
                                        label="Property Type"
                                        variant="underlined"
                                        placeholder="Select Property Type"
                                    >
                                        <SelectItem value="sale">For Sale</SelectItem>
                                        <SelectItem value="rent">For Rent</SelectItem>
                                    </Field>
                                    <ErrorMessage name="property_type" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="unit_type"
                                        label="Unit Type"
                                        variant="underlined"
                                        placeholder="Select Unit Type"
                                        status={errors.unit_type && touched.unit_type ? 'error' : 'default'}
                                    >
                                        <SelectItem value="Studio">Studio</SelectItem>
                                        <SelectItem value="1BR">1BR</SelectItem>
                                        <SelectItem value="2BR">2BR</SelectItem>
                                        <SelectItem value="3BR">3BR</SelectItem>
                                        <SelectItem value="Loft">Loft</SelectItem>
                                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                                        <SelectItem value="Duplex/Bi-Level">Duplex/Bi-Level</SelectItem>
                                    </Field>
                                    <ErrorMessage name="unit_type" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="selling_price"
                                        as={Input}
                                        type="number"
                                        label="Price"
                                        variant="underlined"
                                        placeholder="Enter price"
                                    />
                                    <ErrorMessage name="selling_price" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="square_meter"
                                        as={Input}
                                        type="number"
                                        label="Square Meter"
                                        variant="underlined"
                                        placeholder="Enter square meter"
                                    />
                                    <ErrorMessage name="square_meter" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        name="floor_no"
                                        as={Input}
                                        type="number"
                                        label="Floor Number"
                                        variant="underlined"
                                        placeholder="Enter floor number"
                                    />
                                    <ErrorMessage name="floor_no" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                                <div className="col-span-1">
                                    <Field
                                        as={Select}
                                        name="parking_type"
                                        label="Parking"
                                        variant="underlined"
                                        placeholder="Select Parking Type"
                                        status={errors.unit_type && touched.unit_type ? 'error' : 'default'}
                                    >
                                        <SelectItem value="with_parking">With Parking</SelectItem>
                                        <SelectItem value="without_parking">Without Parking</SelectItem>
                                    </Field>
                                    <ErrorMessage name="parking_type" component="div" className="absolute text-xs text-[#F31260] ml-1 mt-1" />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                <div className="col-span-1">
                                    <label className="mb-2">Features:</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Pool Area"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Pool Area</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Clubhouse"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Clubhouse</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Gym/Fitness Center"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Gym/Fitness Center</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Balcony/Terrace"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Balcony/Terrace</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Concierge Services"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Concierge Services</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Security"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Security</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Elevator"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Elevator</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Underground Parking"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Underground Parking</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Pet-Friendly Facilities"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Pet-Friendly Facilities</span>
                                        </label>
                                        <label className="flex items-center space-x-2 col-span-1">
                                            <Field
                                                type="checkbox"
                                                name="features"
                                                value="Guest Suites"
                                                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span>Guest Suites</span>
                                        </label>
                                    </div>
                                    <ErrorMessage name="features" component="div" className="absolute text-xs text-[#F31260] mt-1" />
                                </div>
                            </div>




                            {/* Images */}
                            <div>
                                <h4 className="mt-8">Upload Images:</h4>
                                <Input
                                    type="file"
                                    name="images"
                                    variant="underlined"
                                    multiple
                                    onChange={(event) => setFieldValue('images', event.target.files)}
                                />
                                <ErrorMessage name="images" component="div" className="absolute text-xs text-[#F31260] mt-1" />
                            </div>

                            {/* Acknowledgment */}
                            <div>
                                <label className="flex items-center space-x-2 col-span-1">
                                    <Field
                                        type="checkbox"
                                        name="fortunepogi"
                                        value="Guest Suites"
                                        className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span>I acknowledge that I am submitting this property for review.</span>
                                </label>
                                <ErrorMessage name="fortunepogi" component="div" className="absolute text-xs text-[#F31260] mt-1" />
                            </div>

                            {/* Disclaimer */}
                            <div>
                                <p>
                                    <span className="text-small">Disclaimer:</span><br />
                                    <span className="font-light text-xs">By submitting this form, you confirm that the information provided is accurate. Any false information may lead to rejection of your property listing.</span>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="mt-6" color="primary">Submit</Button>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default PropertyForm;
