"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "../FormInput";
import { useUser } from "@/hooks/User";

interface RegisterInputs {
  name: string;
  email: string;
  password: string;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInputs>();
  const router = useRouter();
  const { registerUser, registerError, registerStatus } = useUser();

  const onSubmit = async (data: RegisterInputs) => {
    if (!data.password) return;
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!registerError) {
        reset();
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form-container">
      <h2 className="register-form-title">Реєстрація</h2>
      <FormInput
        label="name"
        id="name"
        type="text"
        register={register("name", { required: "Введіть ім'я" })}
        error={errors.name}
      />
      <FormInput
        label="email"
        id="email"
        type="email"
        register={register("email", { required: "Введіть email" })}
        error={errors.email}
      />
      <FormInput
        label="password"
        id="password"
        type="password"
        register={register("password", {
          required: "Введіть пароль",
          minLength: {
            value: 6,
            message: "Пароль має містити мінімум 6 символів",
          },
        })}
        error={errors.password}
      />

      {registerError && (
        <div className="register-form-error-message-container">
          {registerError.message}
        </div>
      )}
      <button
        type="submit"
        disabled={registerStatus === "pending"}
        className="register-form-button-submit"
      >
        {registerStatus === "pending" ? "Реєстрація..." : "Зареєструватися"}
      </button>
    </form>
  );
}
