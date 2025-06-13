<script setup>
import { ref, toRef, computed } from "vue";
import { useLikeSystem } from "@/composables/useLikeSystem";
import { useRatingSystem } from "@/composables/useRatingSystem";
import { useCommentSystem } from "@/composables/useCommentSystem";
import PopLogin from "./PopLogin.vue";
import CommentModal from "./CommentModal.vue";

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
});

// 按讚系統
const likePlayerIdRef = toRef(props, "playerId");
const likeUserEmailRef = toRef(props, "userEmail");
const likeIsLoggedInRef = toRef(props, "isLoggedIn");

const {
  likeCount,
  likeIconSrc,
  loading: likeLoading,
  error: likeError,
  toggleLike,
} = useLikeSystem(likePlayerIdRef, likeUserEmailRef, likeIsLoggedInRef);

const playerIdArg = toRef(props, "playerId");
const userEmailArg = toRef(props, "userEmail");
const isLoggedInArg = toRef(props, "isLoggedIn");

// 評分系統 - 只有當所有 ref 的 value 都不是 undefined 時才初始化
let ratingSystemResult;
if (
  playerIdArg.value !== undefined &&
  isLoggedInArg.value !== undefined &&
  userEmailArg.value !== undefined
) {
  ratingSystemResult = useRatingSystem(
    playerIdArg,
    userEmailArg,
    isLoggedInArg
  );
} else {
  // 提供預設值
  ratingSystemResult = {
    showRatingSelector: ref(false),
    currentPersonalRating: ref(0),
    hoverRating: ref(0),
    averageRating: computed(() => 0),
    loading: ref(false),
    ratingSubmissionLoading: ref(false),
    error: ref(""),
    toggleRatingSelector: () => {},
    handleRate: () => {},
    handleHoverRating: () => {},
    getStarSelectorIcon: () =>
      new URL("@/assets/images/star.svg", import.meta.url).href,
  };
}

const {
  showRatingSelector,
  currentPersonalRating,
  hoverRating,
  averageRating,
  loading: ratingLoading,
  error: ratingError,
  toggleRatingSelector,
  handleRate,
  handleHoverRating,
  getStarSelectorIcon,
} = ratingSystemResult;

// 評論系統
const {
  comments,
  commentCount,
  loading: commentLoading,
  error: commentError,
  submissionLoading: commentSubmissionLoading,
  editingCommentId,
  addComment,
  deleteComment,
  updateComment,
  isCommentOwner,
  startEditComment,
  cancelEditComment,
  formatDate,
} = useCommentSystem(playerIdArg, userEmailArg, isLoggedInArg);

// 登入彈窗狀態
const showLoginPrompt = ref(false);
// 評論彈窗狀態
const showCommentModal = ref(false);

function handleToggleLike() {
  console.log("點擊按讚按鈕，登入狀態檢查:", {
    isLoggedIn: props.isLoggedIn,
    userEmail: props.userEmail,
  });
  if (!props.isLoggedIn) {
    showLoginPrompt.value = true;
    console.log("顯示登入提示:", showLoginPrompt.value);
    return;
  }

  if (!likeLoading.value) {
    toggleLike();
  }
}

function handleToggleRating() {
  if (!props.isLoggedIn) {
    showLoginPrompt.value = true;
    return;
  }
  toggleRatingSelector();
}

function handleShowComments() {
  showCommentModal.value = true;
  emit("comment-modal-open", props.playerId);
}

function closeLoginPrompt() {
  showLoginPrompt.value = false;
}

function closeCommentModal() {
  showCommentModal.value = false;
  emit("comment-modal-close", props.playerId);
}

async function handleAddComment(commentText) {
  const success = await addComment(commentText);
  if (success) {
    console.log("評論新增成功");
  }
}

async function handleDeleteComment(commentId) {
  const success = await deleteComment(commentId);
  if (success) {
    console.log("評論刪除成功");
  }
}

async function handleUpdateComment(commentId, newText) {
  const success = await updateComment(commentId, newText);
  if (success) {
    console.log("評論更新成功");
  }
}

function handleStartEdit(commentId) {
  startEditComment(commentId);
}

function handleCancelEdit() {
  cancelEditComment();
}

const emit = defineEmits([
  "toggle-rating",
  "rate",
  "hover-rating",
  "comment-modal-open",
  "comment-modal-close",
]);
</script>

