"use client";

import { useUser } from "@/hooks/User";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { isError } = useUser();

  useEffect(() => {
    if (isError) router.push("/login");
    else router.push("/meeting-rooms");
  }, []);

  return null;
}
