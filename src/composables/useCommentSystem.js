import { ref, computed, onMounted } from "vue";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase-init";

export function useCommentSystem(playerId, userEmail, isLoggedIn) {
  const comments = ref([]);
  const commentCount = computed(() => comments.value.length);
  const loading = ref(false);
  const error = ref("");
  const submissionLoading = ref(false);
  const editingCommentId = ref(null);

  // 監聽評論變化
  let unsubscribe = null;

  const subscribeToComments = () => {
    if (!playerId.value) return;

    try {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("playerId", "==", playerId.value),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          comments.value = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }));
          loading.value = false;
        },
        (err) => {
          console.error("監聽評論失敗:", err);
          error.value = "載入評論失敗";
          loading.value = false;
        }
      );
    } catch (err) {
      console.error("設置評論監聽失敗:", err);
      error.value = "設置評論監聽失敗";
      loading.value = false;
    }
  };

  // 新增評論
  const addComment = async (commentText) => {
    if (!isLoggedIn.value || !userEmail.value || !playerId.value) {
      error.value = "請先登入";
      return false;
    }

    if (!commentText.trim()) {
      error.value = "評論內容不能為空";
      return false;
    }

    submissionLoading.value = true;
    error.value = "";

    try {
      const commentsRef = collection(db, "comments");
      await addDoc(commentsRef, {
        playerId: playerId.value,
        userEmail: userEmail.value,
        comment: commentText.trim(),
        createdAt: serverTimestamp(),
      });

      console.log("評論新增成功");
      return true;
    } catch (err) {
      console.error("新增評論失敗:", err);
      error.value = "新增評論失敗";
      return false;
    } finally {
      submissionLoading.value = false;
    }
  };

  // 刪除評論
  const deleteComment = async (commentId) => {
    if (!isLoggedIn.value || !userEmail.value) {
      error.value = "請先登入";
      return false;
    }

    submissionLoading.value = true;
    error.value = "";

    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
      console.log("評論刪除成功");
      return true;
    } catch (err) {
      console.error("刪除評論失敗:", err);
      error.value = "刪除評論失敗";
      return false;
    } finally {
      submissionLoading.value = false;
    }
  };

  // 更新評論
  const updateComment = async (commentId, newText) => {
    if (!isLoggedIn.value || !userEmail.value) {
      error.value = "請先登入";
      return false;
    }

    if (!newText.trim()) {
      error.value = "評論內容不能為空";
      return false;
    }

    submissionLoading.value = true;
    error.value = "";

    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        comment: newText.trim(),
        updatedAt: serverTimestamp(),
      });
      console.log("評論更新成功");
      editingCommentId.value = null;
      return true;
    } catch (err) {
      console.error("更新評論失敗:", err);
      error.value = "更新評論失敗";
      return false;
    } finally {
      submissionLoading.value = false;
    }
  };

  // 檢查是否為評論作者
  const isCommentOwner = (comment) => {
    return isLoggedIn.value && userEmail.value === comment.userEmail;
  };

  // 開始編輯
  const startEditComment = (commentId) => {
    editingCommentId.value = commentId;
  };

  // 取消編輯
  const cancelEditComment = () => {
    editingCommentId.value = null;
  };

  // 格式化日期
  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // 清理函數
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  onMounted(() => {
    if (playerId.value) {
      loading.value = true;
      subscribeToComments();
    }
  });

  return {
    comments,
    commentCount,
    loading,
    error,
    submissionLoading,
    editingCommentId,
    addComment,
    deleteComment,
    updateComment,
    isCommentOwner,
    startEditComment,
    cancelEditComment,
    formatDate,
    cleanup,
    subscribeToComments,
  };
}
