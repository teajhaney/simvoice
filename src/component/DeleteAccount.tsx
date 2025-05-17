/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuthStore } from "@/stores/authStore";
import { errorStyles, inputDiv, inputStyles, labelStyles } from "@/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";
import { deleteAccountSecurely } from "@/lib/authFunctions";
import { Button } from "@/component";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountSchema } from "../lib/zodSchema";
import { SlEye } from "react-icons/sl";
import { HiOutlineEyeSlash } from "react-icons/hi2";

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;
const DeleteAccount = () => {
  const { user, userData } = useAuthStore((state) => state);
  const [password, setPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });
  //

  //delete handler
  const onSubmit = async (data: DeleteAccountFormData) => {
    if (!userData?.email) return;

    try {
      setIsLoading(true);
      await deleteAccountSecurely(userData.email, data.password);
      toast.success("Account deleted successfully.");
      navigate.push("/");
      // Optionally redirect or clear app state here
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="my-10 ">
      {user && userData && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl space-y-5 shdow py-10">
            <div className="w-full space-y-5  rounded-tl-2xl rounded-tr-2xl px-10">
              <h2 className="text-red500">Danger Zone</h2>
              <div className={inputDiv}>
                <label htmlFor="newPassword" className={labelStyles}>
                  New Passsword
                </label>
                <div className="relative">
                  <input
                    type={password ? "text" : "password"}
                    id="password"
                    {...register("password")}
                    className={inputStyles}
                  />
                  <Button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center "
                    onClick={() => {
                      setPassword(!password);
                    }}>
                    {password ? (
                      <SlEye className="text-accent text-2xl cursor-pointer" />
                    ) : (
                      <HiOutlineEyeSlash className="text-accent text-2xl cursor-pointer" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className={errorStyles}>{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="px-10 ">
              <Button
                type="submit"
                disabled={isLoading}
                className="  w-fit bg-red500 center rounded p-2 hover:shdow-[0px_4px_8px_#598392] cursor-pointer">
                {" "}
                <p className="text-white">Close Account</p>
              </Button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default DeleteAccount;
