<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const { currentUser, updateUserProfile, logout } = useAuth();
const router = useRouter();

const displayName = ref("");
const successMessage = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

// 當組件掛載時，設置初始值
onMounted(() => {
  displayName.value = currentUser.value?.displayName || "";
});

const handleUpdateProfile = async () => {
  if (!displayName.value.trim()) {
    errorMessage.value = "請輸入姓名";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await updateUserProfile(displayName.value.trim());
    successMessage.value = "名稱更新成功！";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => {
  try {
    await logout();
    router.push("/login");
  } catch (err) {
    console.error("登出失敗:", err);
  }
};

const goBack = () => {
  router.back();
};

const goToCards = () => {
  router.push("/card");
};
</script>

<template>
  <div class="profile-container">
    <div class="background-pattern"></div>

    <div class="profile-card">
      <!-- 返回按鈕 -->
      <button @click="goBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        返回
      </button>

      <!-- 頭像區域 -->
      <div class="avatar-section">
        <div class="avatar">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="user-info">
          <h2>{{ currentUser?.displayName || "用戶" }}</h2>
          <p class="user-email">{{ currentUser?.email }}</p>
        </div>
      </div>

      <!-- 表單區域 -->
      <div class="form-section">
        <h3>編輯個人資料</h3>

        <form @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-group">
            <label for="displayName">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              姓名
            </label>
            <input
              id="displayName"
              v-model="displayName"
              type="text"
              placeholder="請輸入您的姓名"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <polyline
                  points="22,6 12,13 2,6"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              電子郵件
            </label>
            <input
              id="email"
              :value="currentUser?.email"
              type="email"
              disabled
              readonly
            />
            <small class="help-text">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <path
                  d="M12 6v6M12 18h.01"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
              電子郵件無法修改
            </small>
          </div>

          <button type="submit" class="update-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner"></span>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ isLoading ? "更新中..." : "更新資料" }}
          </button>

          <!-- 新增：返回卡片介紹頁面按鈕 -->
          <button @click="goToCards" class="card-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="3"
                width="20"
                height="14"
                rx="2"
                ry="2"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="8"
                y1="21"
                x2="16"
                y2="21"
                stroke="currentColor"
                stroke-width="2"
              />
              <line
                x1="12"
                y1="17"
                x2="12"
                y2="21"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            返回卡片介紹
          </button>
        </form>
      </div>

      <!-- 消息提示 -->
      <div v-if="successMessage" class="success-message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
            stroke="currentColor"
            stroke-width="2"
          />
          <polyline
            points="22,4 12,14.01 9,11.01"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        <p>{{ successMessage }}</p>
      </div>

      <div v-if="errorMessage" class="error-message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="15"
            y1="9"
            x2="9"
            y2="15"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="9"
            y1="9"
            x2="15"
            y2="15"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        <p>{{ errorMessage }}</p>
      </div>

      <!-- 危險區域 -->
      <div class="danger-zone">
        <p>登出後需要重新輸入帳號密碼</p>
        <button @click="handleLogout" class="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="2"
            />
            <polyline
              points="16,17 21,12 16,7"
              stroke="currentColor"
              stroke-width="2"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>
          登出帳戶
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #005596 0%, #0066cc 50%, #0080ff 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 80%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.profile-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 0;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 85, 150, 0.1);
  border: 1px solid rgba(0, 85, 150, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #005596;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  z-index: 10;
}

.back-btn:hover {
  background: rgba(0, 85, 150, 0.2);
  transform: translateX(-2px);
}

.avatar-section {
  background: linear-gradient(135deg, #005596, #0066cc);
  padding: 60px 40px 40px;
  text-align: center;
  color: white;
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.avatar svg {
  color: white;
  width: 60px;
  height: 60px;
}

.user-info h2 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-email {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 400;
}

.form-section {
  padding: 40px;
}

.form-section h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 32px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group label svg {
  color: #6b7280;
}

.form-group input {
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
  background: #fff;
}

.form-group input:focus {
  border-color: #005596;
  box-shadow: 0 0 0 4px rgba(0, 85, 150, 0.1);
}

.form-group input:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.help-text {
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.update-btn {
  background: linear-gradient(135deg, #005596, #0066cc);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.update-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 85, 150, 0.3);
}

.update-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.card-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.card-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.success-message,
.error-message {
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  font-weight: 500;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.success-message p,
.error-message p {
  margin: 0;
}

.danger-zone {
  margin-top: 40px;
  padding: 24px 40px 40px;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
}

.danger-zone h4 {
  color: #dc2626;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.danger-zone p {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.logout-btn {
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

/* 響應式設計 */
@media (max-width: 640px) {
  .profile-container {
    padding: 10px;
  }

  .profile-card {
    max-width: 100%;
    border-radius: 16px;
  }

  .avatar-section {
    padding: 50px 20px 30px;
  }

  .form-section,
  .danger-zone {
    padding: 30px 20px;
  }

  .avatar {
    width: 100px;
    height: 100px;
  }

  .avatar svg {
    width: 50px;
    height: 50px;
  }

  .user-info h2 {
    font-size: 24px;
  }

  .form-section h3 {
    font-size: 20px;
  }
}
</style>
