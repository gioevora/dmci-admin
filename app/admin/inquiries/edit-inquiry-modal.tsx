import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Textarea } from "@heroui/react";
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import type { Inquiry } from '@/app/utils/types';
import FormikCustomError from '@/components/formik-custom-error';

const validationSchema = Yup.object({
    body: Yup.string().required('Message is required'),
});

interface EditModalProps {
    inquiry: Inquiry | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ inquiry, isOpen, onClose, mutate }) => {

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`/api/inquiry-reply-email`, values);

            await axios.post(`https://abicmanpowerservicecorp.com/api/inquiries/set-status`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                    <h1>To: {inquiry?.email}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: inquiry?.id,
                            first_name: inquiry?.first_name,
                            last_name: inquiry?.last_name,
                            email: inquiry?.email,
                            body: '',
                            status: "Replied",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className="space-y-4">

                                <Field
                                    as={Textarea}
                                    name="body"
                                    label="Message"
                                    id="body"
                                    variant="flat"
                                >
                                </Field>
                                <ErrorMessage
                                    name="body"
                                    render={(msg) => <FormikCustomError children={msg} />}
                                />
                                <Button
                                    type="submit"
                                    color="primary"
                                    className="w-full"
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    Send
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
