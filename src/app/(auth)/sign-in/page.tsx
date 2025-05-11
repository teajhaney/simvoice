/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { signInSchema } from "../zodSchema";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LooadingSpinner } from "@/util/utils";
import { firebaseSignIn, firebaseSignOut } from "@/lib/authFunctions";

type SigninFormData = z.infer<typeof signInSchema>;
const SignIn = () => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    console.log("form submitted", data);
    setIsLoading(true);
    try {
      await firebaseSignIn(data); // Call firebaseSignIn function with the form data
      console.log("User signed in successfully");
      setIsLoading(false);
      firebaseSignOut();
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
        <h1 className="center font-bold text-3xl">Sign In</h1>
        <p className="center text-accent">Welcome back</p>
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
            onFocus={() => setAuthError(null)}
          />
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>
        {/* password */}
        <div className={inputDiv}>
          <div className="flex justify-between">
            <label htmlFor="email" className={lableStyles}>
              Passoword
            </label>
            <p className={clsx(lableStyles, "text-accent cursor-pointer")}>
              Forget password?
            </p>
          </div>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={inputStyles}
            onFocus={() => setAuthError(null)}
          />
          {errors.password && (
            <p className={errorStyles}>{errors.password.message}</p>
          )}
        </div>
        {/* checkbox for keep me logged in */}
        <div className="flex items-center space-x-2 text-white mt-4">
          <input
            type="checkbox"
            id="keepLoggedIn"
            name="keepLoggedIn"
            className="w-4 h-4  rounded "
          />
          <label
            htmlFor="keepLoggedIn"
            className={clsx(lableStyles, "text-accent")}>
            Keep me logged in
          </label>
        </div>
        {authError && (
          <p className={errorStyles + " text-center"}>{authError}</p>
        )}{" "}
        {/* Display Firebase errors */}
        {/* sign in button */}
        <Button
          type="submit"
          className="w-full bg-primary center rounded p-3 hover:shadow-[0px_4px_8px_#598392] cursor-pointer"
          onClick={() => {}}>
          {" "}
          {isLoading ? (
            <LooadingSpinner className="border-white h-6 w-6 border-dashed border-2" />
          ) : (
            <p className="text-white">Sign in</p>
          )}
        </Button>
        {/* google sign button */}
        <Button
          type="button"
          className="self-center  border border-primary center rounded py-3 px-5 hover:shadow cursor-pointer gap-10 w-full"
          onClick={() => {}}>
          {" "}
          <Image
            src="/images/google.svg"
            alt="google logo"
            width={24}
            height={24}
          />
          <p className="text-primary font-medium max-md:text-sm">
            Sign in with Google
          </p>
        </Button>
        <p className="center text-sm">
          Don&apos;t have an account yet? {"   "}
          <span
            className=" text-accent ml-1 cursor-pointer"
            onClick={() => {
              navigate.push("/sign-up");
            }}>
            Sign Up.
          </span>
        </p>
      </form>
    </main>
  );
};

export default SignIn;
