import React from 'react';
import { Button } from '@nextui-org/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

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
                            <Field as="select"
                                name="type"
                                className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:bg-[#18181b] dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                <option value="" label="Type" />
                                <option value="Seminars">Seminars</option>
                                <option value="Meetings">Meetings</option>
                                <option value="Events">Events</option>
                                <option value="Closed Deals">Closed Deals</option>
                                <option value="Real Estate News">Real Estate News</option>
                            </Field>
                            <ErrorMessage
                                name="type"
                                render={(msg) => <ErrorMessageComponent>{msg}</ErrorMessageComponent>}
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
            </div>
        </Modal>
    );
};

export default AddModal;

const ErrorMessageComponent = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
        <AlertCircle size={16} />
        <span>{children}</span>
    </div>
);
