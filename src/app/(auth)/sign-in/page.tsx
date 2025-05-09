// import { signInSchema } from "../zodSchema";
// import { z } from "zod";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";

// type SigninFormData = z.infer<typeof signInSchema>;
const SignIn = () => {
  //   const [isLoading, setIsLoading] = useState(false);
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //     reset,
  //   } = useForm<SigninFormData>({
  //     resolver: zodResolver(signInSchema),
  //   });

  //   const onSubmit = (data: SigninFormData) => {
  //     console.log("form submitted", data);
  //     try {
  //       setIsLoading(true);
  //       // Simulate a network request
  //       setTimeout(() => {
  //         console.log("Form submitted successfully");
  //         reset();
  //         setIsLoading(false);
  //       }, 2000);
  //     } catch (error) {
  //       console.error("Error submitting form:", error);
  //       setIsLoading(false);
  //     }
  //   };

  return (
    <main className="appMarginX">
      <div>
        <p>sign in</p>
        {/* <form action="" onSubmit={handleSubmit(onSubmit)}></form> */}
      </div>
    </main>
  );
};

export default SignIn;
