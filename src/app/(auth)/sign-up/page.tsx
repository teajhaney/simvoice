/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { signUpSchema } from "../../../lib/zodSchema";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LooadingSpinner } from "@/util/utils";
import { firebaseSignUp } from "@/lib/authFunctions";
import { CiMail, CiLock } from "react-icons/ci";
import { SlEye } from "react-icons/sl";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { IoPersonOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { errorStyles, inputDiv, inputStyles, labelStyles } from "@/styles";

type SignupFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
  });

  //sign up
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      await firebaseSignUp(data); // Call firebaseSignUp function with the form data

      toast.success("User signed in successfully");
      navigate.push("/");
      reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setAuthError(error.message); // Display Firebase error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-3 2xl:mx-auto py-5 min-h-screen  center-col gap-10 ">
      <h1>
        <span className="font-medium text-3xl">Simvoice</span>.com
      </h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white h-fit p-10 rounded shdow w-full max-w-md sm:max-w-lg lg:max-w-2xl space-y-5">
        <h1 className="text-primary center font-bold text-2xl sm:text-3xl">
          Create a free account
        </h1>
        <p className="center text-accent text-sm lg:text-md text-center">
          Gain access to more features with an Simvoice account.
        </p>
        {/* first name and last name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className={clsx(inputDiv, "w-full")}>
            <label htmlFor="email" className={labelStyles}>
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IoPersonOutline className="text-accent text-xl sm:text-2xl" />
              </div>

              <input
                type="firstName"
                id="firstName"
                placeholder="First Name"
                {...register("firstName")}
                className={inputStyles}
                onFocus={() => setAuthError(null)}
              />
            </div>

            {errors.firstName && (
              <p className={errorStyles}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={clsx(inputDiv, "w-full")}>
            <label htmlFor="lastName" className={labelStyles}>
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <IoPersonOutline className="text-accent text-xl sm:text-2xl" />
              </div>
              <input
                type="lastName"
                id="lastName"
                placeholder="Last Name"
                {...register("lastName")}
                className={inputStyles}
                onFocus={() => setAuthError(null)}
              />
            </div>
            {errors.lastName && (
              <p className={errorStyles}>{errors.lastName.message}</p>
            )}
          </div>
        </div>
        {/* email */}
        <div className={inputDiv}>
          <label htmlFor="email" className={labelStyles}>
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CiMail className="text-accent text-xl sm:text-2xl" />
            </div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              {...register("email")}
              className={inputStyles}
              onFocus={() => setAuthError(null)}
            />
          </div>
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>
        {/* password */}
        <div className={inputDiv}>
          <label htmlFor="password" className={labelStyles}>
            Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CiLock className="text-accent text-xl sm:text-2xl" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              {...register("password")}
              className={inputStyles}
              onFocus={() => setAuthError(null)}
            />
            <Button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center "
              onClick={() => {
                setShowPassword(!showPassword);
              }}>
              {showPassword ? (
                <SlEye className="text-accent text-xl sm:text-2xl cursor-pointer" />
              ) : (
                <HiOutlineEyeSlash className="text-accent text-xl sm:text-2xl cursor-pointer" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className={errorStyles}>{errors.password.message}</p>
          )}
        </div>
        {/* confirm password */}
        <div className={inputDiv}>
          <label htmlFor="confirmPassword" className={labelStyles}>
            Confirm Password
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CiLock className="text-accent text-xl sm:text-2xl" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={inputStyles}
              onFocus={() => setAuthError(null)}
            />
            <Button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center "
              onClick={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}>
              {showConfirmPassword ? (
                <SlEye className="text-accent text-xl sm:text-2xl cursor-pointer" />
              ) : (
                <HiOutlineEyeSlash className="text-accent text-xl sm:text-2xl cursor-pointer" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className={errorStyles}>{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <div className="flex items-center space-x-2">
            {" "}
            <input
              type="checkbox"
              {...register("agreeTerms")}
              id="agreeTerms"
              name="agreeTerms"
              className="w-4 h-4  rounded "
              onChange={(e) => {
                if (e.target.checked) {
                  clearErrors("agreeTerms");
                }
              }}
            />
            <label
              htmlFor="agreeTerms"
              className={clsx(labelStyles, "text-accent")}>
              I agree to the Terms of Service
            </label>
          </div>

          {errors.agreeTerms && (
            <p className={errorStyles}>{errors.agreeTerms.message}</p>
          )}
        </div>
        {authError && (
          <p className={errorStyles + " text-center"}>{authError}</p>
        )}{" "}
        {/* Display Firebase errors */}
        {/* sign up button */}
        <Button
          className="w-full bg-primary center rounded p-3 hover:shdow-[0px_4px_8px_#598392] cursor-pointer"
          onClick={() => {}}>
          {" "}
          {isLoading ? (
            <LooadingSpinner className="border-white h-6 w-6 border-dashed border-2" />
          ) : (
            <p className="text-white">Sign up</p>
          )}
        </Button>
        <p className="center text-sm text-primary">
          Already have an account? {"   "}
          <span
            className=" text-accent ml-1 cursor-pointer"
            onClick={() => {
              navigate.push("/sign-in");
            }}>
            Sign In.
          </span>
        </p>
      </form>
    </main>
  );
};

export default SignUp;
