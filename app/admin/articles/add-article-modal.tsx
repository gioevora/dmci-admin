import React from 'react';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    subtitle: Yup.string().required('Subtitle is required'),
    date: Yup.string().required('Date is required'),
    content: Yup.string().required('Content is required'),
    type: Yup.string().required('Type is required'),
    image: Yup.mixed().required('Image is required'),
});

interface AddModalProps {
    mutate: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ mutate }) => {
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
        } catch {
            toast.error('Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal title="Add new article" buttonLabel="Add new article">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        title: '',
                        subtitle: '',
                        date: '',
                        content: '',
                        type: '',
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
                            {/* <Select
                                label="Type"
                                name="type"
                                id="type"
                                variant="underlined"
                                placeholder="Type"
                            >
                                <SelectItem key="Seminars" >Seminars</SelectItem>
                                <SelectItem key="Meetings" >Meetings</SelectItem>
                                <SelectItem key="Events" >Events</SelectItem>
                                <SelectItem key="Closed Deals" >Closed Deals</SelectItem>
                                <SelectItem key="Real Estate News" >Real Estate News</SelectItem>
                            </Select> */}
                            <ErrorMessage name="type" component="div" className="text-xs text-[#F31260] mt-1" />
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
            </div>
        </Modal>
    );
};

export default AddModal;
