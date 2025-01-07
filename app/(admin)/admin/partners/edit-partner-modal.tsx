import React from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CustomInput from '@/components/input';
import type { Partner } from '@/app/utils/types';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
});

interface EditPartnerModalProps {
    partner: Partner | null;
    isOpen: boolean;
    onClose: () => void;
    mutate: () => void;
}

const EditPartnerModal: React.FC<EditPartnerModalProps> = ({ partner, isOpen, onClose, mutate }) => {
    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        try {
            const response = await axios.post('https://abicmanpowerservicecorp.com/api/partners', values, {
                headers: {
                    'Accept': 'application/json/',
                    'Content-Type': 'multipart/form-data',
                },
            });
            mutate();
            onClose();
        } catch (error: any) {
            console.error('Error adding user:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
            <ModalContent>
                <ModalHeader>
                    <h1>Edit</h1>
                </ModalHeader>
                <ModalBody className="pb-6">
                    <Formik
                        initialValues={{
                            id: partner?.id,
                            name: partner?.name,
                            image: partner?.image,
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

export default EditPartnerModal;
