<template>
  <div v-if="isOpen" class="chat-overlay" @click="closeChat">
    <div class="chat-modal" @click.stop>
      <div class="chat-header">
        <h3>Q.AI</h3>
        <button @click="closeChat" class="close-btn">×</button>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.type]"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        <div v-if="isLoading" class="message ai">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input
          v-model="currentMessage"
          @keyup.enter="sendMessage"
          placeholder="輸入您想了解的道奇隊資訊..."
          :disabled="isLoading"
        />
        <button
          @click="sendMessage"
          :disabled="isLoading || !currentMessage.trim()"
          class="send-btn"
        >
          發送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from "vue";
import { useMLBData } from "@/composables/useMLBData";

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close"]);

const messages = ref([]);
const currentMessage = ref("");
const isLoading = ref(false);
const messagesContainer = ref(null);

const { getTodaysGame, getTeamStats } = useMLBData();

// 關閉聊天
const closeChat = () => {
  emit("close");
};

// 添加消息
const addMessage = (content, type = "ai") => {
  messages.value.push({
    id: Date.now(),
    content,
    type,
    timestamp: new Date(),
  });
  nextTick(() => {
    scrollToBottom();
  });
};

// 滾動到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 格式化時間
const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 發送消息
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = currentMessage.value.trim();
  addMessage(userMessage, "user");
  currentMessage.value = "";

  isLoading.value = true;

  try {
    const response = await getAIResponse(userMessage);
    addMessage(response);
  } catch (error) {
    addMessage("抱歉，我現在無法回答您的問題，請稍後再試。");
  } finally {
    isLoading.value = false;
  }
};

// 獲取今日比賽資訊
const getTodaysGameInfo = async () => {
  try {
    const gameData = await getTodaysGame();
    if (gameData) {
      return `今天道奇隊對戰 ${gameData.opponent}，目前比數 ${
        gameData.score.dodgers
      } : ${gameData.score.opponent}。比賽${
        gameData.status === "live"
          ? "進行中"
          : gameData.status === "finished"
          ? "已結束"
          : "尚未開始"
      }。`;
    } else {
      return "今天道奇隊沒有比賽。";
    }
  } catch (error) {
    return "無法獲取今日比賽資訊。";
  }
};

// AI 回應邏輯
const getAIResponse = async (message) => {
  const lowerMessage = message.toLowerCase();

  // 比賽相關問題
  if (
    lowerMessage.includes("比賽") ||
    lowerMessage.includes("對手") ||
    lowerMessage.includes("比數")
  ) {
    return await getTodaysGameInfo();
  }

  // 球員相關問題
  if (
    lowerMessage.includes("球員") ||
    lowerMessage.includes("打擊") ||
    lowerMessage.includes("投手")
  ) {
    const stats = await getTeamStats();
    return `道奇隊本季表現：勝場 ${stats.wins}，敗場 ${stats.losses}，勝率 ${
      stats.winRate
    }。主力球員包括 ${stats.keyPlayers.join("、")} 等。`;
  }

  // 一般問候
  if (lowerMessage.includes("你好") || lowerMessage.includes("哈囉")) {
    return "您好！我是 Q.AI，道奇隊的專屬助手。我可以為您提供球隊資訊、比賽狀況、球員數據等。有什麼想了解的嗎？";
  }

  // 默認回應
  return "我是道奇隊的 AI 助手，可以回答關於球隊的各種問題。您可以問我比賽資訊、球員數據、戰績等。";
};

// 初始化歡迎消息
const initWelcomeMessage = async () => {
  const gameInfo = await getTodaysGameInfo();
  const welcomeMessage = `歡迎使用 Q.AI！${gameInfo} 有什麼想了解的道奇隊資訊嗎？`;
  addMessage(welcomeMessage);
};

// 監聽打開狀態
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && messages.value.length === 0) {
      initWelcomeMessage();
    }
  }
);
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.chat-modal {
  width: 500px;
  height: 600px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #005596;
  color: white;
  border-radius: 12px 12px 0 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  display: flex;
  flex-direction: column;
}

.message.ai {
  align-self: flex-start;
}

.message.user {
  align-self: flex-end;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.message.ai .message-content {
  background: #f3f4f6;
  color: #374151;
}

.message.user .message-content {
  background: #005596;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
  padding: 0 4px;
}

.chat-input {
  display: flex;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  gap: 12px;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #005596;
}

.send-btn {
  padding: 12px 20px;
  background: #005596;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.3s;
}

.send-btn:hover:not(:disabled) {
  background: #004080;
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .chat-modal {
    width: 90%;
    height: 80%;
  }
}
</style>
