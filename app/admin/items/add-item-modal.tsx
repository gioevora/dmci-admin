import React from 'react';
import { Button } from '@nextui-org/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Modal } from '@/components/add-modal';
import CustomInput from '@/components/input';
import FormikCustomError from '@/components/formik-custom-error';


const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    image: Yup.mixed().required('Image is required'),
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


interface AddModalProps {
    mutate: () => void;
}

const AddPartnerModal: React.FC<AddModalProps> = ({ mutate }) => {
    const handleSubmit = async (
        values: { name: string; image: File | null },
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {

        // console.log(values);
        try {

            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/items`, values, {
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
        } catch (error) {
            toast.error('Something went wrong.');
            console.error('Error adding item:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal title="Add new item" buttonLabel="Add new item">
            <div className="min-w-full">
                <Formik
                    initialValues={{
                        name: '',
                        image: null,
                        width: '',
                        height: '',
                        type: '',
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
