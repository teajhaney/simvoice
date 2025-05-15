"use client";

import { InvoiceForm } from "@/component";
import { useAuthStore } from "@/stores/authStore";
import { LooadingSpinner } from "@/util/utils";

export default function Home() {
  const { userData, loading } = useAuthStore();

  // Show spinner only if no cached userData and still loading
  if (loading && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LooadingSpinner className="border-primary h-8 w-8 border-dashed border-2" />
      </div>
    );
  }

  return (
    <div className=" flex flex-col bg-customBackground ">
      <InvoiceForm />
    </div>
  );
}
