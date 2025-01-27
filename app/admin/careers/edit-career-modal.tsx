import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import type { Career } from '@/app/utils/types';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    position: Yup.string().required('Position is required'),
    slots: Yup.number().required('Slots is required'),
    image: Yup.mixed().required('Image is required'),
    available_slots: Yup.number().required('Available slots is required'),
});


interface EditModalProps {
    career: Career | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ career, isOpen, onClose, mutate }) => {


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/careers`, values, {
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
                    <h1>Edit {career?.position}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: career?.id,
                            position: career?.position,
                            slots: career?.slots,
                            image: career?.image,
                            _method: 'PUT',

                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                <CustomInput
                                    name="position"
                                    label="Position"
                                    type="text"
                                    error={touched.position ? errors.position : undefined}
                                />
                                <CustomInput
                                    name="slots"
                                    label="Slots"
                                    type="number"
                                    error={touched.position ? errors.position : undefined}
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
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
