"use client";
import { navigationItems } from "@/contants";
import Link from "next/link";
import { Button } from "@/component";
import { usePathname, useRouter } from "next/navigation";
import { useDropdownMenuStore } from "@/stores/dropdownMenuStore";

const DropdownMenu = () => {
  const { toggleMenu, isMenuOpen } = useDropdownMenuStore((state) => state);
  const navigate = useRouter();
  const pathname = usePathname();
  return (
    <div
      className={`md:hidden bg-background shadow overflow-hidden transition-all duration-300 ease-in-out text-textColor ${
        isMenuOpen ? "max-h-96" : "max-h-0"
      }`}>
      <div className="appMarginX py-4 flex flex-col gap-4">
        <ul className="flex flex-col gap-4">
          {navigationItems.map((navigationItem, index) => (
            <Link
              key={`${navigationItem.label}-${navigationItem.link}-${index}`}
              href={navigationItem.link}
              onClick={() => toggleMenu()}>
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
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            className="w-full bg-white py-2 px-3 rounded hover:shadow text-center"
            onClick={() => {
              navigate.push("/sign-in");
            }}>
            <p>Sign In</p>
          </Button>
          <Button
            type="button"
            className="w-full bg-primary py-2 px-3 rounded hover:shadow text-center"
            onClick={() => {
              navigate.push("/sign-up");
            }}>
            <p className="text-white">Sign Up</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
