import React from 'react';
import { Button } from "@heroui/react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import { Textarea } from "@heroui/input";
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    message: Yup.string().required('Message is required'),
});

interface AddModalProps {
    mutate: () => void;
}

const AddTestimonialModal: React.FC<AddModalProps> = ({ mutate }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSubmit = async (
        values: { user_id: string; first_name: string; last_name: string; message: string },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`,
                values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success('Operation successful!');
            mutate();
            resetForm();
            setIsOpen(false);
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error adding Testimonial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const user_id = sessionStorage.getItem('id') || '';

    return (
        <Modal title="Add testimonial" buttonLabel="Add testimonial" isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        first_name: '',
                        last_name: '',
                        message: '',
                        user_id,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                            <CustomInput
                                name="first_name"
                                label="First Name"
                                type="text"
                                error={touched.first_name ? errors.first_name : undefined}
                            />
                            <CustomInput
                                name="last_name"
                                label="Last Name"
                                type="text"
                                error={touched.last_name ? errors.last_name : undefined}
                            />
                            <div>
                                <Field
                                    as={Textarea}
                                    name="message"
                                    label="Message"
                                    variant="flat"
                                    rows={4}
                                    cols={50}
                                />
                                {touched.message && errors.message && (
                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> <span>{errors.message}</span>
                                    </div>
                                )}
                            </div>
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

export default AddTestimonialModal;