"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

interface Props {
  children: React.ReactNode;
}

export const GuestOnlyRoute = ({ children }: Props) => {
  const router = useRouter();
  const { user, loading, userData } = useAuthStore();

  useEffect(() => {
    if (!loading && user && userData) {
      router.replace("/");
    }
  }, [user, loading, router, userData]);

  if (loading || (user && userData)) return null;

  return <>{children}</>;
};


