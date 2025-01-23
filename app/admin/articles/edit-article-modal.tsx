import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import type { Article } from '@/app/utils/types';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    subtitle: Yup.string().required('Subtitle is required'),
    date: Yup.string().required('Date is required'),
    content: Yup.string().required('Content is required'),
    type: Yup.string().required('Type is required'),
    image: Yup.mixed().required('Image is required'),
});

interface EditModalProps {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ article, isOpen, onClose, mutate }) => {


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }

            });
            onClose();
            toast.success('Operation successful!');
            mutate();
        } catch {
            toast.error('Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Edit {article?.title}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: article?.id,
                            title: article?.title,
                            subtitle: article?.subtitle,
                            date: article?.date,
                            content: article?.content,
                            type: article?.type,
                            image: article?.image,
                            _method: 'PUT',

                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                <CustomInput
                                    name="title"
                                    label="Title"
                                    type="text"
                                    error={touched.title ? errors.title : undefined}
                                />
                                <CustomInput
                                    name="subtitle"
                                    label="Subtitle"
                                    type="text"
                                    error={touched.subtitle ? errors.subtitle : undefined}
                                />
                                <CustomInput
                                    name="date"
                                    label="Date"
                                    type="date"
                                    error={touched.date ? errors.date : undefined}
                                />
                                <CustomInput
                                    name="content"
                                    label="Content"
                                    type="text"
                                    error={touched.content ? errors.content : undefined}
                                />
                                <CustomInput
                                    name="type"
                                    label="Type"
                                    type="text"
                                    error={touched.type ? errors.type : undefined}
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
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    Save Changes
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