<template>
  <!-- 將登入彈窗移到 footer 外面 -->
  <div>
    <footer>
      <div class="action-item">
        <img
          class="star"
          alt="Rate"
          src="@/assets/images/star.svg"
          @click="handleToggleRating"
          :class="{
            loading: ratingLoading,
            'not-logged-in': !isLoggedIn,
          }"
          :title="!isLoggedIn ? '請先登入才能評分' : ''"
        />
        <b class="count-star">平均評分:{{ averageRating || "--" }}/5</b>
      </div>

      <div class="action-item">
        <img
          class="like"
          alt="Like"
          :src="likeIconSrc"
          @click="handleToggleLike"
          :class="{
            loading: likeLoading,
            'not-logged-in': !isLoggedIn,
          }"
          :title="!isLoggedIn ? '請先登入才能按讚' : ''"
        />
        <b class="count-like">喜歡:{{ likeCount }}</b>
      </div>

      <div class="action-item">
        <img
          class="comment"
          alt="Comment"
          src="@/assets/images/comment.svg"
          @click="handleShowComments"
        />
        <b class="count-comment">評論:{{ commentCount }}</b>
      </div>

      <!-- 星星評分選擇器 -->
      <div v-if="showRatingSelector" class="rating-selector-popup">
        <img
          v-for="starValue in 5"
          :key="'rate-star-' + starValue"
          :src="getStarSelectorIcon(starValue)"
          @mouseover="handleHoverRating(starValue)"
          @mouseleave="handleHoverRating(0)"
          @click="handleRate(starValue)"
          class="rating-star-option"
          :alt="'Rate ' + starValue + ' star(s)'"
        />
        <div class="current-rating">
          目前評分: {{ currentPersonalRating || "未評分" }}
        </div>
      </div>
    </footer>

    <!-- 使用 PopLogin 組件 -->
    <teleport to="body">
      <PopLogin :show-prompt="showLoginPrompt" @close="closeLoginPrompt" />
    </teleport>

    <!-- 評論彈窗 -->
    <CommentModal
      :show="showCommentModal"
      :comments="comments"
      :comment-count="commentCount"
      :loading="commentLoading"
      :error="commentError"
      :submission-loading="commentSubmissionLoading"
      :editing-comment-id="editingCommentId"
      :is-logged-in="isLoggedIn"
      :is-comment-owner="isCommentOwner"
      :format-date="formatDate"
      @close="closeCommentModal"
      @add-comment="handleAddComment"
      @delete-comment="handleDeleteComment"
      @update-comment="handleUpdateComment"
      @start-edit="handleStartEdit"
      @cancel-edit="handleCancelEdit"
    />
  </div>
</template>

<style scoped>
footer {
  display: flex;
  align-items: center;
  justify-content: space-around; /* 改為 space-around，避免陰影影響分布 */
  padding: 10px 25px; /* 調整內邊距，讓佈局更舒適 */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  /* 可選: 為了更貼合卡片設計，可以取消註釋下一行來添加頂部邊框 */
  /* border-top: 1px solid #e0e0e0; */
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out;
  gap: 4px;
  cursor: default;
  width: 100px; /* 稍微小一點的固定寬度 */
  flex-shrink: 0;
}

.action-item:hover {
  background-color: rgba(
    0,
    0,
    0,
    0.04
  ); /* 滑鼠懸停在 action-item 上時的背景色 */
}

.star,
.like,
.comment {
  width: 38px;
  height: 38px;
  overflow: hidden;
  cursor: pointer; /* 圖示本身保持可點擊狀態 */
  /* margin-bottom: 5px; */ /* 已被 .action-item 的 gap 屬性取代 */
  transition: transform 0.2s ease-in-out, opacity 0.2s ease; /* 明確指定過渡的 CSS 屬性 */
}

/* 當滑鼠懸停在 action-item 上時，對應的圖示（如果不是 loading 或 not-logged-in 狀態）會放大 */
.action-item:hover .star:not(.loading):not(.not-logged-in),
.action-item:hover .like:not(.loading):not(.not-logged-in),
.action-item:hover .comment:not(.loading):not(.not-logged-in) {
  /* 假設 comment 也可能有類似狀態 */
  transform: scale(1.15); /* 圖示放大效果 */
}

.star.loading,
.like.loading {
  opacity: 0.6;
  cursor: not-allowed;
  /* 基礎 transform 是 scale(1)，在 loading 時不應被 hover 效果覆蓋放大 */
}

.star.not-logged-in,
.like.not-logged-in {
  opacity: 0.5;
  /* cursor: pointer; 已在基礎 .star, .like 中定義 */
  filter: grayscale(100%);
  /* 基礎 transform 是 scale(1)，在 not-logged-in 時不應被 hover 效果覆蓋放大 */
}

.count-star,
.count-like,
.count-comment {
  font-size: 11px; /* 稍微縮小字體 */
  font-family: "Century Gothic";
  color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 過長文字顯示省略號 */
}

/* rating-selector-popup 和其他樣式保持不變 */
.rating-selector-popup {
  position: absolute;
  bottom: 60px; /* 相對於 footer 定位，會在 action items 上方 */
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  z-index: 100;
  min-width: 200px;
}

.rating-star-option {
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  display: inline-block;
}

.rating-star-option:hover {
  transform: scale(1.1);
}

.current-rating {
  font-size: 10px;
  color: #666;
  margin-left: 8px;
  font-family: "Century Gothic";
  white-space: nowrap;
}
</style>
