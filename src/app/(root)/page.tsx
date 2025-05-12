"use client";

import { initialiseAuth } from "@/stores/authStore";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    initialiseAuth();
  }, []);
  return <div className="text-red-500">hello page</div>;
}
