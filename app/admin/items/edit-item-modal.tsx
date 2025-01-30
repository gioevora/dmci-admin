import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import CustomInput from '@/components/input';
import type { Item } from '@/app/utils/types';
import FormikCustomError from '@/components/formik-custom-error';

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
    type: Yup.string().required('Type is required'),
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

        // console.log(values);
        try {

            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                            type: item?.type,
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
                                <Field as="select"
                                    name="type"
                                    className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:bg-[#18181b] dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                    <option value="" hidden label="Type" />
                                    <option value="Living Room">Living Room</option>
                                    <option value="Bedroom">Bedroom</option>
                                    <option value="Dining Room">Dining Room</option>
                                    <option value="Home Office">Home Office</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                    <option value="Structural">Structural</option>
                                </Field>
                                <ErrorMessage
                                    name="type"
                                    render={(msg) => <FormikCustomError children={msg} />}
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
