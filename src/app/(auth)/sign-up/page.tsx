// import { signUpSchema } from "../zodSchema";
// import { z } from "zod";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";

// type SignupFormData = z.infer<typeof signUpSchema>;
// const SignUp = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<SignupFormData>({
//     resolver: zodResolver(signUpSchema),
//   });

//   const onSubmit = (data: SignupFormData) => {
//     console.log("form submitted", data);
//   };

//   return <div></div>;
// };

// export default SignUp;
