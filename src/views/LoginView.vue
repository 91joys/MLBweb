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
