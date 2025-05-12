"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/component";
import { IoMenuSharp } from "react-icons/io5";

const NavigationBar = () => {
  const navigate = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      label: "Home",
      link: "/",
    },
    {
      label: "History",
      link: "/history",
    },
  ];
  return (
    <nav className="bg-background h-14 shadow text-textColor">
      <div className="appMarginX flex gap-10  items-center max-md:justify-between h-full ">
        <div className="" onClick={() => navigate.push("/")}>
          <p className="text-2xl font-bold text-primary">simvoice</p>
        </div>
        <div className=" md:w-full flex items-center justify-between max-md:hidden">
          {/* nav items */}
          <ul className="flex items-center gap-10">
            {navigationItems.map((navigationItem, index) => (
              <Link
                key={`${navigationItem.label}-${navigationItem.link}-${index}`}
                href={navigationItem.link}>
                <li
                  className={`cursor-pointer font-medium text-md  pb-1 ${
                    pathname === navigationItem.link
                      ? " text-primary font-black"
                      : "text-textColor"
                  }`}>
                  {navigationItem.label}
                </li>
              </Link>
            ))}
          </ul>
          {/*  */}
          <div className="flex gap-10 items-center">
            <Button
              type="button"
              className=" cursor-pointer bg-white py-2 px-3 rounded hover:shadow"
              onClick={() => {
                navigate.push("/sign-in");
              }}>
              <p className="">Sign In</p>
            </Button>
            <Button
              type="button"
              className="cursor-pointer bg-primary py-2 px-3 rounded hover:shadow"
              onClick={() => {
                navigate.push("/sign-up");
              }}>
              <p className="text-white">Sign Up</p>
            </Button>
          </div>
        </div>
        {/* menu */}
        <Button
          className="md:hidden rounded-lg border border-gray200 p-2"
          onClick={() => {}}>
          <IoMenuSharp className="text-primary text-xl font-bold" />
        </Button>
      </div>
    </nav>
  );
};

export default NavigationBar;
