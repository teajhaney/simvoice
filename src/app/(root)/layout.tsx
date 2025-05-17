"use client";
import { DropdownMenu, NavigationBar, Footer } from "@/component";
import { useAuthStore } from "@/stores/authStore";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuthStore((state) => state);
  if (loading) return null;
  return (
    <div className="flex flex-col bg-customBackground text-textColor">
      <NavigationBar />
      <DropdownMenu />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
