import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import type { Item } from '@/app/utils/types';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    width: Yup.number()
        .required('Width is required')
        .test(
            'is-two-decimal-places',
            'Width must have at most two decimal places',
            (value) => value === undefined || /^[0-9]+(\.[0-9]{1,2})?$/.test(value.toString())
        ),
    height: Yup.number()
        .required('Height is required')
        .test(
            'is-two-decimal-places',
            'Height must have at most two decimal places',
            (value) => value === undefined || /^[0-9]+(\.[0-9]{1,2})?$/.test(value.toString())
        ),
    category: Yup.string().required('Category is required'),
});

interface EditItemModalProps {
    item: Item | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, isOpen, onClose, mutate }) => {


    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        console.log(values);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`, values, {
                headers: {
                    'Accept': 'application/json/',
                    'Content-Type': 'multipart/form-data',
                }

            });
            toast.success('Operation successful!');
            onClose();
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
                    <h1>Edit {item?.name}</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: item?.id,
                            name: item?.name,
                            image: item?.image,
                            width: item?.width,
                            height: item?.height,
                            category: item?.category,
                            _method: 'PUT',

                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ errors, touched, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                <CustomInput
                                    name="name"
                                    label="Name"
                                    type="text"
                                    error={touched.name ? errors.name : undefined}
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
                                <CustomInput
                                    name="width"
                                    label="Width"
                                    type="width"
                                    error={touched.width ? errors.width : undefined}
                                />
                                <CustomInput
                                    name="height"
                                    label="Height"
                                    type="height"
                                    error={touched.height ? errors.height : undefined}
                                />
                                <CustomInput
                                    name="category"
                                    label="Category"
                                    type="category"
                                    error={touched.category ? errors.category : undefined}
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

export default EditItemModal;
