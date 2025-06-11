<script setup>
import { ref } from "vue";
import { useLikeSystem } from "@/composables/useLikeSystem";
import PopLogin from "./PopLogin.vue";

const props = defineProps({
  playerId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    default: "",
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  averageRating: Number,
  showRatingSelector: Boolean,
  getStarIcon: Function,
});

const { likeCount, likeIconSrc, loading, error, toggleLike } = useLikeSystem(
  props.playerId,
  props.userEmail,
  props.isLoggedIn
);

// 登入彈窗狀態
const showLoginPrompt = ref(false);

function handleToggleLike() {
  console.log("點擊按讚按鈕，是否登入:", props.isLoggedIn); // 除錯用
  if (!props.isLoggedIn) {
    showLoginPrompt.value = true;
    console.log("顯示登入提示:", showLoginPrompt.value); // 除錯用
    return;
  }

  if (!loading.value) {
    toggleLike();
  }
}

function closeLoginPrompt() {
  showLoginPrompt.value = false;
}

const emit = defineEmits(["toggle-rating", "rate", "hover-rating"]);
</script>

<template>
  <!-- 將登入彈窗移到 footer 外面 -->
  <div>
    <footer>
      <img
        class="star"
        alt="Rate"
        src="@/assets/images/star.svg"
        @click="$emit('toggle-rating')"
      />
      <b class="count-star">{{ averageRating }}/5</b>

      <img
        class="like"
        alt="Like"
        :src="likeIconSrc"
        @click="handleToggleLike"
        :class="{
          loading: loading,
          'not-logged-in': !isLoggedIn,
        }"
        :title="!isLoggedIn ? '請先登入才能按讚' : ''"
      />
      <b class="count-like">{{ likeCount }}</b>

      <!-- 顯示錯誤訊息 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <img class="comment" alt="" src="@/assets/images/comment.svg" />
      <b class="count-comment">17</b>

      <!-- 星星評分選擇器 -->
      <div v-if="showRatingSelector" class="rating-selector-popup">
        <img
          v-for="starValue in 5"
          :key="'rate-star-' + starValue"
          :src="getStarIcon(starValue)"
          @mouseover="$emit('hover-rating', starValue)"
          @mouseleave="$emit('hover-rating', 0)"
          @click="$emit('rate', starValue)"
          class="rating-star-option"
          :alt="'Rate ' + starValue + ' star(s)'"
        />
      </div>
    </footer>

    <!-- 使用 PopLogin 組件 -->
    <teleport to="body">
      <PopLogin :show-prompt="showLoginPrompt" @close="closeLoginPrompt" />
    </teleport>
  </div>
</template>

<style scoped>
.star {
  position: absolute;
  top: 741px;
  left: 31px;
  width: 38px;
  height: 38px;
  overflow: hidden;
  cursor: pointer;
}

.count-star {
  position: absolute;
  top: 780px;
  left: 36px;
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}

.like {
  position: absolute;
  top: 741px;
  left: 254px;
  width: 38px;
  height: 38px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like.loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.like.not-logged-in {
  opacity: 0.5;
  cursor: pointer; /* 改為 pointer，允許點擊 */
  filter: grayscale(100%);
}

/* 移除這個會阻止點擊的樣式 */
/* .like.disabled {
  pointer-events: none;
} */

.count-like {
  position: absolute;
  top: 780px;
  left: 266px;
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}

.comment {
  position: absolute;
  top: 741px;
  left: 477px;
  width: 38px;
  height: 38px;
  overflow: hidden;
}

.count-comment {
  position: absolute;
  top: 780px;
  left: 489px;
  font-size: 12px;
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
}

.error-message {
  position: absolute;
  top: 800px;
  left: 250px;
  font-size: 10px;
  color: #ff4444;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  white-space: nowrap;
}

.rating-selector-popup {
  position: absolute;
  bottom: 70px;
  left: 20px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 4px;
  z-index: 100;
}

.rating-star-option {
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}

.rating-star-option:hover {
  transform: scale(1.1);
}
</style>
