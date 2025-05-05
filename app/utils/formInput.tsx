import type { FieldErrors, UseFormRegister,Path,FieldValues  } from "react-hook-form";

// interface FormData {
//     firstname: string;
//     lastname: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//   }

  interface FormInputProps<T extends FieldValues> {
    name: Path<T>;
    type?: string;
    placeholder?: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
  }

export default function FormInput<T extends FieldValues>({
    name,
    type = "text",
    placeholder,
    register,
    errors
}: FormInputProps<T>) {
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