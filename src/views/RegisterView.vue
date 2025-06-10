<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useRouter } from "vue-router";

const displayName = ref(""); // 新增
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const { signUp, updateUserProfile, currentUser } = useAuth();
const router = useRouter();

const handleRegister = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // 密碼確認檢查
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "密碼與確認密碼不符";
    return;
  }

  // 密碼長度檢查
  if (password.value.length < 6) {
    errorMessage.value = "密碼長度至少需要 6 個字元";
    return;
  }

  try {
    // 註冊帳戶
    await signUp(email.value, password.value);

    // 更新使用者名稱
    if (displayName.value.trim()) {
      await updateUserProfile(displayName.value.trim());
    }

    successMessage.value = "註冊成功！";
    setTimeout(() => {
      router.push("/card");
    }, 1500);
  } catch (err) {
    errorMessage.value = err.message;
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>Dodgers Fans</h1>
        <p>建立新帳戶</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="displayName">姓名</label>
          <input
            id="displayName"
            v-model="displayName"
            type="text"
            placeholder="請輸入您的姓名"
            required
          />
        </div>

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
            placeholder="請輸入密碼（至少 6 個字元）"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">確認密碼</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="請再次輸入密碼"
            required
          />
        </div>

        <button type="submit" class="register-btn">註冊</button>
      </form>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
      </div>

      <div class="login-link">
        <p>
          已有帳戶？
          <button @click="goToLogin" class="link-btn">立即登入</button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #005596;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  color: #1e40af;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
  font-family: "Arial", sans-serif;
}

.register-header p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

.register-form {
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

.register-btn {
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

.register-btn:hover {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.register-btn:active {
  transform: translateY(0);
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

.success-message {
  margin-top: 16px;
  padding: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  text-align: center;
}

.success-message p {
  color: #16a34a;
  font-weight: 500;
  margin: 0;
}

.login-link {
  margin-top: 24px;
  text-align: center;
}

.login-link p {
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
  .register-card {
    padding: 24px;
    margin: 20px;
  }

  .register-header h1 {
    font-size: 24px;
  }
}
</style>
