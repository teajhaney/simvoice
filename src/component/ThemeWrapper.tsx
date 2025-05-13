"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Set initial theme
    const initialTheme = useThemeStore.getState().theme;
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Subscribe to theme changes
    const unsubscribe = useThemeStore.subscribe((state) => {
      document.documentElement.setAttribute("data-theme", state.theme);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
