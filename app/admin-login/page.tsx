// app\(admin)\admin-login\page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Spacer,
  Image,
} from "@heroui/react";
import { setCookie } from 'nookies';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: 'email@gmail.com',
      password: '12345678',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://abicmanpowerservicecorp.com/api/users/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          const { token, record } = await response.json();
          console.log('Login successful');
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('id', record.id);
          sessionStorage.setItem('type', record.type);
          setCookie(undefined, 'token', token, { path: '/' });
          router.replace('/admin');
        } else {
          toast.error('Invalid email or password');
        }
      } catch (error) {
        // console.error('Error logging in:', error);
        toast.error('Something went wrong. Please try again.');
      }
      finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white dark:bg-black bg-[url('/image/login-bg.png')] bg-cover bg-center p-8">
      <Card className="w-full max-w-[400px] p-8">
        <CardHeader className="flex flex-col justify-center">
          <div className="py-4">
            <Image
              alt="HeroUI hero Image"
              src="https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/media/ABIC+Realty.png"
              width={150}
            />
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={formik.handleSubmit}>
            <Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Enter email"
              isInvalid={formik.touched.email && Boolean(formik.errors.email)}
              errorMessage={formik.touched.email && formik.errors.email}
            />
            <Spacer y={4} />
            <Input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Enter password"
              isInvalid={
                formik.touched.password && Boolean(formik.errors.password)
              }
              errorMessage={formik.touched.password && formik.errors.password}
            />
            <Spacer y={4} />
            <Button
              className="w-full"
              color="primary"
              type="submit"
              isLoading={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
