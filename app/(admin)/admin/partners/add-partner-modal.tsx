import React from 'react';
import { Button } from '@nextui-org/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Image is required'),
});

interface AddPartnerModalProps {
    mutate: () => void;

}

const AddPartnerModal: React.FC<AddPartnerModalProps> = ({ mutate }) => {
    const handleSubmit = async (
        values: { name: string; image: File | null },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('https://abicmanpowerservicecorp.com/api/partners', values, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            mutate();
        } catch (error) {
            console.error('Error adding partner:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal title="Add new partner" buttonLabel="Add new partner">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        name: '',
                        image: null,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting, setFieldValue }) => (
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

export default AddPartnerModal;
