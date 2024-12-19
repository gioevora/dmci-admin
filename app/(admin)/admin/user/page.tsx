'use client';

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@nextui-org/react";

import { DataTable } from '@/components/data-table';
import { Column } from '@/app/utils/types';
import { Modal } from '@/components/add-modal';
import CustomInput from "@/components/input";
import { passwordSchema, emailSchema } from "@/app/utils/validation-schema";

const validationSchema = Yup.object({
    email: emailSchema.fields.email,
    password: passwordSchema.fields.password,
});

type User = {
    id: number;
    name: string;
    email: string;
};

const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];


const columns: Column<User>[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
];

export default function Home() {
    const handleAction = (user: User) => {
        console.log('Action clicked for user:', user);
    };

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">User Table</h1>
                <Modal title="Add new user" buttonLabel="Add new user">
                    <div className="min-w-full">
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                console.log(values);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <CustomInput
                                        name="email"
                                        label="Email"
                                        type="text"
                                        error={touched.email ? errors.email : undefined}
                                    />
                                    <CustomInput
                                        name="password"
                                        label="Password"
                                        type="password"
                                        error={touched.password ? errors.password : undefined}
                                    />
                                    <Button
                                        type="submit"
                                        color="primary"
                                        className="w-full"
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Modal>
            </div>
            <DataTable<User>
                data={users}
                columns={columns}
                itemsPerPage={5}
                onAction={handleAction}
                actionLabel="Edit"
            />
        </main>
    );
}
