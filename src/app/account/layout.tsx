"use client";
import { DropdownMenu, NavigationBar, Footer } from "@/component";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthStore((state) => state);
  if (loading) return null;
  return (
    <ProtectedRoute>
      <div className="flex flex-col bg-customBackground text-textColor">
        <NavigationBar />
        <DropdownMenu />
        {children}
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
