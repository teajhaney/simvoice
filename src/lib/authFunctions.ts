/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  SignupFormData,
  SigninFormData,
  ForgetPasswordFormData,
  UserData,
} from "@/types/authType";
import { authStoreActions } from "@/stores/authStore";

export const firebaseSignUp = async (formData: SignupFormData) => {
  try {
    const { email, password, firstName, lastName } = formData;
    // Create user with Firebase authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Save user data to Firestore
    try {
      const userData = {
        firstName,
        lastName,
        email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
      // Update Zustand store with user data
      authStoreActions.setUserData(userData as UserData);
      authStoreActions.setUser(user);
    } catch (firestoreError: any) {
      console.error(
        "Firestore error:",
        firestoreError.code,
        firestoreError.message
      );
      throw new Error(`Failed to save user data: ${firestoreError.message}`);
    }
    return user; // to be used later when needed
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

///sign in

export const firebaseSignIn = async (formData: SigninFormData) => {
  try {
    const { email, password } = formData;
    // Login user with Firebase authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Fetch and store user data
    try {
      const data = await fetchUserData(user.uid);
      authStoreActions.setUserData(data as UserData);
      authStoreActions.setUser(user);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
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
//sign out
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    authStoreActions.setUser(null);
    authStoreActions.setUserData(null);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

//forget password functions
export const firebaseForgotPassword = async (
  formData: ForgetPasswordFormData
) => {
  try {
    const { email } = formData;
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error: any) {
    let errorMessage = "Failed to send password reset email. Please try again.";
    if (error.message === "No account found with this email.") {
      errorMessage = error.message;
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many requests. Try again later.";
    }
    throw new Error(errorMessage);
  }
};

//google sign in
export const firebaseSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-In successful for:", user.email);

    // Check if user data already exists in Firestore, if not, create it
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // User is new or data is missing, create it
      // Attempt to parse displayName for firstName and lastName
      const displayName = user.displayName || "";
      const nameParts = displayName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const userData = {
        firstName,
        lastName,
        email: user.email,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, userData);
      console.log(
        "Created new user document in Firestore for Google Sign-In user:",
        user.uid
      );
      authStoreActions.setUserData(userData as UserData);
    } else {
      const data = await fetchUserData(user.uid);
      authStoreActions.setUserData(data as UserData);
    }
    authStoreActions.setUser(user);
    return {
      success: true,
      user,
    };
  } catch (error: any) {
    console.error("Google Sign-In error:", {
      code: error.code,
      message: error.message,
    });
    let errorMessage = "Failed to sign in with Google. Please try again.";
    if (error.code === "auth/popup-closed-by-user") {
      errorMessage = "Google Sign-In was canceled.";
    } else if (error.code === "auth/account-exists-with-different-credential") {
      errorMessage =
        "An account already exists with this email. Try signing in with email/password.";
    }
    throw new Error(errorMessage);
  }
};

// Fetch user data from Firestore
export const fetchUserData = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User data not found.");
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch user data: ${error.message}`);
  }
};

// Example in a root client component (e.g., app/layout.tsx or a specific client provider)
import { useEffect } from "react";
import { initialiseAuth } from "@/stores/authStore";

function AppInitializer() {
  useEffect(() => {
    initialiseAuth();
  }, []);
  return null; // This component doesn't render anything itself
}

// Then use <AppInitializer /> in your layout
export default AppInitializer;
