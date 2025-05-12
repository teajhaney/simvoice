import { create } from "zustand";
import { DropdownMenu } from "@/types/authType";

export const useDropdownMenuStore = create<DropdownMenu>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
