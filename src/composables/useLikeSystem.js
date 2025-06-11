import { ref, computed, onMounted, watch } from "vue";
import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase-init";

export function useLikeSystem(playerId, userEmail = "", isLoggedIn = false) {
  const isLiked = ref(false);
  const likeCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const likeIconSrc = computed(() => {
    return isLiked.value
      ? new URL("@/assets/images/like-filled.svg", import.meta.url).href
      : new URL("@/assets/images/like.svg", import.meta.url).href;
  });

  // 初始化載入按讚狀態
  async function loadLikeData() {
    if (!playerId) return;

    loading.value = true;
    error.value = null;

    try {
      // 載入球員的按讚總數
      const playerDocRef = doc(db, "players", playerId);
      const playerDoc = await getDoc(playerDocRef);

      if (playerDoc.exists()) {
        likeCount.value = playerDoc.data().likeCount || 0;
      }

      // 只有登入用戶才載入按讚狀態
      if (isLoggedIn && userEmail) {
        // 使用 email 作為識別，創建安全的文檔 ID
        const safeEmail = userEmail.replace(/[.#$\[\]]/g, "_");
        const userLikeDocRef = doc(db, "userLikes", `${safeEmail}_${playerId}`);
        const userLikeDoc = await getDoc(userLikeDocRef);

        if (userLikeDoc.exists()) {
          isLiked.value = userLikeDoc.data().isLiked || false;
        }
      } else {
        // 未登入時重置按讚狀態
        isLiked.value = false;
      }
    } catch (err) {
      console.error("載入按讚數據失敗:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // 切換按讚狀態
  async function toggleLike() {
    // 檢查是否為登入用戶
    if (!isLoggedIn || !userEmail) {
      error.value = "請先登入才能按讚";
      console.warn("用戶未登入或缺少 email，無法按讚");
      return;
    }

    if (!playerId || loading.value) return;

    loading.value = true;
    error.value = null;
    const newLikedState = !isLiked.value;
    const increment_value = newLikedState ? 1 : -1;

    try {
      // 使用 email 作為識別，創建安全的文檔 ID
      const safeEmail = userEmail.replace(/[.#$\[\]]/g, "_");

      // 更新球員的按讚總數
      const playerDocRef = doc(db, "players", playerId);
      await updateDoc(playerDocRef, {
        likeCount: increment(increment_value),
      }).catch(async () => {
        // 如果文檔不存在，創建新文檔
        await setDoc(playerDocRef, {
          likeCount: Math.max(0, increment_value),
          playerId: playerId,
        });
      });

      // 更新用戶的按讚狀態
      const userLikeDocRef = doc(db, "userLikes", `${safeEmail}_${playerId}`);
      await setDoc(userLikeDocRef, {
        userEmail: userEmail,
        playerId: playerId,
        isLiked: newLikedState,
        timestamp: new Date(),
      });

      // 更新本地狀態
      isLiked.value = newLikedState;
      likeCount.value += increment_value;
      likeCount.value = Math.max(0, likeCount.value); // 確保不會是負數
    } catch (err) {
      console.error("更新按讚狀態失敗:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // 監聽登入狀態和 email 變化，重新載入數據
  watch(
    [() => isLoggedIn, () => userEmail, () => playerId],
    () => {
      loadLikeData();
    },
    { immediate: true }
  );

  return {
    isLiked,
    likeCount,
    likeIconSrc,
    loading,
    error,
    toggleLike,
    loadLikeData,
  };
}
