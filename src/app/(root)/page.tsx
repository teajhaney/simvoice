"use client";

import { initialiseAuth } from "@/stores/authStore";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    initialiseAuth();
  }, []);
  return (
    <div className=" flex flex-col">
      <p className="text-red-500">hellp home</p>
    </div>
  );
}
