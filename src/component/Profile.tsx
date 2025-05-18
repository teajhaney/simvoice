"use client";

import { updateUserData } from "@/lib/authFunctions";
import { profileSchema } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/authStore";
import { errorStyles, inputDiv, inputStyles, labelStyles } from "@/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ChangePassword, DeleteAccount } from "@/component";
import { LooadingSpinner } from "@/util/utils";

type ProfileFormData = z.infer<typeof profileSchema>;
const Profile = () => {
  const { user, userData } = useAuthStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
    },
  });
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      });
    }
  }, [userData, reset]);
  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.uid) return;
    try {
      setIsLoading(true);
      await updateUserData(user.uid, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      const toast = (await import("react-hot-toast")).default;
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="my-10 appMarginX bg-background rounded p-5 space-y-5">
      <h1 className="text-3xl text-center">My Account</h1>
      <h1 className=" text-center">
        Manage your user account, including your contact and sign in
        information.
      </h1>
      {user && userData && (
        <div className="space-y-10">
          <div className="space-y-5">
            <h1 className="">Email</h1>
            <h1 className=" ">{userData.email}</h1>
          </div>
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Change Profile</h1>
            <hr className="border-b border-gray200" />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col  space-y-5">
              <div className="w-full flex flex-col md:flex-row  md:gap-20">
                {/* first name */}
                <div className={inputDiv + "w-full"}>
                  <label htmlFor="email" className={labelStyles}>
                    First Name
                  </label>
                  <div>
                    <input
                      type="text"
                      id="firstName"
                      {...register("firstName")}
                      className={inputStyles}
                    />
                  </div>
                  {errors.firstName && (
                    <p className={errorStyles}>{errors.firstName.message}</p>
                  )}
                </div>
                {/* password */}
                <div className={inputDiv + "w-full"}>
                  <label htmlFor="lastName" className={labelStyles}>
                    Last Name
                  </label>

                  <div>
                    <input
                      type="text"
                      id="lastName"
                      {...register("lastName")}
                      className={inputStyles}
                    />
                  </div>
                  {errors.lastName && (
                    <p className={errorStyles}>{errors.lastName.message}</p>
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
          </div>
        </div>
      )}
      <ChangePassword />
      <DeleteAccount />
    </section>
  );
};

export default Profile;
