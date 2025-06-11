import { ref, computed } from "vue";
import {
  signUp,
  login,
  logout,
  watchAuthState,
  updateUserProfile,
} from "@/firebase/auth";

const currentUser = ref(null);

// 檢查是否有訪客用戶
const checkGuestUser = () => {
  const guestUser = localStorage.getItem("guestUser");
  if (guestUser) {
    currentUser.value = JSON.parse(guestUser);
  }
};

// 初始化時檢查訪客用戶
checkGuestUser();

watchAuthState((user) => {
  currentUser.value = user;
});

// 添加 isLoggedIn 計算屬性
const isLoggedIn = computed(() => {
  return currentUser.value !== null;
});

export function useAuth() {
  return {
    currentUser,
    isLoggedIn, // 導出 isLoggedIn 狀態
    signUp,
    login,
    logout: async () => {
      // 清除訪客資訊
      localStorage.removeItem("guestUser");
      await logout();
      currentUser.value = null;
    },
    updateUserProfile,
  };
}
