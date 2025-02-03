import React from "react";
import { Input } from "@heroui/react";
import { Field, FieldProps } from "formik";
import { AlertCircle } from "lucide-react";

interface CustomInputProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, name, type = "text", error, onChange }) => {
    return (
        <div>
            <Field name={name}>
                {({ field }: FieldProps) => (
                    <Input
                        {...field}
                        type={type}
                        label={label}
                        onChange={type === "file" ? onChange : field.onChange}
                        value={type === "file" ? undefined : field.value || ""}
                        variant="flat"
                    />
                )}
            </Field>
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
