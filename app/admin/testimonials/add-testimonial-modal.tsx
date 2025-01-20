import React from 'react';
import { Button } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import { Textarea } from '@nextui-org/input';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    message: Yup.string().required('Message is required'),
});

interface AddModalProps {
    mutate: () => void;
}

const AddTestimonialModal: React.FC<AddModalProps> = ({ mutate }) => {
    const handleSubmit = async (
        values: { user_id: string; name: string; message: string },
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
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error adding Testimonial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const user_id = sessionStorage.getItem('id') || '';

    return (
        <Modal title="Add new Testimonial" buttonLabel="Add new Testimonial">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        name: '',
                        message: '',
                        user_id,
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
                            <div>
                                <Field
                                    as={Textarea}
                                    name="message"
                                    label="Message"
                                    variant="underlined"
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