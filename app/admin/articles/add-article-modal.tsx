import React, { useState } from 'react';
import { Button } from "@heroui/react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input'; 0;
import FormikCustomError from '@/components/formik-custom-error';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    date: Yup.string().required('Date is required'),
    content: Yup.string().required('Content is required'),
    type: Yup.string().required('Type is required'),
    image: Yup.mixed()
        .required('File is required')
        .test('fileType', 'File must be an image or a video', (value) => {
            if (!value) return false;

            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/ogg'];
            return validTypes.includes((value as File).type);
        }),
});

interface AddModalProps {
    mutate: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ mutate }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [isVideo, setIsVideo] = useState<boolean>(false);

    const handleSubmit = async (
        values: any,
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {

        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Operation successful!');
            mutate();
            resetForm();
            const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement | null;
            if (imageInput) {
                imageInput.value = '';
            }
            setPreview(null);
            setIsVideo(false);
        } catch {
            toast.error('Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal title="Add New Article" buttonLabel="Add New Article">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        title: '',
                        date: '',
                        content: '',
                        type: '',
                        url: '',
                        image: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
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
                            <CustomInput
                                name="content"
                                label="Content"
                                type="text"
                                error={touched.content ? errors.content : undefined}
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
                                name="url"
                                label="URL"
                                type="text"
                            />
                            <CustomInput
                                name="image"
                                label="Image/Video"
                                type="file"
                                error={touched.image ? errors.image : undefined}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        setFieldValue('image', file);
                                        setPreview(URL.createObjectURL(file));
                                        setIsVideo(file.type.startsWith('video'));
                                    }
                                }}
                            />
                            {preview && (
                                <div className="relative mt-2">
                                    {isVideo
                                        ? (<video poster="/image/play-button.png" controls className="w-full h-auto"><source src={preview} /></video>)
                                        : (<img src={preview} alt="Preview" className="w-full h-auto object-cover" />)
                                    }
                                </div>
                            )}
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

export default AddModal;
