"use client";
import { navigationItems } from "@/contants";
import Link from "next/link";
import { Button } from "@/component";
import { usePathname, useRouter } from "next/navigation";
import { useDropdownMenuStore } from "@/stores/dropdownMenuStore";
import { useAuthStore } from "@/stores/authStore";
import { firebaseSignOut } from "@/lib/authFunctions";
import Image from "next/image";

///
const DropdownMenu = () => {
  const { toggleMenu, isMenuOpen } = useDropdownMenuStore((state) => state);
  const navigate = useRouter();
  const pathname = usePathname();
  const { user, userData, loading } = useAuthStore((state) => state);

  return (
    <div
      className={`md:hidden bg-background shdow overflow-hidden transition-all duration-300 ease-in-out text-textColor ${
        isMenuOpen ? "max-h-96" : "max-h-0"
      }`}>
      <div className="appMarginX py-4 flex flex-col gap-4">
        <ul className="flex flex-col gap-4" onClick={() => toggleMenu()}>
          {navigationItems.map((navigationItem, index) => (
            <Link
              key={`${navigationItem.label}-${navigationItem.link}-${index}`}
              href={navigationItem.link}>
              <li
                className={`cursor-pointer font-medium text-md ${
                  pathname === navigationItem.link
                    ? "text-primary font-black"
                    : "text-textColor"
                }`}>
                {navigationItem.label}
              </li>
            </Link>
          ))}
        </ul>
        {!loading && ( // Only render auth-dependent UI once loading is false
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-200 mt-4">
            {user && userData ? (
              <>
                <div className="flex items-center gap-2 ">
                  <Image
                    src="/images/profile-placeholder.jpeg"
                    alt="Image Description"
                    width={50}
                    height={50}
                    placeholder="blur"
                    blurDataURL="/images/profile-placeholder.jpeg"
                  />
                  <div className="flex flex-col ">
                    <p className="text-sm">
                      {" "}
                      {userData.firstName} {userData.lastName}
                    </p>
                    <p className="text-gray-500 text-sm"> {userData.email}</p>
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
                  className="text-md px-3 text-red500 "
                  onClick={() => {
                    toggleMenu();
                    firebaseSignOut();
                    navigate.push("/");
                  }}>
                  {" "}
                  Sign out
                </p>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-full bg-white py-2 px-3 rounded hover:shdow text-center cursor-pointer"
                  onClick={() => {
                    toggleMenu();
                    navigate.push("/sign-in");
                  }}>
                  <p>Sign In</p>
                </Button>
                <Button
                  type="button"
                  className="w-full bg-primary py-2 px-3 rounded hover:shdow text-center cursor-pointer"
                  onClick={() => {
                    toggleMenu();
                    navigate.push("/sign-up");
                  }}>
                  <p className="text-white">Sign Up</p>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropdownMenu;
