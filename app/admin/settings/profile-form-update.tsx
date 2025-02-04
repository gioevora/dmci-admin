import React from 'react';
import { Button } from "@heroui/react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import CustomInput from '@/components/input';
import toast from 'react-hot-toast';

interface ProfileFormUpdateProps {
  data?: {
    record: {
      profile: {
        id: string;
        user_id: string;
        position: string;
        phone: string;
        facebook: string;
        instagram: string;
        telegram: string;
        viber: string;
        whatsapp: string;
        about: string;
      };
    };
  };
  mutate: () => void;
}

const validationSchema = Yup.object({
  position: Yup.string().required('Position is required'),
  phone: Yup.string().required('Phone is required'),
  facebook: Yup.string().required('Facebook is required'),
  instagram: Yup.string().required('Instagram is required'),
  telegram: Yup.string().required('Telegram is required'),
  viber: Yup.string().required('Viber is required'),
  whatsapp: Yup.string().required('Whatsapp is required'),
  about: Yup.string().required('About is required'),
});

const ProfileFormUpdate: React.FC<ProfileFormUpdateProps> = ({ data, mutate }) => {

  const profile = data?.record?.profile;

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
  ) => {
    try {
      const available_slots = values.slots;
      const token = sessionStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profiles`,
        { ...values, available_slots: available_slots },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Operation successful!');
      mutate();
      const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement | null;
      if (imageInput) {
        imageInput.value = '';
      }
    } catch (error) {
      toast.error('Something went wrong.');
      console.error('Error adding Career:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          _method: "PUT",
          id: profile?.id || '',
          user_id: profile?.user_id || '',
          position: profile?.position || '',
          phone: profile?.phone || '',
          facebook: profile?.facebook || '',
          instagram: profile?.instagram || '',
          telegram: profile?.telegram || '',
          viber: profile?.viber || '',
          whatsapp: profile?.whatsapp || '',
          about: profile?.about || '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <CustomInput
              name="position"
              label="Position"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="phone"
              label="Phone"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="facebook"
              label="Facebook"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="instagram"
              label="Instagram"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="telegram"
              label="Telegram"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="viber"
              label="Viber"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="whatsapp"
              label="Whatsapp"
              type="text"
              error={touched.position ? errors.position : undefined}
            />
            <CustomInput
              name="about"
              label="About"
              type="text"
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
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ProfileFormUpdate;