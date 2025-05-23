/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  UserCredential,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  SignupFormData,
  SigninFormData,
  ForgetPasswordFormData,
  UserData,
  ProfileFormData,
} from "@/types/authType";

import { updatePassword } from "firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useAuthStore } from "@/stores/authStore";

//sign up
export const firebaseSignUp = async (
  formData: SignupFormData
): Promise<UserCredential> => {
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
      useAuthStore.getState().setUserData(userData as UserData);
      useAuthStore.getState().setUser(user);
    } catch (firestoreError: any) {
      console.error(
        "Firestore error:",
        firestoreError.code,
        firestoreError.message
      );
      throw new Error(`Failed to save user data: ${firestoreError.message}`);
    }
    return userCredential; // to be used later when needed
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

export const firebaseSignIn = async (
  formData: SigninFormData
): Promise<UserCredential> => {
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
      useAuthStore.getState().setUserData(data as UserData);
      useAuthStore.getState().setUser(user);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }
    return userCredential;
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
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setUserData(null);
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
      useAuthStore.getState().setUserData(userData as UserData);
    } else {
      const data = await fetchUserData(user.uid);
      useAuthStore.getState().setUserData(data as UserData);
    }
    useAuthStore.getState().setUser(user);
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

//update profile
export const updateUserData = async (uid: string, data: ProfileFormData) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
};

//change password
export const changePassword = async (newPassword: string) => {
  if (!auth.currentUser) return;

  try {
    await updatePassword(auth.currentUser, newPassword);
    console.log("Password updated successfully");
  } catch (error) {
    console.error("Failed to update password", error);
  }
};

//re authenticate
export const reauthenticate = async (email: string, password: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    console.log("Reauthenticated");
  } catch (error) {
    console.error("Reauthentication failed", error);
  }
};

// delete user

export const deleteAccountSecurely = async (
  email: string,
  password: string
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is currently signed in.");

  try {
    // Reauthenticate first
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete Firestore user data
    await deleteDoc(doc(db, "users", user.uid));

    // Delete auth account
    await deleteUser(user);
    console.log("User account and data deleted.");
  } catch (error: any) {
    if (error.code === "auth/requires-recent-login") {
      throw new Error("Please log in again before deleting your account.");
    }
    throw new Error(error.message || "Failed to delete account.");
  }
};
