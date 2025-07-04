import { ReactNode, useEffect } from "react";
import Loading from "./Loading";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/User";

export default function CheckAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isLoading, isError } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isError && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [isError, router]);

  if (pathname === "/login" || pathname === "/register") {
    return children;
  }

  if (isLoading) {
    return (
      <div className="auth-loading-container">
        <Loading />
        <span>trying to authorize...</span>
      </div>
    );
  }

  return children;
}
