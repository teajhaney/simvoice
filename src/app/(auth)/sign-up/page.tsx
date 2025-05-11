/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { signUpSchema } from "../zodSchema";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LooadingSpinner } from "@/util/utils";
import { firebaseSignUp } from "@/lib/authFunctions";
type SignupFormData = z.infer<typeof signUpSchema>;
const SignUp = () => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
	  clearErrors,
	reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log("form submitted", data);
    setIsLoading(true);
    try {
      await firebaseSignUp(data); // Call firebaseSignUp function with the form data
      console.log("User signed up successfully");
		setIsLoading(false);
		reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setAuthError(error.message); // Display Firebase error
    } finally {
      setIsLoading(false);
    }
  };
  const inputDiv = "flex flex-col gap-2";
  const errorStyles = "text-red500 text-sm";
  const lableStyles = "block text-sm lg:text-md ";
  const inputStyles =
    "w-full border-1 border-gray200 p-3 rounded  focus:border-1 focus:outline-none focus:border-gray200 transition-colors duration-200 focus:shadow-md";
  return (
    <main className="mx-3 2xl:mx-auto h-screen center-col gap-10">
      <h1>
        <span className="font-medium text-3xl">Simvoice</span>.com
      </h1>
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white h-fit p-10 rounded shadow w-full md:w-150 lg:w-200 2xl:w-250 space-y-5">
        <h1 className="center font-bold text-3xl">Create a free account</h1>
        <p className="center text-accent">
          Gain access to more features with an Simvoice account.
        </p>
        {/* first name and last name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className={clsx(inputDiv, "w-full")}>
            <label htmlFor="email" className={lableStyles}>
              First Name
            </label>
            <input
              type="firstName"
              id="firstName"
              {...register("firstName")}
              className={inputStyles}
            />
            {errors.firstName && (
              <p className={errorStyles}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={clsx(inputDiv, "w-full")}>
            <label htmlFor="lastName" className={lableStyles}>
              Last Name
            </label>
            <input
              type="lastName"
              id="lastName"
              {...register("lastName")}
              className={inputStyles}
            />
            {errors.lastName && (
              <p className={errorStyles}>{errors.lastName.message}</p>
            )}
          </div>
        </div>
        {/* email */}
        <div className={inputDiv}>
          <label htmlFor="email" className={lableStyles}>
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={inputStyles}
          />
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>
        {/* password */}
        <div className={inputDiv}>
          <label htmlFor="password" className={lableStyles}>
            Password
          </label>

          <input
            type="password"
            id="password"
            {...register("password")}
            className={inputStyles}
          />
          {errors.password && (
            <p className={errorStyles}>{errors.password.message}</p>
          )}
        </div>
        {/* confirm password */}
        <div className={inputDiv}>
          <label htmlFor="confirmPassword" className={lableStyles}>
            Confirm Password
          </label>

          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            className={inputStyles}
          />
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
              className={clsx(lableStyles, "text-accent")}>
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
          className="w-full bg-primary center rounded p-3 hover:shadow-[0px_4px_8px_#598392] cursor-pointer"
          onClick={() => {}}>
          {" "}
          {isLoading ? (
            <LooadingSpinner className="border-white h-6 w-6 border-dashed border-2" />
          ) : (
            <p className="text-white">Sign up</p>
          )}
        </Button>
        <p className="center text-sm">
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
