<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const { login, currentUser } = useAuth();
const router = useRouter();

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    router.push("/card");
  } catch (err) {
    errorMessage.value = err.message;
  }
};

const goToRegister = () => {
  router.push("/register");
};

// 新增：匿名訪客登入
const handleGuestLogin = () => {
  // 創建匿名用戶資訊
  const guestUser = {
    email: "guest@visitor.com",
    displayName: "匿名訪客",
    isGuest: true
  };
  
  // 將訪客資訊存到 localStorage
  localStorage.setItem('guestUser', JSON.stringify(guestUser));
  
  // 直接導向卡片頁面
  router.push("/card");
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Dodgers Fans</h1>
        <p>登入</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="請輸入您的電子郵件"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">密碼</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="請輸入您的密碼"
            required
          />
        </div>

        <button type="submit" class="login-btn">登入</button>
      </form>

      <!-- 新增：匿名訪客按鈕 -->
      <div class="guest-section">
        <div class="divider">
          <span>或</span>
        </div>
        <button @click="handleGuestLogin" class="guest-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
          以匿名訪客身分瀏覽
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="currentUser" class="welcome-message">
        <p>歡迎回來，{{ currentUser.displayName || currentUser.email }}！</p>
      </div>

      <div class="register-link">
        <p>
          還沒有帳戶？
          <button @click="goToRegister" class="link-btn">立即註冊</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #005596;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  color: #1e40af;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  font-family: "Arial", sans-serif;
}

.login-header p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.login-btn {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.login-btn:hover {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

/* 新增：匿名訪客區塊樣式 */
.guest-section {
  margin-top: 24px;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  color: #9ca3af;
  padding: 0 16px;
  font-size: 14px;
  position: relative;
}

.guest-btn {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.guest-btn:hover {
  background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
}

.guest-btn:active {
  transform: translateY(0);
}

.welcome-message {
  margin-top: 24px;
  padding: 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  text-align: center;
}

.welcome-message p {
  color: #0369a1;
  font-weight: 500;
  margin: 0;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  text-align: center;
}

.error-message p {
  color: #dc2626;
  font-weight: 500;
  margin: 0;
}

.register-link {
  margin-top: 24px;
  text-align: center;
}

.register-link p {
  color: #64748b;
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
}

.link-btn:hover {
  color: #1e40af;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 20px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>
