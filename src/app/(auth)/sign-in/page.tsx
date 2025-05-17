/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { signInSchema } from "../../../lib/zodSchema";
// import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LooadingSpinner } from "@/util/utils";
import { firebaseSignIn, firebaseSignInWithGoogle } from "@/lib/authFunctions";
import { CiMail, CiLock } from "react-icons/ci";
import { SlEye } from "react-icons/sl";
import { HiOutlineEyeSlash } from "react-icons/hi2";

import { errorStyles, inputDiv, inputStyles, labelStyles } from "@/styles";
import { SigninFormData } from "@/types/authType";

// type SigninFormData = z.infer<typeof signInSchema>;
const SignIn = () => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
  });

  //sign
  const onSubmit = async (data: SigninFormData) => {
    try {
      setIsLoading(true);
      await firebaseSignIn(data);
      const toast = (await import("react-hot-toast")).default;
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

  //google
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await firebaseSignInWithGoogle();
      navigate.push("/");
    } catch (error: any) {
      setAuthError(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="mx-3 2xl:mx-auto py-5 min-h-screen center-col gap-10 ">
      <h1>
        <span className="font-medium text-3xl">Simvoice</span>.com
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col bg-white h-fit p-10 rounded shdow w-full max-w-md sm:max-w-lg lg:max-w-2xl space-y-5">
        <h1 className="text-primary center font-bold text-2xl lg:text-3xl">
          Sign In
        </h1>
        <p className="center text-accent">Welcome back</p>
        {/* email */}
        <div className={inputDiv}>
          <label htmlFor="email" className={labelStyles}>
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CiMail className="text-accent text-2xl" />
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
          <div className="flex justify-between">
            <label htmlFor="password" className={labelStyles}>
              Passoword
            </label>
            <p
              onClick={() => {
                navigate.push("/forget-password");
              }}
              className={clsx(labelStyles, "text-accent cursor-pointer")}>
              Forget password?
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CiLock className="text-accent text-2xl" />
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
        {/* Display Firebase errors */}
        {authError && (
          <p className={errorStyles + " text-center"}>{authError}</p>
        )}{" "}
        {/* sign in button */}
        <Button
          type="submit"
          className="w-full bg-primary center rounded p-3 hover:shdow-[0px_4px_8px_#598392] cursor-pointer">
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
          className="self-center  border border-primary center rounded py-3 px-5 hover:shdow cursor-pointer gap-10 w-full"
          onClick={() => handleGoogleSignIn()}>
          {" "}
          {isGoogleLoading ? (
            <LooadingSpinner className="border-primary h-6 w-6 border-dashed border-2" />
          ) : (
            <div className="center gap-10">
              {" "}
              <Image
                src="/images/google.svg"
                alt="google logo"
                width={24}
                height={24}
                className="h-auto w-auto"
              />
              <p className="text-primary font-medium max-md:text-sm">
                Sign in with Google
              </p>
            </div>
          )}
        </Button>
        <p className="center text-sm text-primary">
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
