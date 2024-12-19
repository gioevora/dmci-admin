"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@nextui-org/react";

import CustomInput from "@/components/input";
import { passwordSchema, emailSchema } from "@/app/utils/validation-schema";
import { Modal } from "@/components/add-modal";


const validationSchema = Yup.object({
  email: emailSchema.fields.email,
  password: passwordSchema.fields.password,
});

const User = () => {
  return (
    <div>
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
  );
};

export default User;
