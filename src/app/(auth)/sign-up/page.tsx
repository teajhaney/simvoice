"use client";
import { signUpSchema } from "../zodSchema";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/component";
import { useRouter } from "next/navigation";
type SignupFormData = z.infer<typeof signUpSchema>;
const SignUp = () => {
  const navigate = useRouter();
  //   const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log("form submitted", data);
    try {
      //   setIsLoading(true);
      // Simulate a network request
      setTimeout(() => {
        console.log("Form submitted successfully");
        reset();
        // setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      //   setIsLoading(false);
    }
  };
  const inputDiv = "flex flex-col gap-2";
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
          Gain access to more features with an Invoice-Generator.com account.
        </p>
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
            <p className="text-red500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className={inputDiv}>
          <label htmlFor="email" className={lableStyles}>
            Passoword
          </label>

          <input
            type="password"
            id="password"
            {...register("password")}
            className={inputStyles}
          />
          {errors.password && (
            <p className="text-red500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 text-white mt-4">
          <input
            type="checkbox"
            {...register("agreeTerms")}
            id="keepLoggedIn"
            name="keepLoggedIn"
            className="w-4 h-4  rounded "
          />
          <label
            htmlFor="keepLoggedIn"
            className={clsx(lableStyles, "text-accent")}>
            I agree to the Terms of Service
          </label>
        </div>
        <Button
          className="w-full bg-primary center rounded p-3 hover:shadow-[0px_4px_8px_#598392] cursor-pointer"
          onClick={() => {}}>
          {" "}
          <p className="text-white">Sign in</p>
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
