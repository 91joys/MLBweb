import { ref, onMounted, onUnmounted } from "vue";

export function useAutoplay(nextSlide) {
  const autoplayInterval = ref(null);
  const isPageVisible = ref(true);
  const isAutoplayBlocked = ref(false); // 新增：評論等操作時的阻止狀態

  // 檢測頁面可見性
  const handleVisibilityChange = () => {
    isPageVisible.value = !document.hidden;

    if (isPageVisible.value && !isAutoplayBlocked.value) {
      // 頁面變為可見且沒有其他阻止條件時，重新開始自動播放
      startAutoplay();
    } else {
      // 頁面不可見或有阻止條件時，停止自動播放
      stopAutoplay();
    }
  };

  const startAutoplay = () => {
    // 只有當頁面可見且沒有阻止條件時才開始自動播放
    if (!isPageVisible.value || isAutoplayBlocked.value) return;

    if (autoplayInterval.value) clearInterval(autoplayInterval.value);
    autoplayInterval.value = setInterval(nextSlide, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval.value) {
      clearInterval(autoplayInterval.value);
      autoplayInterval.value = null;
    }
  };

  // 設置阻止自動播放（評論時使用）
  const blockAutoplay = () => {
    isAutoplayBlocked.value = true;
    stopAutoplay();
  };

  // 解除阻止自動播放
  const unblockAutoplay = () => {
    isAutoplayBlocked.value = false;
    if (isPageVisible.value) {
      startAutoplay();
    }
  };

  // 生命週期
  onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    isPageVisible.value = !document.hidden;
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    stopAutoplay();
  });

  return {
    startAutoplay,
    stopAutoplay,
    blockAutoplay,
    unblockAutoplay,
    isPageVisible,
    isAutoplayBlocked,
  };
}
