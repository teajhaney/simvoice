"use client";

import { errorStyles, inputDiv, inputStyles, labelStyles } from "@/styles";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

import toast from "react-hot-toast";
import { changePassword, reauthenticate } from "@/lib/authFunctions";
import { Button } from "@/component";
import { LooadingSpinner } from "@/util/utils";
import { useState } from "react";
import { changePasswordSchema } from "../lib/zodSchema";
import { SlEye } from "react-icons/sl";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { auth } from "@/lib/firebase";

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user?.email) throw new Error("User not logged in.");

      // 1. Re-authenticate first
      await reauthenticate(user.email, data.currentPassword);
      await changePassword(data.newPassword);
      toast.success("password updated successfully!");
      reset();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-20 space-y-5">
      <h1 className="text-lg font-bold">Change Email Address or Password</h1>
      <hr className="border-b border-gray200" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col  space-y-5">
        <div className="w-full flex flex-col md:flex-row  md:gap-20">
          {/* current password */}
          <div className={inputDiv + "w-full"}>
            <label htmlFor="currentPassword" className={labelStyles}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={currentPassword ? "text" : "password"}
                id="currentPassword"
                {...register("currentPassword")}
                className={inputStyles}
              />
              <Button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center "
                onClick={() => {
                  setCurrentPassword(!currentPassword);
                }}>
                {currentPassword ? (
                  <SlEye className="text-accent text-2xl cursor-pointer" />
                ) : (
                  <HiOutlineEyeSlash className="text-accent text-2xl cursor-pointer" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className={errorStyles}>{errors.currentPassword.message}</p>
            )}
          </div>
          {/* password */}
          <div className={inputDiv + "w-full"}>
            <label htmlFor="newPassword" className={labelStyles}>
              New Passsword
            </label>

            <div className="relative">
              <input
                type={newPassword ? "text" : "password"}
                id="newPassword"
                {...register("newPassword")}
                className={inputStyles}
              />
              <Button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center "
                onClick={() => {
                  setNewPassword(!newPassword);
                }}>
                {newPassword ? (
                  <SlEye className="text-accent text-2xl cursor-pointer" />
                ) : (
                  <HiOutlineEyeSlash className="text-accent text-2xl cursor-pointer" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p className={errorStyles}>{errors.newPassword.message}</p>
            )}
          </div>
        </div>
        <hr className="border-b border-gray200" />
        <Button
          type="submit"
          className="w-fit bg-primary center rounded py-3 px-5 hover:shdow-[0px_4px_8px_#598392] cursor-pointer">
          {" "}
          {isLoading ? (
            <LooadingSpinner className="border-white  h-6 w-6 border-dashed border-2" />
          ) : (
            <p className="text-white">Save</p>
          )}
        </Button>
      </form>
    </section>
  );
};

export default ChangePassword;
