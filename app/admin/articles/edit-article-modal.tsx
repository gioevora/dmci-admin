import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from "@heroui/react";
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import CustomInput from '@/components/input';
import type { Article } from '@/app/utils/types';
import FormikCustomError from '@/components/formik-custom-error';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    date: Yup.string().required('Date is required'),
    content: Yup.string().required('Content is required'),
    type: Yup.string().required('Type is required'),
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
                            date: article?.date,
                            content: article?.content,
                            type: article?.type,
                            url: article?.url,
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
                                    name="date"
                                    label="Date"
                                    type="date"
                                    error={touched.date ? errors.date : undefined}
                                />
                                <Field as={Textarea}
                                    name="content"
                                    label="Content"
                                />
                                <ErrorMessage
                                    name="content"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
                                <CustomInput
                                    name="url"
                                    label="URL"
                                    type="text"
                                // error={touched.content ? errors.content : undefined}
                                />
                                <Field as="select"
                                    name="type"
                                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:bg-[#18181b] dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                    <option value="" hidden label="Type" />
                                    <option value="Seminars">Seminars</option>
                                    <option value="Meetings">Meetings</option>
                                    <option value="Events">Events</option>
                                    <option value="Closed Deals">Closed Deals</option>
                                    <option value="Real Estate News">Real Estate News</option>
                                    <option value="Real Estate Tips">Real Estate Tips</option>
                                </Field>
                                <ErrorMessage
                                    name="type"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
                                <CustomInput
                                    name="image"
                                    label="Image/Video"
                                    type="file"
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
        </Modal >
    );
};

export default EditModal;
