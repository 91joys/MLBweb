<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>球員評論</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <!-- 新增評論區域 -->
          <div v-if="isLoggedIn" class="add-comment-section">
            <textarea
              v-model="newComment"
              placeholder="分享您對這位球員的看法..."
              class="comment-input"
              :disabled="submissionLoading"
            ></textarea>
            <button
              @click="handleAddComment"
              :disabled="!newComment.trim() || submissionLoading"
              class="submit-btn"
            >
              {{ submissionLoading ? "發布中..." : "發布評論" }}
            </button>
          </div>

          <div v-else class="login-prompt">
            <p>請先登入才能發表評論</p>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- 評論列表 -->
          <div class="comments-section">
            <h4>所有評論 ({{ commentCount }})</h4>

            <div v-if="loading" class="loading">載入評論中...</div>

            <div v-else-if="comments.length === 0" class="no-comments">
              目前還沒有評論，成為第一個評論的人吧！
            </div>

            <div v-else class="comments-list">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-header">
                  <span class="user-email">{{ comment.userEmail }}</span>
                  <div class="comment-meta">
                    <span class="comment-date">{{
                      formatDate(comment.createdAt)
                    }}</span>
                    <span v-if="comment.updatedAt" class="updated-label">
                      (已編輯)
                    </span>
                  </div>
                </div>

                <!-- 編輯模式 -->
                <div v-if="editingCommentId === comment.id" class="edit-mode">
                  <textarea
                    v-model="editText"
                    class="edit-input"
                    :disabled="submissionLoading"
                  ></textarea>
                  <div class="edit-actions">
                    <button
                      @click="handleUpdateComment(comment.id)"
                      :disabled="!editText.trim() || submissionLoading"
                      class="save-btn"
                    >
                      {{ submissionLoading ? "保存中..." : "保存" }}
                    </button>
                    <button
                      @click="handleCancelEdit"
                      :disabled="submissionLoading"
                      class="cancel-btn"
                    >
                      取消
                    </button>
                  </div>
                </div>

                <!-- 顯示模式 -->
                <div v-else>
                  <div class="comment-text">{{ comment.comment }}</div>

                  <!-- 操作按鈕 -->
                  <div v-if="isCommentOwner(comment)" class="comment-actions">
                    <button
                      @click="handleStartEdit(comment)"
                      :disabled="submissionLoading"
                      class="edit-btn"
                    >
                      編輯
                    </button>
                    <button
                      @click="handleDeleteComment(comment.id)"
                      :disabled="submissionLoading"
                      class="delete-btn"
                    >
                      {{ submissionLoading ? "刪除中..." : "刪除" }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: Array,
    default: () => [],
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
  submissionLoading: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  editingCommentId: {
    type: String,
    default: null,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  isCommentOwner: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([
  "close",
  "add-comment",
  "delete-comment",
  "update-comment",
  "start-edit",
  "cancel-edit",
]);

const newComment = ref("");
const editText = ref("");

const closeModal = () => {
  emit("close");
};

const handleOverlayClick = () => {
  closeModal();
};

const handleAddComment = () => {
  if (newComment.value.trim()) {
    emit("add-comment", newComment.value);
    newComment.value = "";
  }
};

const handleDeleteComment = (commentId) => {
  if (confirm("確定要刪除這條評論嗎？")) {
    emit("delete-comment", commentId);
  }
};

const handleStartEdit = (comment) => {
  editText.value = comment.comment;
  emit("start-edit", comment.id);
};

const handleUpdateComment = (commentId) => {
  if (editText.value.trim()) {
    emit("update-comment", commentId, editText.value);
  }
};

const handleCancelEdit = () => {
  editText.value = "";
  emit("cancel-edit");
};

// 當彈窗關閉時清空輸入框
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      newComment.value = "";
      editText.value = "";
    }
  }
);

// 當取消編輯時清空編輯文本
watch(
  () => props.editingCommentId,
  (newVal) => {
    if (!newVal) {
      editText.value = "";
    }
  }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-family: "Century Gothic";
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.add-comment-section {
  margin-bottom: 20px;
}

.comment-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: "Century Gothic";
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.comment-input:focus {
  outline: none;
  border-color: #007bff;
}

.submit-btn {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Century Gothic";
  font-size: 14px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 20px;
  color: #666;
  font-family: "Century Gothic";
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-family: "Century Gothic";
  font-size: 14px;
}

.comments-section h4 {
  margin: 0 0 15px 0;
  font-family: "Century Gothic";
  color: #333;
}

.loading,
.no-comments {
  text-align: center;
  color: #666;
  padding: 20px;
  font-family: "Century Gothic";
}

/* .comments-list {
  space: 15px;
} */

.comment-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.updated-label {
  font-size: 11px;
  color: #888;
  font-style: italic;
}

.edit-mode {
  margin-top: 8px;
}

.edit-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: "Century Gothic";
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
}

.edit-input:focus {
  outline: none;
  border-color: #007bff;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.save-btn,
.cancel-btn,
.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Century Gothic";
  font-size: 12px;
  transition: background-color 0.2s;
}

.save-btn {
  background-color: #28a745;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background-color: #218838;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #5a6268;
}

.comment-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: flex-end;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.save-btn:disabled,
.cancel-btn:disabled,
.edit-btn:disabled,
.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
