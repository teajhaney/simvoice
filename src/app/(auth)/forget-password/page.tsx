/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { forgetPasswordSchema } from "../../../lib/zodSchema";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  errorStyles,
  inputDiv,
  inputStyles,
  lableStyles,
  LooadingSpinner,
  resetPasswordStyles,
} from "@/util/utils";
import { firebaseForgotPassword } from "@/lib/authFunctions";
import { CiMail } from "react-icons/ci";

////

type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
const ForgetPassword = () => {
  const navigate = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPasswordMessage, setShowResetPasswordMessage] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    console.log("form submitted", data);
    setIsLoading(true);

    try {
      const result = await firebaseForgotPassword(data); // Call firebaseSignIn function with the form data
      console.log("reset password succesfull sent");
      setShowResetPasswordMessage(result.message);
      reset();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(error.message); // Display Firebase error
    } finally {
      setIsLoading(false);
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
          Reset Password
        </h1>
        <p className="center text-accent">Input your registered email</p>
        {/* email */}
        <div className={inputDiv}>
          <label htmlFor="email" className={lableStyles}>
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
              onFocus={() => {
                setError(null);
                setShowResetPasswordMessage(null);
              }}
            />
          </div>
          {errors.email && (
            <p className={errorStyles}>{errors.email.message}</p>
          )}
        </div>
        <p className="text-green-500 text-[10px]">
          *Please provide a valid and registered email address. if you
          don&apos;t get an email, check if your email is correct.
        </p>
        {/* show messages */}
        {showResetPasswordMessage && (
          <p className={resetPasswordStyles + " text-center"}>
            {showResetPasswordMessage}
          </p>
        )}{" "}
        {error && <p className={errorStyles + " text-center"}>{error}</p>}{" "}
        {/* Display Firebase errors */}
        {/* sign in button */}
        <Button
          type="submit"
          className="w-full bg-primary center rounded p-3 hover:shdow-[0px_4px_8px_#598392] cursor-pointer"
          onClick={() => {}}>
          {" "}
          {isLoading ? (
            <LooadingSpinner className="border-white h-6 w-6 border-dashed border-2" />
          ) : (
            <p className="text-white">Reset password</p>
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

export default ForgetPassword;
