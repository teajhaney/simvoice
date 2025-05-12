"use client";
import { useEffect } from "react";
import { initialiseAuth } from "@/stores/authStore";

function AppInitializer() {
  useEffect(() => {
    initialiseAuth();
  }, []);
  return null;
}

export default AppInitializer;
