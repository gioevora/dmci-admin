import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from '@nextui-org/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import type { Testimonial } from '@/app/utils/types';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

const validationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    message: Yup.string().required('Message is required'),
});

interface EditTestimonialModalProps {
    testimonial: Testimonial | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditTestimonialModal: React.FC<EditTestimonialModalProps> = ({ testimonial, isOpen, onClose, mutate }) => {
    const user_id = sessionStorage.getItem('id') || '';

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        console.log(values);

        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/testimonials`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }

            });
            toast.success('Operation successful!');
            onClose();
            console.log('data added:', response.data);
            mutate();
        } catch (error: any) {
            toast.error('Something went wrong.');
            setSubmitting(false);
            console.error('Error adding user:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Edit {testimonial?.first_name} {testimonial?.last_name}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: testimonial?.id,
                            user_id,
                            first_name: testimonial?.first_name,
                            last_name: testimonial?.last_name,
                            message: testimonial?.message,

                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
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

export default EditTestimonialModal;
