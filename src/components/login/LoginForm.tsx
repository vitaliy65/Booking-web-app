import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "../FormInput";
import { useUser } from "@/hooks/User";

interface LoginInputs {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { loginUser, loginError, loginStatus } = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInputs>();

  const onSubmit = async (data: LoginInputs) => {
    try {
      await loginUser(data);
      reset();
      router.push("/meeting-rooms");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form-container">
      <h2 className="login-form-title">Вхід</h2>
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
        register={register("password", { required: "Введіть пароль" })}
        error={errors.password}
      />
      {loginError && (
        <div className="login-form-error-message-container">
          <div>{loginError.message}</div>
        </div>
      )}
      <button
        type="submit"
        disabled={loginStatus === "pending"}
        className="login-form-button-submit"
      >
        {loginStatus === "pending" ? "Вхід..." : "Увійти"}
      </button>
    </form>
  );
}
