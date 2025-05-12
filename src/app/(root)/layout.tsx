"use client";
import { DropdownMenu, NavigationBar } from "@/component";
import { useDropdownMenuStore } from "@/stores/dropdownMenuStore";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMenuOpen = useDropdownMenuStore((state) => state.isMenuOpen);
  return (
    <div className="flex flex-col">
      <NavigationBar />
      {isMenuOpen && <DropdownMenu />}
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
