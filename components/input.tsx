import React from "react";
import { Input } from "@nextui-org/react"; // Import NextUI Input component
import { Field } from "formik"; // Formik Field to bind to form
import { AlertCircle } from "lucide-react";

interface CustomInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, name, type = "text", error }) => {
    return (
        <div className="mb-4">
            <Field
                as={Input}
                type={type}
                label={label}
                name={name}
                variant="underlined"

            />
            {error && (
                <div id={`${name}-error`} className="mt-1 flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default CustomInput;
