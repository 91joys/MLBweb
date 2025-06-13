<template>
  <div class="parent">
    <div class="nav-container">
      <div
        class="nav-item"
        :class="{ featured: selectedItem === '所有球員' }"
        @click="selectItem('所有球員')"
      >
        所有球員
      </div>
      <div class="separator"></div>
      <div
        class="nav-item"
        :class="{ featured: selectedItem === '投手' }"
        @click="selectItem('投手')"
      >
        投手
      </div>
      <div
        class="nav-item"
        :class="{ featured: selectedItem === '捕手' }"
        @click="selectItem('捕手')"
      >
        捕手
      </div>
      <div
        class="nav-item"
        :class="{ featured: selectedItem === '內野手' }"
        @click="selectItem('內野手')"
      >
        內野手
      </div>
      <div
        class="nav-item"
        :class="{ featured: selectedItem === '外野手' }"
        @click="selectItem('外野手')"
      >
        外野手
      </div>
    </div>

    <div class="right-section">
      <!-- 使用者選單 -->
      <div v-if="currentUser" class="user-menu">
        <div class="user-info" @click="toggleDropdown">
          <span class="user-name">
            {{ currentUser.displayName || currentUser.email }}
            <span v-if="currentUser.isGuest" class="guest-badge">訪客</span>
          </span>
          <span class="dropdown-arrow">▼</span>
        </div>
        <div v-if="showDropdown" class="dropdown">
          <button
            v-if="!currentUser.isGuest"
            @click="goToProfile"
            class="dropdown-item"
          >
            <span>個人資料</span>
          </button>
          <button @click="handleLogout" class="dropdown-item logout">
            <span>{{ currentUser.isGuest ? "結束訪問" : "登出" }}</span>
          </button>
        </div>
      </div>

      <!-- 未登入時顯示登入按鈕 -->
      <div v-else class="auth-buttons">
        <button @click="goToLogin" class="login-btn">登入</button>
      </div>

      <!-- AI 按鈕 -->
      <div class="ai-button-container">
        <div class="ai-button">
          <img class="ai-icon" alt="" src="@/assets/images/chat.svg" />
          <b class="ai-text">Q.AI</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const selectedItem = ref("所有球員");
const showDropdown = ref(false);

// 定義 emits
const emit = defineEmits(["position-selected"]);

const selectItem = (item) => {
  selectedItem.value = item;
  emit("position-selected", item);
};

const { currentUser, logout } = useAuth();
const router = useRouter();

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const goToProfile = () => {
  showDropdown.value = false;
  router.push("/profile");
};

const goToLogin = () => {
  router.push("/login");
};

const handleLogout = async () => {
  try {
    showDropdown.value = false;
    await logout();
    router.push("/login");
  } catch (err) {
    console.error("登出失敗:", err);
  }
};

// 點擊外部關閉下拉選單
const handleClickOutside = (event) => {
  if (!event.target.closest(".user-menu")) {
    showDropdown.value = false;
  }
};

// 監聽點擊事件
if (typeof window !== "undefined") {
  document.addEventListener("click", handleClickOutside);
}
</script>

<style scoped>
.parent {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  text-align: center;
  font-size: 36px;
  color: #fff;
  font-family: "Noto Sans TC";
  position: relative;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 3rem;
  justify-content: center;
}

.nav-item {
  font-weight: 300;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.nav-item.featured {
  font-size: 64px;
  font-weight: 900;
}

.separator {
  border-right: 1px solid #fff;
  height: 45px;
  margin: 0 1rem;
}

/* 右側區塊 */
.right-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 使用者選單樣式 */
.user-menu {
  position: relative;
  z-index: 1000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.user-name {
  color: white;
  font-size: 18px;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: white;
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-menu:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  min-width: 180px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid #e5e7eb;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 14px 18px;
  border: none;
  background: none;
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #005596;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* 認證按鈕 */
.auth-buttons {
  display: flex;
  gap: 8px;
}

.login-btn {
  background: #fff;
  color: #005596;
  border: 2px solid #fff;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: transparent;
  color: #fff;
  transform: translateY(-2px);
}

/* AI 按鈕樣式 */
.ai-button-container {
  position: relative;
}

.ai-button {
  position: relative;
  width: 193px;
  height: 76px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 38px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.ai-button:hover {
  transform: translateY(-2px);
}

.ai-icon {
  width: 46px;
  height: 46px;
  max-width: 100%;
  max-height: 100%;
}

.ai-text {
  font-size: 32px;
  color: #005596;
  font-family: "Century Gothic";
}

/* 響應式調整 */
@media (max-width: 1200px) {
  .nav-container {
    gap: 2rem;
  }

  .nav-item.featured {
    font-size: 48px;
  }

  .parent {
    font-size: 28px;
  }

  .right-section {
    flex-direction: column;
    gap: 0.5rem;
  }

  .ai-button {
    width: 150px;
    height: 60px;
  }

  .ai-text {
    font-size: 24px;
  }

  .user-name {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .parent {
    flex-direction: column;
    height: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .nav-container {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-item.featured {
    font-size: 36px;
  }

  .parent {
    font-size: 24px;
  }

  .right-section {
    flex-direction: row;
    gap: 1rem;
  }

  .ai-button {
    width: 120px;
    height: 50px;
  }

  .ai-text {
    font-size: 20px;
  }

  .ai-icon {
    width: 32px;
    height: 32px;
  }

  .user-name {
    font-size: 14px;
    max-width: 100px;
  }

  .dropdown {
    min-width: 150px;
  }
}

.guest-badge {
  background: #f59e0b;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}
</style>
