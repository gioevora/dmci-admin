import { AlertCircle } from "lucide-react";

const FormikCustomError: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-1 flex items-center gap-1 text-sm text-red-500">
        <AlertCircle size={16} />
        <span>{children}</span>
    </div>
);

export default FormikCustomError;
