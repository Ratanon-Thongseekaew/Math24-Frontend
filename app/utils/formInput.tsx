import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

interface FormInputProps {
    name: "email" | "password" | "firstname" | "lastname" | "confirmPassword";
    type?: string;
    placeholder?: string
    register: UseFormRegister<FormData>;
    errors: FieldErrors<FormData>
}

export default function FormInput({
    name,
    type = "text",
    placeholder,
    register,
    errors
}: FormInputProps) {
    return (
        <div>
            <input
                placeholder={placeholder || name}
                type={type}
                {...register(name)}
                className="border w-full border-gray-400 rounded-md p-1 px-4"
            />
            {errors[name] && (
                <p className="text-sm text-red-500">{errors[name]?.message as string}</p>
            )}
        </div>
    )
}