import { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  userData: UserData | null; // Added userData
  loading: boolean;
  setUser: (user: User | null) => void;
  setUserData: (userData: UserData | null) => void; // Added setUserData
  setLoading: (loading: boolean) => void;
}
export interface DropdownMenu {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface SigninFormData {
  email: string;
  password: string;
}


export interface ForgetPasswordFormData {
  email: string;

}
