"use client";
import React, { ReactNode } from "react";
import CheckAuthProvider from "./CheckAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <CheckAuthProvider>{children}</CheckAuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
