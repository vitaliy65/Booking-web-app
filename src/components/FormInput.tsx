import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormInputProps<T> {
  label: string;
  id: string;
  type?: string;
  register: ReturnType<UseFormRegister<T>>;
  error?: FieldError;
}

export default function FormInput<T>({
  label,
  id,
  type = "text",
  register,
  error,
}: FormInputProps<T>) {
  return (
    <div>
      <label className="form-input-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} type={type} {...register} className="form-input-input" />
      {error && <p className="form-input-error">{error.message}</p>}
    </div>
  );
}
