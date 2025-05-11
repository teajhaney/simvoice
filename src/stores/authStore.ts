import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthState } from "@/types/authType";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

//initialising auth state listener
export const initialiseAuth = () => {
  const { setUser, setLoading } = useAuthStore.getState();
  onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
};
