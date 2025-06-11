<template>
  <div v-if="showPrompt" class="login-prompt-overlay" @click="closePrompt">
    <div class="login-prompt" @click.stop>
      <h3>需要登入</h3>
      <p>請先登入才能使用按讚功能</p>
      <div class="prompt-buttons">
        <button @click="handleLogin" class="login-btn">登入</button>
        <button @click="closePrompt" class="cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

defineProps({
  showPrompt: Boolean,
});

const emit = defineEmits(["login", "close"]);
const router = useRouter();

function closePrompt() {
  emit("close");
}

function handleLogin() {
  // 關閉彈窗
  emit("close");
  // 跳轉到登入頁面
  router.push("/login");
  // 仍然發出 login 事件，以防父組件需要處理
  emit("login");
}
</script>

<style scoped>
.login-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-prompt {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.prompt-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.login-btn,
.cancel-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.login-btn {
  background: #005596;
  color: white;
}

.cancel-btn {
  background: #f0f0f0;
  color: #333;
}
</style>
