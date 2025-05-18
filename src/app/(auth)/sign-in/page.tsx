import { LoginForm } from "@/component";
import { GuestOnlyRoute } from "@/routes/GuestOnlyRoute";

const SignIn = () => {
  return (
    <GuestOnlyRoute>
      <LoginForm />
    </GuestOnlyRoute>
  );
};

export default SignIn;
