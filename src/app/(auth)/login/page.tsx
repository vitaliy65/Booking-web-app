"use client";
import React from "react";
import LoginForm from "@/components/login/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}
