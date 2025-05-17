"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/component";
import { IoMenuSharp } from "react-icons/io5";
import { navigationItems } from "@/contants";
import { useDropdownMenuStore } from "@/stores/dropdownMenuStore";
import { useAuthStore } from "@/stores/authStore"; // Import the auth store
import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { firebaseSignOut } from "@/lib/authFunctions";
import { MdLightMode, MdOutlineLightMode } from "react-icons/md";
import { useThemeStore } from "@/stores/themeStore";
//
const NavigationBar = () => {
  const navigate = useRouter();
  const pathname = usePathname();
  const toggleMenu = useDropdownMenuStore((state) => state.toggleMenu);
  const { user, userData } = useAuthStore((state) => state);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { theme, toggleTheme } = useThemeStore((state) => state);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle outside click to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-background h-14 shdow text-textColor">
      <div className="appMarginX flex gap-10  items-center max-md:justify-between h-full ">
        <div className="cursor-pointer" onClick={() => navigate.push("/")}>
          <p className="text-2xl font-bold text-primary">Simvoice</p>
        </div>
        <div className=" md:w-full flex items-center justify-between max-md:hidden">
          {/* nav items */}
          <ul className="flex items-center gap-10">
            {navigationItems.map((navigationItem, index) => (
              <Link key={index} href={navigationItem.link}>
                <li
                  className={`cursor-pointer font-medium text-md  pb-1 ${
                    pathname === navigationItem.link
                      ? " text-primary  font-black"
                      : "text-textColor"
                  }`}>
                  {navigationItem.label}
                </li>
              </Link>
            ))}
          </ul>
          {/*  */}

          <div className=" flex gap-6 items-center " ref={menuRef}>
            {user && userData ? (
              <>
                <div
                  className="relative font-medium flex gap-2 items-center cursor-pointer"
                  onClick={() => setIsOpenMenu(!isOpenMenu)}>
                  <p> Hi, {userData.firstName || user.email}</p>
                  <MdKeyboardArrowDown />
                  {isOpenMenu && (
                    <div
                      ref={menuRef}
                      className="absolute bg-background index-x-0 w-60 rounded  p-2 shdow -bottom-40 right-0 flex flex-col gap-2 text-textColor z-100">
                      <div className="flex items-center gap-2 ">
                        <Image
                          src="/images/profile-placeholder.jpeg"
                          alt="Image Description"
                          width={50}
                          height={50}
                          placeholder="blur"
                          className="rounded-full"
                          blurDataURL="/images/profile-placeholder.jpeg"
                        />
                        <div className="flex flex-col ">
                          <p className="text-sm">
                            {" "}
                            {userData.firstName} {userData.lastName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {" "}
                            {userData.email}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-md  px-3 py-2 cursor-pointer ${
                          pathname === "/account"
                            ? " text-textColor bg-gray200 rounded "
                            : "text-textColor  "
                        }`}
                        onClick={() => navigate.push("/account")}>
                        {" "}
                        My Account
                      </p>
                      <hr className="border-b border-gray200" />
                      <p
                        className="text-md px-3 text-red500 cursor-pointer"
                        onClick={() => {
                          firebaseSignOut();
                          navigate.push("/");
                        }}>
                        {" "}
                        Sign out
                      </p>
                    </div>
                  )}
                </div>{" "}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className=" cursor-pointer border border-gray200 py-2 px-3 rounded hover:shdow "
                  onClick={() => {
                    setIsOpenMenu(!isOpenMenu);
                    navigate.push("/sign-in");
                  }}>
                  <p className="">Sign In</p>
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer bg-primary py-2 px-3 rounded hover:shdow "
                  onClick={() => {
                    setIsOpenMenu(!isOpenMenu);
                    navigate.push("/sign-up");
                  }}>
                  <p className="text-white">Sign Up</p>
                </Button>
              </>
            )}
          </div>
        </div>
        {/* mode */}
        <div className="flex gap-5">
          <Button
            type="button"
            className="p-2 rounded-lg border border-gray200"
            onClick={toggleTheme}>
            {theme === "light" ? (
              <MdOutlineLightMode className="text-textColor text-xl" />
            ) : (
              <MdLightMode className="text-textColor text-xl" />
            )}
          </Button>
          {/* menu */}
          <Button
            className="md:hidden rounded-lg border border-gray200 p-2"
            onClick={() => {
              toggleMenu();
            }}>
            <IoMenuSharp className="text-primary text-xl font-bold" />
          </Button>
        </div>
      </div>
      {/* mobile menu */}
    </nav>
  );
};

export default NavigationBar;
