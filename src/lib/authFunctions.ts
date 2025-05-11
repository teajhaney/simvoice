/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

import { SignupFormData, SigninFormData } from "@/types/authType";

export const firebaseSignUp = async (formData: SignupFormData) => {
  try {
    const { email, password } = formData;
    // Create user with Firebase authentication
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error(
          "This email is already registered. Please sign in or use a different email."
        );
      case "auth/invalid-email":
        throw new Error("Please enter a valid email address.");
      case "auth/weak-password":
        throw new Error(
          "Password is too weak. It must be at least 6 characters long."
        );
      default:
        throw new Error("Failed to sign up. Please try again.");
    }
  }
};

export const firebaseSignIn = async (formData: SigninFormData) => {
  try {
    const { email, password } = formData;
    // login user with Firebase authentication
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email. Please sign up.");
      case "auth/invalid-credential":
        throw new Error("Incorrect email or password. Please try again.");
      case "auth/too-many-requests":
        throw new Error("Too many attempts. Please try again later.");
      default:
        throw new Error(
          "Failed to sign in. Please check your credentials and try again."
        );
    }
  }
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
