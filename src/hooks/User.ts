import { User } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Отримати поточного користувача
const fetchUser = async () => {
  try {
    const res = await axios.get("/api/auth/me", { withCredentials: true });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Неавторизовано. Будь ласка, увійдіть у систему.");
    }
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Помилка отримання користувача"
    );
  }
};

// Логін
const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post("/api/auth/login", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Неправильний email або пароль");
    }
    throw new Error(
      error.response?.data?.message || error.message || "Помилка входу"
    );
  }
};

// Реєстрація
const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post("/api/auth/register", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("Користувач з таким email вже існує");
    }
    throw new Error(
      error.response?.data?.message || error.message || "Помилка реєстрації"
    );
  }
};

export function useUser() {
  const queryClient = useQueryClient();

  // Данні користувача
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({ queryKey: ["me"], queryFn: fetchUser, retry: 1 });

  // Мутація логіну
  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // Мутація реєстрації
  const register = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  return {
    user: user as User,
    isLoading,
    isError,
    error,
    refetch,
    loginUser: login.mutateAsync,
    loginStatus: login.status,
    loginError: login.error,
    registerUser: register.mutateAsync,
    registerStatus: register.status,
    registerError: register.error,
  };
}
