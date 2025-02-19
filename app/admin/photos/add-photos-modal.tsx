import React from 'react';
import { Button } from "@heroui/react";
import { Formik, Form, } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    video: Yup.mixed().required('Image is required'),
});

interface AddModalProps {
    mutate: () => void;
}

const AddPhotoModal: React.FC<AddModalProps> = ({ mutate }) => {
    const handleSubmit = async (
        values: { user_id: string; name: string; video: File | null },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/videos`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            toast.success('Operation successful!');
            mutate();
            resetForm();
            const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement | null;
            if (imageInput) {
                imageInput.value = '';
            }
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error adding Testimonial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const user_id = sessionStorage.getItem('id') || '';

    return (
        <Modal title="Add Media" buttonLabel="Add Media">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        user_id,
                        name: '',
                        video: null,
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
                                name="video"
                                label="Image"
                                type="file"
                                error={touched.video ? errors.video : undefined}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = event.target.files?.[0];
                                    setFieldValue('video', file);
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
            </div>
        </Modal>
    );
};

export default AddPhotoModal;