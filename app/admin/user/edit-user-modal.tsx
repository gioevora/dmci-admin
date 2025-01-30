import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import { passwordSchema, emailSchema } from '@/app/utils/validation-schema';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: emailSchema.fields.email,
    password: passwordSchema.fields.password,
});

type User = {
    id: number;
    name: string;
    email: string;
};

interface EditModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
}

const EditUserModal: React.FC<EditModalProps> = ({ user, isOpen, onClose }) => {
    const [initialValues, setInitialValues] = useState({
        name: '',
        email: '',
        password: '',
        type: 'Agent',
    });

    useEffect(() => {
        if (user) {
            setInitialValues({
                name: user.name || '',
                email: user.email || '',
                password: '',
                type: 'Agent',
            });
        }
    }, [user]);

    const handleSubmit = async (
        values: typeof initialValues,
        { setSubmitting }: FormikHelpers<typeof initialValues>
    ) => {
        try {
            const token = sessionStorage.getItem('token');
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const response = user
                ? await axios.put(
                    `https://abicmanpowerservicecorp.com/api/users/${user.id}`,
                    values,
                    { headers }
                )
                : await axios.post('https://abicmanpowerservicecorp.com/api/users', values, {
                    headers,
                });

            onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || 'Failed to save user. Please try again.');
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
            console.error('Error saving user:', error);
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Edit {user?.id ?? 'No user selected'}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
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
                                    isDisabled={isSubmitting}
                                >
                                    {user ? 'Save Changes' : 'Submit'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditUserModal;