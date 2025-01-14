import React from 'react'
import { Button } from '@nextui-org/react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from "@/components/input";
import { passwordSchema, emailSchema } from '@/app/utils/validation-schema';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: emailSchema.fields.email,
    password: passwordSchema.fields.password,
});


const AddUserModal = () => {

    const handleSubmit = async (values: { name: string; email: string; password: string, type: string }, { setSubmitting }: any) => {
        try {
            const response = await axios.post('https://abicmanpowerservicecorp.com/api/users', values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }

            });
            console.log(values);
            console.log(response);
            console.log('User added:', response.data);
        } catch (error: any) {
            setSubmitting(false);
            console.error('Error adding user:', error);
        }
    };

    return (
        <Modal title="Add new user" buttonLabel="Add new user">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        type: "Agent",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                            <CustomInput
                                name="name"
                                label="Name"
                                type="text"
                                error={touched.name ? errors.name : undefined}

                            />
                            <CustomInput
                                name="email"
                                label="Email"
                                type="text"
                                error={touched.email ? errors.email : undefined}
                            />
                            <CustomInput
                                name="password"
                                label="Password"
                                type="password"
                                error={touched.password ? errors.password : undefined}
                            />
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
            </div>
        </Modal>
    )
}

export default AddUserModal