import { ref } from "vue";
import {
  signUp,
  login,
  logout,
  watchAuthState,
  updateUserProfile,
} from "@/firebase/auth";

const currentUser = ref(null);

watchAuthState((user) => {
  currentUser.value = user;
});

export function useAuth() {
  return {
    currentUser,
    signUp,
    login,
    logout,
    updateUserProfile, // 新增
  };
}
