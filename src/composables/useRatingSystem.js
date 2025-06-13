// 建立新檔案 src/composables/useRatingSystem.js
import { ref, computed, watch, onUnmounted } from "vue";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/firebase-init";

export function useRatingSystem(playerIdRef, userEmailRef, isLoggedInRef) {
  // 防護性檢查
  if (
    playerIdRef === undefined ||
    userEmailRef === undefined ||
    isLoggedInRef === undefined ||
    !playerIdRef ||
    !userEmailRef ||
    !isLoggedInRef
  ) {
    // 返回預設值
    return {
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

  const showRatingSelector = ref(false);
  const currentPersonalRating = ref(0);
  const hoverRating = ref(0);
  const allRatingsSum = ref(0);
  const totalRatingCount = ref(0);
  const loading = ref(false); // 用於初始數據加載/監聽器設置
  const ratingSubmissionLoading = ref(false); // 用於提交評分操作
  const error = ref("");

  let unsubscribeRatingListener = null;

  const averageRating = computed(() => {
    if (totalRatingCount.value === 0) return 0;
    return parseFloat(
      (allRatingsSum.value / totalRatingCount.value).toFixed(1)
    );
  });

  async function initRatingDataForPlayer(pId) {
    if (unsubscribeRatingListener) {
      unsubscribeRatingListener();
      unsubscribeRatingListener = null;
    }

    allRatingsSum.value = 0;
    totalRatingCount.value = 0;
    currentPersonalRating.value = 0;

    if (!pId) {
      loading.value = false;
      return;
    }

    loading.value = true;
    error.value = "";

    try {
      const ratingsRef = collection(db, "playerRatings");
      const q = query(ratingsRef, where("playerId", "==", pId));

      unsubscribeRatingListener = onSnapshot(
        q,
        (querySnapshot) => {
          let sum = 0;
          let count = 0;
          let foundPersonalRating = false;
          let personalRatingValue = 0;

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            sum += data.rating;
            count++;

            if (isLoggedInRef.value && data.userEmail === userEmailRef.value) {
              personalRatingValue = data.rating;
              foundPersonalRating = true;
            }
          });

          allRatingsSum.value = sum;
          totalRatingCount.value = count;

          if (isLoggedInRef.value && foundPersonalRating) {
            currentPersonalRating.value = personalRatingValue;
          } else {
            currentPersonalRating.value = 0;
          }
          loading.value = false;
        },
        (err) => {
          console.error("評分即時監聽錯誤:", err);
          error.value = "即時載入評分資料失敗";
          loading.value = false;
        }
      );
    } catch (err) {
      console.error("設定評分監聽失敗:", err);
      error.value = "設定評分監聽失敗";
      loading.value = false;
    }
  }

  // 只有當 playerIdRef 是有效的 ref 時才設置 watch
  watch(
    playerIdRef,
    (newPlayerId) => {
      initRatingDataForPlayer(newPlayerId);
    },
    { immediate: true }
  );

  // 只有當 isLoggedInRef 是有效的 ref 時才設置 watch
  watch(isLoggedInRef, (loggedIn) => {
    if (!loggedIn) {
      currentPersonalRating.value = 0;
      showRatingSelector.value = false;
      hoverRating.value = 0;
    }
  });

  function toggleRatingSelector() {
    if (!isLoggedInRef.value) {
      error.value = "請先登入才能評分";
      return;
    }
    showRatingSelector.value = !showRatingSelector.value;
    if (!showRatingSelector.value) {
      hoverRating.value = 0;
    }
  }

  async function handleRate(rating) {
    if (!isLoggedInRef.value) {
      error.value = "請先登入才能評分";
      return;
    }
    if (!userEmailRef.value || !playerIdRef.value) {
      error.value = "評分資料不完整";
      return;
    }

    ratingSubmissionLoading.value = true;
    error.value = "";

    try {
      const ratingId = `${userEmailRef.value}_${playerIdRef.value}`;
      const ratingRef = doc(db, "playerRatings", ratingId);

      await setDoc(ratingRef, {
        userEmail: userEmailRef.value,
        playerId: playerIdRef.value,
        rating,
        timestamp: new Date(),
      });

      // currentPersonalRating.value 會由 onSnapshot 更新，但也可以在這裡樂觀更新
      // currentPersonalRating.value = rating;
      showRatingSelector.value = false;
      hoverRating.value = 0;
      console.log("評分儲存成功:", rating);
    } catch (err) {
      console.error("儲存評分失敗:", err);
      error.value = "評分儲存失敗，請稍後再試";
    } finally {
      ratingSubmissionLoading.value = false;
    }
  }

  function handleHoverRating(starValue) {
    hoverRating.value = starValue;
  }

  function getStarSelectorIcon(starValue) {
    const ratingToShow =
      hoverRating.value > 0 ? hoverRating.value : currentPersonalRating.value;
    return starValue <= ratingToShow
      ? new URL("@/assets/images/star-filled.svg", import.meta.url).href
      : new URL("@/assets/images/star.svg", import.meta.url).href;
  }

  onUnmounted(() => {
    if (unsubscribeRatingListener) {
      unsubscribeRatingListener();
    }
  });

  return {
    showRatingSelector,
    currentPersonalRating,
    hoverRating,
    averageRating,
    loading,
    ratingSubmissionLoading,
    error,
    toggleRatingSelector,
    handleRate,
    handleHoverRating,
    getStarSelectorIcon,
  };
}
