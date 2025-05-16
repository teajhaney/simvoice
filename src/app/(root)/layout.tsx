"use client";
import { DropdownMenu, NavigationBar } from "@/component";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {

	
  return (
    <div className="flex flex-col bg-customBackground text-textColor">
      <NavigationBar />
      <DropdownMenu />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
