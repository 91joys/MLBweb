import { auth } from "./firebase-init";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

export const signUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const watchAuthState = (callback) => {
  onAuthStateChanged(auth, callback);
};

// 新增：更新使用者名稱
export const updateUserProfile = (displayName) =>
  updateProfile(auth.currentUser, { displayName });
