import { create } from "zustand";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthState, UserData } from "@/types/authType";
import { fetchUserData } from "@/lib/authFunctions";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  userData: null,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
}));

//initialising auth state listener
export const initialiseAuth = () => {
  const { setUser, setLoading,setUserData } = useAuthStore.getState();
  onAuthStateChanged(auth,async (user) => {
	  setUser(user);
	    if (user) {
        try {
          const data = await fetchUserData(user.uid);
          setUserData(data as UserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    setLoading(false);
  });
};
