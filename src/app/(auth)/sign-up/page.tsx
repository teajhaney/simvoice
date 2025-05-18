import { SignupForm } from "@/component";
import { GuestOnlyRoute } from "@/routes/GuestOnlyRoute";

const SignUp = () => {
  return (
    <GuestOnlyRoute>
      <SignupForm />
    </GuestOnlyRoute>
  );
};

export default SignUp;
