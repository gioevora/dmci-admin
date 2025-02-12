import React from 'react';
import { Button } from "@heroui/react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Image is required'),
});

interface AddModalProps {
    mutate: () => void;
}

const AddPartnerModal: React.FC<AddModalProps> = ({ mutate }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSubmit = async (
        values: { name: string; image: File | null },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            formData.append("name", values.name);
            if (values.image) {
                formData.append("image", values.image);
            }

            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/partners`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Operation successful!');
            mutate();
            resetForm();
            setIsOpen(false);
        } catch (error) {
            console.error('Error adding partner:', error);
            toast.error('Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal title="Add new partner" buttonLabel="Add new partner" isOpen={isOpen} setIsOpen={setIsOpen}>
            <Formik
                initialValues={{
                    name: '',
                    image: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, isSubmitting, setFieldValue }) => (
                    <Form className="space-y-4">
                        <CustomInput
                            name="name"
                            label="Name"
                            type="text"
                            error={touched.name ? errors.name : undefined}
                        />
                        <CustomInput
                            name="image"
                            label="Image"
                            type="file"
                            error={touched.image ? errors.image : undefined}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const file = event.target.files?.[0];
                                setFieldValue('image', file);
                            }}
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
        </Modal>
    );
};

export default AddPartnerModal;